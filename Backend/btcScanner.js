const axios = require('axios');
const mysql = require('mysql2/promise');
require('dotenv').config();

// Set up MySQL connection
const db = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

// Function to get transactions of a specific address
async function getAddressTransactions(address) {
  try {
    // Update the URL to use BlockCypher's endpoint
    const response = await axios.get(`https://api.blockcypher.com/v1/btc/main/addrs/${address}`);
    return response.data.txrefs || []; // Array of transactions
  } catch (error) {
    console.error(`Error fetching transactions for ${address}:`, error);
    return [];
  }
}

// Function to scan blockchain and update transactions in MySQL for a specific coin
async function scanBlockchain(coin) {
  try {
    console.log(`Scanning for coin: ${coin}`);
    // Fetch all addresses for the specified coin from the dbt_address table
    const [addresses] = await db.query('SELECT * FROM dbt_address WHERE coin_id = ?', [coin]);

    for (const addr of addresses) {
      console.log(`Scanning address: ${addr.address}`);
      const transactions = await getAddressTransactions(addr.address);
      const existingTransactions = JSON.parse('[]');

      for (const tx of transactions) {
        // Check if transaction hash already exists in transaction_history
        const [existingTx] = await db.query(
          'SELECT txhash FROM transaction_history WHERE txhash = ?',
          [tx.tx_hash]
        );

        // Only process if the transaction hash does not already exist
        if (existingTx.length === 0) {
          existingTransactions.push(tx.tx_hash);
          console.log(`New transaction found for ${addr.address} on ${coin}: ${tx.tx_hash}`);

          // Insert new transaction into transaction_history
          await db.query(
            'INSERT INTO transaction_history (userid, `from`, `to`, amount, txhash, fees, i, currency_symbol, `date`, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
              addr.user_id,                      // Assuming user_id corresponds to userid
              addr.address,                      // from
              tx.to || addr.address,             // to (assuming it is the recipient, or can be the same address)
              tx.value || 0,                     // amount (use the correct field from API)
              tx.tx_hash,                        // txhash
              0.0,                               // fees (BlockCypher does not return fees directly)
              '',                                // i (replace with the actual identifier if available)
              coin,                              // currency_symbol (use the coin type)
              new Date(tx.confirmed).toISOString().slice(0, 19).replace('T', ' '), // date
              tx.confirmations || 0              // status (replace with the actual confirmation count)
            ]
          );

          // Check if a balance record already exists for this user and currency
          const [balanceRows] = await db.query(
            'SELECT balance FROM dbt_balance WHERE user_id = ? AND currency_symbol = ?',
            [addr.user_id, coin]
          );

          if (balanceRows.length > 0) {
            // Update the existing balance
            const newBalance = balanceRows[0].balance + (tx.value || 0);
            await db.query(
              'UPDATE dbt_balance SET balance = ? WHERE user_id = ? AND currency_symbol = ?',
              [newBalance, addr.user_id, coin]
            );
          } else {
            // Insert a new balance record if one doesn't exist
            await db.query(
              'INSERT INTO dbt_balance (user_id, currency_symbol, balance) VALUES (?, ?, ?)',
              [addr.user_id, coin, tx.value || 0]
            );
          }
        }
      }

      // Update the address record with new transactions in dbt_address
    //   await db.query(
    //     'UPDATE dbt_address SET transactions = ? WHERE id = ?',
    //     [JSON.stringify(existingTransactions), addr.id]
    //   );
    }
  } catch (error) {
    console.error("Error scanning blockchain:", error);
  }
}

// Define the coin type and scan interval
const coinType = "BTC"; // Change this to the desired coin (e.g., "ETH", "LTC", etc.)
const scanInterval = process.env.SCAN_INTERVAL || 60000; // Default to 60 seconds if not specified

// Initial scan
scanBlockchain(coinType);
// Run the scanner periodically for the specified coin
setInterval(() => scanBlockchain(coinType), scanInterval);
