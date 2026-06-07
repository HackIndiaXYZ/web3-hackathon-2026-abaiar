// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title MockSharpToken
/// @notice Mock ERC-20 token for testing (replaces real Sharp Token)
contract MockSharpToken is ERC20, Ownable {
    constructor(address owner_) ERC20("Sharp Token", "SHARP") Ownable(owner_) {
        _mint(owner_, 1_000_000 * 1e18);
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external onlyOwner {
        _burn(from, amount);
    }
}
