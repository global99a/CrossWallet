// scripts/deploy.js
const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    const Token = await hre.ethers.getContractFactory("MyToken");
    const initialSupply = hre.ethers.utils.parseUnits("1000000", 18); // Example: 1 million tokens with 18 decimals
    const token = await Token.deploy("MyToken", "MTK", initialSupply);

    await token.deployed();

    console.log("Token deployed to:", token.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
