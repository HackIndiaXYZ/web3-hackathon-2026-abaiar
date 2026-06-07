// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ISharpToken} from "./interfaces/ISharpToken.sol";
import {ISharpTokenIntegrator} from "./interfaces/ISharpTokenIntegrator.sol";

/// @title SharpTokenIntegrator
/// @notice Integrates Sharp Token for Earn/Spend/Buy functionality
contract SharpTokenIntegrator is ISharpTokenIntegrator, Ownable {
    ISharpToken public sharpToken;
    address public skillRegistry;

    uint256 public issuerReward = 10 * 1e18;
    uint256 public recipientReward = 5 * 1e18;
    uint256 public verificationFee = 1 * 1e18;

    // Price: 1 MATIC = 100 Sharp Tokens (adjustable)
    uint256 public tokensPerMatic = 100 * 1e18;

    // ============ Events ============

    event RewardsUpdated(uint256 issuerReward, uint256 recipientReward, uint256 verificationFee);
    event TokensPerMaticUpdated(uint256 newValue);

    // ============ Constructor ============

    constructor(
        address sharpToken_,
        address skillRegistry_,
        address owner_
    ) Ownable(owner_) {
        require(sharpToken_ != address(0), "Invalid token address");
        sharpToken = ISharpToken(sharpToken_);
        skillRegistry = skillRegistry_;
    }

    // ============ Earn Tokens ============

    /// @notice Mint tokens to an address (called by SkillRegistry or owner)
    function earnTokens(address to, uint256 amount, string calldata reason) external override {
        require(
            msg.sender == skillRegistry || msg.sender == owner(),
            "Not authorized to earn"
        );
        require(amount > 0, "Amount must be > 0");

        sharpToken.mint(to, amount);
        emit TokensEarned(to, amount, reason);
    }

    // ============ Spend Tokens ============

    /// @notice Burn tokens from an address (requires prior approval)
    function spendTokens(address from, uint256 amount, string calldata purpose) external override {
        require(amount > 0, "Amount must be > 0");
        require(
            sharpToken.allowance(from, address(this)) >= amount,
            "Insufficient allowance"
        );

        sharpToken.burn(from, amount);
        emit TokensSpent(from, amount, purpose);
    }

    // ============ Buy Tokens ============

    /// @notice Buy Sharp Tokens with MATIC
    function buyTokens() external payable override {
        require(msg.value > 0, "Must send MATIC");

        uint256 tokenAmount = (msg.value * tokensPerMatic) / 1e18;
        require(tokenAmount > 0, "Amount too small");

        sharpToken.mint(msg.sender, tokenAmount);
        emit TokensBought(msg.sender, msg.value, tokenAmount);
    }

    // ============ Callback for SkillRegistry ============

    /// @notice Called when a credential is issued
    function onCredentialIssued(address issuer, address recipient) external {
        require(msg.sender == skillRegistry, "Only SkillRegistry");

        sharpToken.mint(issuer, issuerReward);
        emit TokensEarned(issuer, issuerReward, "credential_issued");

        sharpToken.mint(recipient, recipientReward);
        emit TokensEarned(recipient, recipientReward, "credential_received");
    }

    /// @notice Called when a third party requests verification
    function onVerificationRequested(address payer) external {
        sharpToken.burn(payer, verificationFee);
        emit TokensSpent(payer, verificationFee, "verification_fee");
    }

    // ============ Admin ============

    function setRewards(
        uint256 _issuerReward,
        uint256 _recipientReward,
        uint256 _verificationFee
    ) external onlyOwner {
        issuerReward = _issuerReward;
        recipientReward = _recipientReward;
        verificationFee = _verificationFee;
        emit RewardsUpdated(_issuerReward, _recipientReward, _verificationFee);
    }

    function setTokensPerMatic(uint256 _tokensPerMatic) external onlyOwner {
        tokensPerMatic = _tokensPerMatic;
        emit TokensPerMaticUpdated(_tokensPerMatic);
    }

    function setSkillRegistry(address _skillRegistry) external onlyOwner {
        skillRegistry = _skillRegistry;
    }

    /// @notice Withdraw MATIC from contract
    function withdraw() external onlyOwner {
        (bool success, ) = payable(owner()).call{value: address(this).balance}("");
        require(success, "Withdraw failed");
    }

    /// @notice Allow contract to receive MATIC (for buyTokens)
    receive() external payable {}
}
