// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title ERC-5192: Soulbound Tokens
/// @notice Minimal interface for SBT locking status
interface IERC5192 {
    /// @notice Emitted when the locking status is changed
    event Locked(uint256 tokenId);
    event Unlocked(uint256 tokenId);

    /// @notice Returns the locking status of a Soulbound Token
    function locked(uint256 tokenId) external view returns (bool);
}
