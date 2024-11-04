// server.js
require('dotenv').config();
const express = require('express');
const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());

// Load contract ABI and Bytecode
const artifact = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'artifacts/contracts/MyToken.sol/MyToken.json')));
const abi = artifact.abi;
const bytecode = artifact.bytecode;

// Connect to Ethereum provider
const provider = new ethers.JsonRpcProvider(process.env.INFURA_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

app.post('/create-token', async (req, res) => {
  const { name, symbol, initialSupply } = req.body;

  try {
    // Validate input
    if (!name || !symbol || !initialSupply) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Create a ContractFactory to deploy
    const factory = new ethers.ContractFactory(abi, bytecode, wallet);
    const contract = await factory.deploy(name, symbol, ethers.parseUnits(initialSupply.toString(), 18));
    await contract.deployed();

    console.log('Token deployed at:', contract.address);

    res.json({
      message: 'Token created successfully',
      tokenAddress: contract.address,
    });
  } catch (error) {
    console.error('Error deploying token:', error);
    res.status(500).json({ error: 'Failed to create token' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
