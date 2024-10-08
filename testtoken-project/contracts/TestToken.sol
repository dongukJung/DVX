// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TestToken is ERC20, ERC20Permit, Ownable {
    constructor() ERC20("TestToken", "TEST") Ownable(msg.sender) ERC20Permit("TestToken") {
        _mint(msg.sender, 10**9);
	transferOwnership(msg.sender);
    }

    // No mint function to block additional minting after construct.

    function burn(address from, uint256 amount) public {
        _burn(from, amount);
    }
}

