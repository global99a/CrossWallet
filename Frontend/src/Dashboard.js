import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DataTable from 'react-data-table-component';

function Dashboard() {
  const [balances, setBalances] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          // Fetch balance
          const balanceResponse = await fetch('http://localhost:3000/balance', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!balanceResponse.ok) {
            throw new Error('Failed to fetch balance');
          }

          const balanceData = await balanceResponse.json();
          setBalances(balanceData);

          // Fetch address
          const addressResponse = await fetch('http://localhost:3000/address', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!addressResponse.ok) {
            throw new Error('Failed to fetch address');
          }

          const addressData = await addressResponse.json();
          setAddresses(addressData);

          // Fetch transactions
          const transactionsResponse = await fetch('http://localhost:3000/transactions', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!transactionsResponse.ok) {
            throw new Error('Failed to fetch transactions');
          }

          const transactionsData = await transactionsResponse.json();
          setTransactions(transactionsData);

        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };

    // Fetch data initially
    fetchData();

    // Set interval to fetch data every 3 seconds
    const intervalId = setInterval(fetchData, 3000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Define columns for DataTable
  const transactionColumns = [
    { name: 'From', selector: row => row.from, sortable: true },
    { name: 'To', selector: row => row.to, sortable: true },
    { name: 'Amount', selector: row => `${row.amount} ${row.currency_symbol}`, sortable: true },
    { name: 'Date', selector: row => new Date(row.date).toLocaleString(), sortable: true },
    { name: 'Status', selector: row => (row.status === 1 ? 'Completed' : 'Pending'), sortable: true },
  ];

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="/">Cross Wallet</a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item active">
              <a className="nav-link" href="/">Home <span className="sr-only">(current)</span></a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Profile</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/logout">Logout</a>
            </li>
          </ul>
        </div>
      </nav>

      <div className="container">
        <Row className="my-4">
          {balances.map((balanceItem, index) => (
            <Col key={index} md={6}>
              <Card className="mb-4" style={{ borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}>
                <Card.Body>
                  <Card.Title>{balanceItem.currency_symbol} Balance</Card.Title>
                  <Card.Text>
                    Balance: {balanceItem.balance.toLocaleString()} {balanceItem.currency_symbol}
                  </Card.Text>
                  <Button variant="primary" onClick={() => alert(`Check ${balanceItem.currency_symbol} balance clicked!`)}>Check Balance</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <Row className="my-4">
          {addresses.map((addressItem, index) => (
            <Col key={index} md={6}>
              <Card className="mb-4" style={{ borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}>
                <Card.Body>
                  <Card.Title>{addressItem.coin_id} Address</Card.Title>
                  <Card.Text>
                    Address: <span className="text-truncate">{addressItem.address}</span>
                  </Card.Text>
                  <Button variant="primary" onClick={() => alert(`Address button clicked for ${addressItem.coin_id}!`)}>Show Address</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <h3 className="my-4">Recent Transactions</h3>
        <DataTable
          columns={transactionColumns}
          data={transactions}
          pagination
          highlightOnHover
          striped
          responsive
          defaultSortField="date"
        />
      </div>
    </div>
  );
}

export default Dashboard;
