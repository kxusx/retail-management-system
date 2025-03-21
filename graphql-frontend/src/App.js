import { useState } from 'react';
import './App.css';

function App() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [activeFunction, setActiveFunction] = useState(null);

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

  const handleButtonClick = (functionName) => {
    setActiveFunction(functionName);
    setOrders([]);
    setError(null);
    setStartDate('');
    setEndDate('');
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
            className={`App-button ${activeFunction === 'function2' ? 'active' : ''}`}
            onClick={() => handleButtonClick('function2')}
          >
            Function 2
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
        
        {error && (
          <div className="error-message" style={{ color: 'red', margin: '10px 0' }}>
            {error}
          </div>
        )}

        {orders && orders.length > 0 && (
          <div className="orders-list">
            <h3>Found {orders.length} orders</h3>
            <ul>
              {orders.map(order => (
                <li key={order.order_id}>
                  Order ID: {order.order_id} - Date: {new Date(order.order_purchase_timestamp).toLocaleDateString()}
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
