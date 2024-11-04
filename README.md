
# Cross-Wallet & Transaction Scanner with Token Creation Module

This repository contains a Multi-Wallet & Transaction Scanner project for tracking Ethereum (ETH) and Bitcoin (BTC) transactions, with an additional module for token creation on Ethereum. The project automatically scans for transactions every 3 seconds, providing near real-time updates on wallet activity.

## Features

### 1. Automatic Wallet Address Generation
- **New User Registration**: When a user registers, the system automatically generates unique Ethereum and Bitcoin wallet addresses.
- **Instant Scanning Activation**: After wallet creation, transaction scanning for the newly generated addresses begins immediately, ensuring all activity is tracked from the start.

### 2. Multi-Wallet Tracking
- Supports tracking of multiple wallets for both Ethereum (ETH) and Bitcoin (BTC).
- Configurable to add/remove wallets dynamically for comprehensive monitoring.

### 3. Transaction Scanner
- **Automatic Scanning Interval**: The scanner checks for new transactions every 3 seconds, ensuring timely updates and tracking.
- Monitors incoming and outgoing transactions for each wallet.
- Provides real-time notifications for transactions, allowing immediate awareness of any wallet activities.

### 4. Ethereum Token Creation Module
- Simplifies ERC-20 token creation on the Ethereum blockchain.
- Offers customizable options for token properties like name, symbol, supply, and decimals.
- Built with flexibility to adjust token parameters and deploy quickly on the Ethereum network.

## Project Structure

- **scanner/**: Contains the core scripts for scanning ETH and BTC transactions.
- **wallets/**: Wallet configuration files for tracking addresses.
- **tokens/**: Modules for creating ERC-20 tokens on Ethereum.
- **utils/**: Utility functions and helper scripts.

## Getting Started

### Prerequisites
- **Node.js** and **npm**
- **Web3.js** for Ethereum connectivity
- **Bitcoin.js** for BTC transactions
- Access to an **Ethereum node** (e.g., Infura) and a **Bitcoin node**

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/global99a/CrossWallet.git
   cd CrossWallet
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Configure environment variables**:
   - Add wallet addresses and API keys for both Ethereum and Bitcoin.
   - Specify the Ethereum node URL (e.g., Infura) and the Bitcoin node URL.

4. **Run the project**:

   ```bash
   npm start
   ```

## Usage

### Registration and Wallet Initialization
- When a user registers, unique Ethereum and Bitcoin addresses are automatically generated.
- The system begins scanning transactions for each new wallet within 3 seconds of creation, providing immediate tracking and visibility.

### Transaction Scanning
- Scans for new transactions on both Ethereum and Bitcoin every 3 seconds.
- Logs transaction details for each wallet, including:
  - **Timestamp**
  - **Sender and receiver addresses**
  - **Transaction amount**
  - **Token transfers** (if any)

### Token Creation
- Navigate to the **tokens/** directory to access the token creation script.
- Customize token properties as needed (e.g., name, symbol, supply).
- Run the script to deploy a new token on the Ethereum network.

## Highlights

- **Near Real-Time Monitoring**: The 3-second interval ensures that transactions are detected almost as soon as they occur.
- **Automatic Address Generation**: New wallet addresses are generated and monitored from the moment of user registration.
- **Multi-Wallet Compatibility**: Supports an extensive range of wallets, enabling wide-ranging transaction tracking.
- **Modular Token Creation**: Allows users to create and deploy ERC-20 tokens seamlessly.

## License
This project is licensed under the MIT License.

## Contributing
Contributions are welcome! Please submit a pull request with any feature improvements or bug fixes.
