import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';

function TokenCreationForm() {
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [initialSupply, setInitialSupply] = useState('');
  const [decimals, setDecimals] = useState(18);
  const [error, setError] = useState(null); // State for error handling

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create token object for backend processing
    const tokenData = {
      name: tokenName,
      symbol: tokenSymbol,
      initialSupply,
      decimals,
    };

    try {
      const response = await fetch('http://localhost:5000/create-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tokenData),
      });

      if (!response.ok) {
        throw new Error('Failed to create token');
      }

      const result = await response.json();
      console.log('Token creation result:', result);
      alert('Token created successfully!');
    } catch (error) {
      console.error('Error creating token:', error);
      setError(error.message); // Set error message to state for user feedback
    }
  };

  return (
    <Container className="mt-5">
      <h2>Create ERC20 Token</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="tokenName">
          <Form.Label>Token Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter token name"
            value={tokenName}
            onChange={(e) => setTokenName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="tokenSymbol">
          <Form.Label>Token Symbol</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter token symbol"
            value={tokenSymbol}
            onChange={(e) => setTokenSymbol(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="initialSupply">
          <Form.Label>Initial Supply</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter initial supply"
            value={initialSupply}
            onChange={(e) => setInitialSupply(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="decimals">
          <Form.Label>Decimals</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter decimals (usually 18)"
            value={decimals}
            onChange={(e) => setDecimals(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Create Token
        </Button>
        
        {error && <div className="text-danger mt-3">{error}</div>} {/* Display error message */}
      </Form>
    </Container>
  );
}

export default TokenCreationForm;
