import React, { useState } from 'react';
import './App.css';

function App() {
  const [activeFunction, setActiveFunction] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sellerId, setSellerId] = useState('');
  const [orders, setOrders] = useState([]);
  const [zipCodes, setZipCodes] = useState([]);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    try {
      const response = await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            query GetOrdersBetweenDates($startDate: String!, $endDate: String!) {
              ordersBetweenDates(startDate: $startDate, endDate: $endDate) {
                order_id
                order_purchase_timestamp
              }
            }
          `,
          variables: {
            startDate,
            endDate,
          },
        }),
      });

      const result = await response.json();
      
      if (result.errors) {
        setError(result.errors[0].message);
        setOrders([]);
        return;
      }

      if (result.data && result.data.ordersBetweenDates) {
        setOrders(result.data.ordersBetweenDates);
        setError(null);
      } else {
        setOrders([]);
        setError('No data received from server');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to fetch orders');
      setOrders([]);
    }
  };

  const handleTopZipCodes = async () => {
    try {
      const response = await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            query GetTopCustomerZipCodes($sellerId: String!) {
              topCustomerZipCodes(seller_id: $sellerId) {
                zip_code
                count
              }
            }
          `,
          variables: {
            sellerId,
          },
        }),
      });

      const result = await response.json();
      
      if (result.errors) {
        setError(result.errors[0].message);
        setZipCodes([]);
        return;
      }

      if (result.data && result.data.topCustomerZipCodes) {
        setZipCodes(result.data.topCustomerZipCodes);
        setError(null);
      } else {
        setZipCodes([]);
        setError('No data received from server');
      }
    } catch (error) {
      console.error('Error fetching zip codes:', error);
      setError('Failed to fetch zip codes');
      setZipCodes([]);
    }
  };

  const handleButtonClick = (functionName) => {
    setActiveFunction(functionName);
    setOrders([]);
    setZipCodes([]);
    setError(null);
    setStartDate('');
    setEndDate('');
    setSellerId('');
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="button-group">
          <button 
            className={`App-button ${activeFunction === 'searchOrders' ? 'active' : ''}`}
            onClick={() => handleButtonClick('searchOrders')}
          >
            Search Orders
          </button>
          <button 
            className={`App-button ${activeFunction === 'topZipCodes' ? 'active' : ''}`}
            onClick={() => handleButtonClick('topZipCodes')}
          >
            Top Customer Zip Codes
          </button>
          <button 
            className={`App-button ${activeFunction === 'function3' ? 'active' : ''}`}
            onClick={() => handleButtonClick('function3')}
          >
            Function 3
          </button>
          <button 
            className={`App-button ${activeFunction === 'function4' ? 'active' : ''}`}
            onClick={() => handleButtonClick('function4')}
          >
            Function 4
          </button>
          <button 
            className={`App-button ${activeFunction === 'function5' ? 'active' : ''}`}
            onClick={() => handleButtonClick('function5')}
          >
            Function 5
          </button>
        </div>

        {activeFunction === 'searchOrders' && (
          <div className="function-content">
            <div className="date-inputs">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="App-input"
                placeholder="Start Date"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="App-input"
                placeholder="End Date"
              />
              <button 
                className="App-button submit-button"
                onClick={handleSearch}
                disabled={!startDate || !endDate}
              >
                Submit
              </button>
            </div>
          </div>
        )}

        {activeFunction === 'topZipCodes' && (
          <div className="function-content">
            <div className="seller-input">
              <input
                type="text"
                value={sellerId}
                onChange={(e) => setSellerId(e.target.value)}
                className="App-input"
                placeholder="Enter Seller ID"
              />
              <button 
                className="App-button submit-button"
                onClick={handleTopZipCodes}
                disabled={!sellerId}
              >
                Submit
              </button>
            </div>
          </div>
        )}
        
        {error && (
          <div className="error-message" style={{ color: 'red', margin: '10px 0' }}>
            {error}
          </div>
        )}

        {activeFunction === 'searchOrders' && orders.length > 0 && (
          <div className="results">
            <h3>Orders:</h3>
            <ul>
              {orders.map(order => (
                <li key={order.order_id}>
                  Order ID: {order.order_id}, Date: {new Date(order.order_purchase_timestamp).toLocaleDateString()}
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeFunction === 'topZipCodes' && zipCodes.length > 0 && (
          <div className="results">
            <h3>Top 5 Customer Zip Codes:</h3>
            <ul>
              {zipCodes.map(item => (
                <li key={item.zip_code}>
                  Zip Code: {item.zip_code}, Count: {item.count}
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
