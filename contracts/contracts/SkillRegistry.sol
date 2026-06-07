// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC5192} from "./interfaces/IERC5192.sol";
import {ISkillRegistry} from "./interfaces/ISkillRegistry.sol";
import {ISharpTokenIntegrator} from "./interfaces/ISharpTokenIntegrator.sol";

/// @title SkillRegistry
/// @notice Soulbound Token (SBT) registry for on-chain skill credentials
/// @dev Implements ERC-721 + ERC-5192 for non-transferable credentials
contract SkillRegistry is ERC721, IERC5192, Ownable {
    uint256 private _nextTokenId;
    uint256 private _nextTemplateId;

    // Issuer management
    mapping(address => bool) public isIssuer;
    mapping(address => string) public issuerMetadataCID;
    address[] private _issuerList;

    // Template storage
    mapping(uint256 => ISkillRegistry.CredentialTemplate) private _templates;

    // Credential storage
    mapping(uint256 => ISkillRegistry.CredentialData) private _credentials;

    // SBT lock status
    mapping(uint256 => bool) private _locked;

    // Lookup indices
    mapping(address => uint256[]) private _credentialsByAddress;
    mapping(uint256 => uint256[]) private _credentialsByTemplate;
    mapping(address => uint256[]) private _credentialsByIssuer;

    // Token integrator (optional, can be address(0))
    ISharpTokenIntegrator public tokenIntegrator;

    // ============ Events ============

    event IssuerRegistered(address indexed issuer, string metadataCID);
    event IssuerDeregistered(address indexed issuer);
    event TemplateCreated(uint256 indexed templateId, address indexed issuer, string name);
    event TemplateDeactivated(uint256 indexed templateId);
    event CredentialIssued(uint256 indexed tokenId, address indexed recipient, uint256 indexed templateId);
    event CredentialRevoked(uint256 indexed tokenId);

    // ============ Modifiers ============

    modifier onlyIssuer() {
        require(isIssuer[msg.sender], "Not a registered issuer");
        _;
    }

    // ============ Constructor ============

    constructor(address owner_) ERC721("SkillForge Credential", "SFC") Ownable(owner_) {}

    // ============ Issuer Management ============

    /// @notice Register caller as an issuer
    function registerIssuer(string calldata metadataCID) external {
        require(!isIssuer[msg.sender], "Already registered");
        require(bytes(metadataCID).length > 0, "Metadata CID required");

        isIssuer[msg.sender] = true;
        issuerMetadataCID[msg.sender] = metadataCID;
        _issuerList.push(msg.sender);

        emit IssuerRegistered(msg.sender, metadataCID);
    }

    /// @notice Deregister an issuer (owner only)
    function deregisterIssuer(address issuer) external onlyOwner {
        require(isIssuer[issuer], "Not an issuer");
        isIssuer[issuer] = false;
        delete issuerMetadataCID[issuer];

        emit IssuerDeregistered(issuer);
    }

    /// @notice Get all registered issuer addresses
    function getIssuerList() external view returns (address[] memory) {
        return _issuerList;
    }

    // ============ Template Management ============

    /// @notice Create a new credential template
    function createTemplate(
        string calldata name,
        string calldata description,
        string calldata metadataURI
    ) external onlyIssuer returns (uint256) {
        require(bytes(name).length > 0, "Name required");

        uint256 templateId = _nextTemplateId++;
        _templates[templateId] = ISkillRegistry.CredentialTemplate({
            issuer: msg.sender,
            name: name,
            description: description,
            metadataURI: metadataURI,
            active: true,
            createdAt: block.timestamp
        });

        emit TemplateCreated(templateId, msg.sender, name);
        return templateId;
    }

    /// @notice Deactivate a template (issuer or owner only)
    function deactivateTemplate(uint256 templateId) external {
        ISkillRegistry.CredentialTemplate storage tmpl = _templates[templateId];
        require(tmpl.active, "Template not active");
        require(tmpl.issuer == msg.sender || msg.sender == owner(), "Not authorized");

        tmpl.active = false;
        emit TemplateDeactivated(templateId);
    }

    /// @notice Get template data
    function getTemplate(uint256 templateId) external view returns (ISkillRegistry.CredentialTemplate memory) {
        return _templates[templateId];
    }

    // ============ Credential Issuance ============

    /// @notice Issue a credential SBT to a recipient
    function issueCredential(
        address to,
        uint256 templateId,
        uint256 expiresAt,
        string calldata _tokenURI
    ) external onlyIssuer returns (uint256) {
        require(to != address(0), "Invalid recipient");
        require(_templates[templateId].active, "Template not active");
        require(_templates[templateId].issuer == msg.sender, "Not template issuer");
        require(expiresAt == 0 || expiresAt > block.timestamp, "Invalid expiry");

        uint256 tokenId = _nextTokenId++;

        _mint(to, tokenId);
        _locked[tokenId] = true;

        _credentials[tokenId] = ISkillRegistry.CredentialData({
            templateId: templateId,
            recipient: to,
            issuer: msg.sender,
            issuedAt: block.timestamp,
            expiresAt: expiresAt,
            revoked: false,
            tokenURI: _tokenURI
        });

        // Update indices
        _credentialsByAddress[to].push(tokenId);
        _credentialsByTemplate[templateId].push(tokenId);
        _credentialsByIssuer[msg.sender].push(tokenId);

        // Trigger token reward if integrator is set
        if (address(tokenIntegrator) != address(0)) {
            try tokenIntegrator.earnTokens(msg.sender, tokenIntegrator.issuerReward(), "credential_issued") {} catch {}
            try tokenIntegrator.earnTokens(to, tokenIntegrator.recipientReward(), "credential_received") {} catch {}
        }

        emit CredentialIssued(tokenId, to, templateId);
        emit Locked(tokenId);

        return tokenId;
    }

    // ============ Credential Revocation ============

    /// @notice Revoke a credential (issuer or owner only)
    function revokeCredential(uint256 tokenId) external {
        ISkillRegistry.CredentialData storage cred = _credentials[tokenId];
        require(cred.issuer == msg.sender || msg.sender == owner(), "Not authorized");
        require(!cred.revoked, "Already revoked");

        cred.revoked = true;
        emit CredentialRevoked(tokenId);
    }

    // ============ Credential Verification ============

    /// @notice Verify a credential's validity
    function verifyCredential(uint256 tokenId) external view returns (bool isValid, string memory reason) {
        if (_ownerOf(tokenId) == address(0)) {
            return (false, "Credential does not exist");
        }

        ISkillRegistry.CredentialData memory cred = _credentials[tokenId];

        if (cred.revoked) {
            return (false, "Credential has been revoked");
        }

        if (cred.expiresAt > 0 && block.timestamp > cred.expiresAt) {
            return (false, "Credential has expired");
        }

        if (!_templates[cred.templateId].active) {
            return (false, "Template deactivated");
        }

        return (true, "Valid");
    }

    // ============ Query Methods ============

    function getCredentialsByAddress(address account) external view returns (uint256[] memory) {
        return _credentialsByAddress[account];
    }

    function getCredentialsByTemplate(uint256 templateId) external view returns (uint256[] memory) {
        return _credentialsByTemplate[templateId];
    }

    function getCredentialsByIssuer(address issuer) external view returns (uint256[] memory) {
        return _credentialsByIssuer[issuer];
    }

    function getCredential(uint256 tokenId) external view returns (ISkillRegistry.CredentialData memory) {
        return _credentials[tokenId];
    }

    function totalCredentials() external view returns (uint256) {
        return _nextTokenId;
    }

    function totalTemplates() external view returns (uint256) {
        return _nextTemplateId;
    }

    // ============ ERC-5192 SBT ============

    function locked(uint256 tokenId) external view override returns (bool) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return _locked[tokenId];
    }

    // ============ SBT: Block Transfers ============

    function transferFrom(address, address, uint256) public pure override(ERC721) {
        revert("SBT: transfer is blocked");
    }

    function approve(address, uint256) public pure override(ERC721) {
        revert("SBT: approval is blocked");
    }

    function setApprovalForAll(address, bool) public pure override(ERC721) {
        revert("SBT: approval is blocked");
    }

    // ============ Admin ============

    /// @notice Set the token integrator contract
    function setTokenIntegrator(address integrator) external onlyOwner {
        tokenIntegrator = ISharpTokenIntegrator(integrator);
    }

    /// @notice Override tokenURI to return credential metadata
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return _credentials[tokenId].tokenURI;
    }
}
