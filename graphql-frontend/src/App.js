import React, { useState } from 'react';
import './App.css';

const TOP_PRODUCTS_QUERY = `
  query GetTopProducts($sellerId: String!) {
    topProductsBySeller(seller_id: $sellerId) {
      product_id
      product_category_name
      total_sales
    }
  }
`;

const LAST_PRODUCTS_QUERY = `
  query GetLastProducts($customerId: String!) {
    lastThreeProductsByCustomer(customer_id: $customerId) {
      product_id
      product_category_name
      order_purchase_timestamp
    }
  }
`;

const SELLER_REVENUE_QUERY = `
  query GetSellerRevenue($sellerId: String!) {
    sellerTotalRevenue(seller_id: $sellerId) {
      seller_id
      total_revenue
    }
  }
`;

const TOP_SELLERS_QUERY = `
  query GetTopSellers($category: String!) {
    topSellersByCategory(category: $category) {
      seller_id
      total_sales
    }
  }
`;

function App() {
  const [activeFunction, setActiveFunction] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sellerId, setSellerId] = useState('');
  const [orders, setOrders] = useState([]);
  const [zipCodes, setZipCodes] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [error, setError] = useState(null);
  const [customerId, setCustomerId] = useState('');
  const [lastProducts, setLastProducts] = useState([]);
  const [sellerRevenue, setSellerRevenue] = useState(null);
  const [category, setCategory] = useState('');
  const [topSellers, setTopSellers] = useState([]);

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

  const handleTopProducts = async () => {
    if (!sellerId) {
      setError('Please enter a Seller ID');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: TOP_PRODUCTS_QUERY,
          variables: {
            sellerId
          },
        }),
      });

      const result = await response.json();
      if (result.errors) {
        setError(result.errors[0].message);
        setTopProducts([]);
      } else if (result.data) {
        setTopProducts(result.data.topProductsBySeller);
        setError(null);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to fetch top products');
      setTopProducts([]);
    }
  };

  const handleLastProducts = async () => {
    if (!customerId) {
      setError('Please enter a Customer ID');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: LAST_PRODUCTS_QUERY,
          variables: {
            customerId
          },
        }),
      });

      const result = await response.json();
      if (result.errors) {
        setError(result.errors[0].message);
        setLastProducts([]);
      } else if (result.data) {
        setLastProducts(result.data.lastThreeProductsByCustomer);
        setError(null);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to fetch customer orders');
      setLastProducts([]);
    }
  };

  const handleTopSellers = async () => {
    if (!category) {
      setError('Please enter a product category');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: TOP_SELLERS_QUERY,
          variables: {
            category
          },
        }),
      });

      const result = await response.json();
      if (result.errors) {
        setError(result.errors[0].message);
        setTopSellers([]);
      } else if (result.data) {
        setTopSellers(result.data.topSellersByCategory);
        setError(null);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to fetch top sellers');
      setTopSellers([]);
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
            className={`App-button ${activeFunction === 'topProducts' ? 'active' : ''}`}
            onClick={() => handleButtonClick('topProducts')}
          >
            Top Products by Seller
          </button>
          <button 
            className={`App-button ${activeFunction === 'lastProducts' ? 'active' : ''}`}
            onClick={() => handleButtonClick('lastProducts')}
          >
            Last Orders by Customer
          </button>

          <button 
            className={`App-button ${activeFunction === 'topSellers' ? 'active' : ''}`}
            onClick={() => handleButtonClick('topSellers')}
          >
            Top Sellers by Category
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

        {activeFunction === 'topProducts' && (
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
                onClick={handleTopProducts}
                disabled={!sellerId}
              >
                Submit
              </button>
            </div>

            {topProducts.length > 0 && (
              <div className="results">
                <h3>Top 3 Products:</h3>
                <ul>
                  {topProducts.map(product => (
                    <li key={product.product_id}>
                      Category: {product.product_category_name || 'N/A'}<br/>
                      Product ID: {product.product_id}<br/>
                      Total Sales: {product.total_sales}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeFunction === 'lastProducts' && (
          <div className="function-content">
            <div className="customer-input">
              <input
                type="text"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="App-input"
                placeholder="Enter Customer ID"
              />
              <button 
                className="App-button submit-button"
                onClick={handleLastProducts}
                disabled={!customerId}
              >
                Submit
              </button>
            </div>

            {lastProducts.length > 0 && (
              <div className="results">
                <h3>Last 3 Products Ordered:</h3>
                <ul>
                  {lastProducts.map((product, index) => (
                    <li key={index}>
                      Category: {product.product_category_name || 'N/A'}<br/>
                      Product ID: {product.product_id}<br/>
                      Order Date: {new Date(product.order_purchase_timestamp).toLocaleDateString()}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

       
        {activeFunction === 'topSellers' && (
          <div className="function-content">
            <div className="category-input">
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="App-input"
                placeholder="Enter Product Category"
              />
              <button 
                className="App-button submit-button"
                onClick={handleTopSellers}
                disabled={!category}
              >
                Find Top Sellers
              </button>
            </div>

            {topSellers.length > 0 && (
              <div className="results">
                <h3>Top 5 Sellers in {category}:</h3>
                <ul>
                  {topSellers.map((seller, index) => (
                    <li key={seller.seller_id}>
                      #{index + 1}: Seller ID: {seller.seller_id}<br/>
                      Total Sales: {seller.total_sales}
                    </li>
                  ))}
                </ul>
              </div>
            )}
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
