require('dotenv').config();
const Web3 = require('web3').default; // Ensure you are using the default export
const mysql = require('mysql2/promise');

// Initialize with a WebSocket provider
const web3 = new Web3(new Web3.providers.WebsocketProvider(process.env.INFURA_URL));

// MySQL connection pool
const db = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

// Function to fetch and log the latest block for testing
const fetchLatestBlock = async () => {
    try {
        const latestBlock = await web3.eth.getBlockNumber();
        console.log(`Latest block number: ${latestBlock}`);
        const block = await web3.eth.getBlock(latestBlock, true);
        console.log('Fetched block:', block);
    } catch (error) {
        console.error('Error fetching the latest block:', error);
    }
};

const fetchAddressesAndBalances = async (connection) => {
    try {
        // Fetch Ethereum addresses and user IDs
        const [addressRows] = await connection.query(
            'SELECT address, user_id FROM dbt_address WHERE coin_id = "ETH"'
        );

        // Map addresses to user IDs
        const addressUserMap = new Map();
        addressRows.forEach(row => {
            addressUserMap.set(row.address.toLowerCase(), row.user_id);
        });

        // Fetch balances for each user_id
        const userIds = Array.from(new Set(addressRows.map(row => row.user_id)));
        const [balanceRows] = await connection.query(
            'SELECT user_id, balance FROM dbt_balance WHERE user_id IN (?)',
            [userIds]
        );

        // Map user IDs to balances
        const userBalanceMap = new Map();
        balanceRows.forEach(row => {
            userBalanceMap.set(row.user_id, row.balance);
        });

        return { addressUserMap, userBalanceMap };
    } catch (err) {
        console.error('Error fetching addresses and balances:', err);
        throw err;
    }
};

const insertTransactionHistory = async (connection, transactionHistoryData) => {
    try {
        if (transactionHistoryData.length > 0) {
            await connection.query(
                `INSERT INTO transaction_history 
                (userid, \`from\`, \`to\`, amount, txhash, fees, i, currency_symbol, \`date\`, status) 
                VALUES ?`,
                [transactionHistoryData]
            );
            console.log(`Inserted ${transactionHistoryData.length} records into transaction_history.`);
        }
    } catch (err) {
        console.error('Error inserting transaction history:', err);
    }
};

const scanBlock = async () => {
    const latestBlock = await web3.eth.getBlockNumber();
    console.log(`Starting from block: ${latestBlock}`);

    const subscription = web3.eth.subscribe('newBlockHeaders', (error, blockHeader) => {
        if (error) {
            console.error('Subscription error:', error);
            return;
        }
    });

    subscription.then((sub) => {
        sub.on('data', async (blockHeader) => {
            try {
                
                const block = await web3.eth.getBlock(blockHeader.number, true);
                //console.log(blockHeader.number,new Date(Number(block.timestamp) * 1000));
                // const block = await web3.eth.getBlock(blockHeader.number, true);
const timestamp = new Date(Number(block.timestamp) * 1000);

// Convert to IST (add 5 hours 30 minutes)
const istTime = new Date(timestamp.getTime() + (5 * 60 + 30) * 60 * 1000);

console.log(blockHeader.number, istTime.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }));

                const uniqueAddresses = new Set(block.transactions.map(tx => tx.to?.toLowerCase()).filter(Boolean));

                const connection = await db.getConnection();
                try {
                    const { addressUserMap, userBalanceMap } = await fetchAddressesAndBalances(connection);

                    const transactionData = [];
                    const transactionHistoryData = [];

                    for (const tx of block.transactions) {
                        const toAddress = tx.to?.toLowerCase();
                        if (toAddress && addressUserMap.has(toAddress)) {
                            const userId = addressUserMap.get(toAddress);
                            const valueInEther = web3.utils.fromWei(tx.value, 'ether');
                            const timestamp = new Date(Number(block.timestamp) * 1000);

                            transactionData.push([tx.hash, toAddress, valueInEther, timestamp]);

                            transactionHistoryData.push([
                                userId,
                                tx.from,
                                toAddress,
                                valueInEther,
                                tx.hash,
                                0, // Assuming fees are 0, modify as necessary
                                0, // Placeholder for `i` if not applicable
                                'ETH',
                                timestamp,
                                '1'
                            ]);
                        }
                    }

                    if (transactionData.length > 0) {
                        await connection.query(
                            `INSERT IGNORE INTO transactions (tx_hash, to_address, value, timestamp) 
                            VALUES ?`,
                            [transactionData]
                        );
                    }

                    await insertTransactionHistory(connection, transactionHistoryData);
                } finally {
                    connection.release();
                }
            } catch (error) {
                console.error('Error fetching block details:', error);
            }
        });

        sub.on('error', (error) => {
            console.error('Subscription encountered an error:', error);
        });

        sub.on('end', () => {
            console.log('Subscription ended. Reconnecting...');
            scanBlock();
        });
    }).catch((error) => {
        console.error('Failed to create subscription:', error);
    });
};



// Start the process
const main = async () => {
    await fetchLatestBlock();
    await scanBlock();
};

main().catch(console.error);
