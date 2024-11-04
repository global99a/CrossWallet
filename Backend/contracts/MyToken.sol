// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyToken is ERC20, Ownable {
    constructor() ERC20("MyToken", "MTK") Ownable(msg.sender) {
        // Optionally mint some tokens to the initial owner
        _mint(msg.sender, 1000 * 10 ** decimals()); // Mints 1000 tokens to the deployer
    }
}
