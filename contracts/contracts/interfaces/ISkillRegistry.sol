// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title ISkillRegistry
/// @notice Interface for the SkillRegistry contract
interface ISkillRegistry {
    struct CredentialTemplate {
        address issuer;
        string name;
        string description;
        string metadataURI;
        bool active;
        uint256 createdAt;
    }

    struct CredentialData {
        uint256 templateId;
        address recipient;
        address issuer;
        uint256 issuedAt;
        uint256 expiresAt;
        bool revoked;
        string tokenURI;
    }

    event IssuerRegistered(address indexed issuer, string metadataCID);
    event IssuerDeregistered(address indexed issuer);
    event TemplateCreated(uint256 indexed templateId, address indexed issuer, string name);
    event TemplateDeactivated(uint256 indexed templateId);
    event CredentialIssued(uint256 indexed tokenId, address indexed recipient, uint256 indexed templateId);
    event CredentialRevoked(uint256 indexed tokenId);

    function registerIssuer(string calldata metadataCID) external;
    function deregisterIssuer(address issuer) external;
    function createTemplate(string calldata name, string calldata description, string calldata metadataURI) external;
    function deactivateTemplate(uint256 templateId) external;
    function issueCredential(address to, uint256 templateId, uint256 expiresAt, string calldata _tokenURI) external;
    function revokeCredential(uint256 tokenId) external;
    function verifyCredential(uint256 tokenId) external view returns (bool isValid, string memory reason);
    function getCredentialsByAddress(address account) external view returns (uint256[] memory);
    function getTemplate(uint256 templateId) external view returns (CredentialTemplate memory);
    function getCredential(uint256 tokenId) external view returns (CredentialData memory);
}
