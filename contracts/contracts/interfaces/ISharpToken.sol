// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title ISharpToken
/// @notice Interface for the Sharp Token (ERC-20 compatible)
interface ISharpToken {
    function mint(address to, uint256 amount) external;
    function burn(address from, uint256 amount) external;
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);
}
