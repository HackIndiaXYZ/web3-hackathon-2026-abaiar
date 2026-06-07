// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title ISharpTokenIntegrator
/// @notice Interface for Sharp Token integration (Earn/Spend/Buy)
interface ISharpTokenIntegrator {
    event TokensEarned(address indexed to, uint256 amount, string reason);
    event TokensSpent(address indexed from, uint256 amount, string purpose);
    event TokensBought(address indexed buyer, uint256 maticAmount, uint256 tokenAmount);

    function earnTokens(address to, uint256 amount, string calldata reason) external;
    function spendTokens(address from, uint256 amount, string calldata purpose) external;
    function buyTokens() external payable;

    function issuerReward() external view returns (uint256);
    function recipientReward() external view returns (uint256);
    function verificationFee() external view returns (uint256);
}
