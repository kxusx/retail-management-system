const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const { Sequelize, Op } = require('sequelize');
const cors = require('cors');
const initModels = require('./models');

// Create an Express app
const app = express();

// Enable CORS
app.use(cors());

// Set up Sequelize
const sequelize = new Sequelize('retail_db', 'root', 'sql', {
  host: '127.0.0.1',
  dialect: 'mysql',
  port: 3306,
  logging: console.log,
});

// Initialize models
const { Order, OrderItem, Product, Customer } = initModels(sequelize);

// Test the database connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection to database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

testConnection();

// Define the GraphQL schema
const typeDefs = gql`
  type Order {
    order_id: String!
    order_purchase_timestamp: String!
  }

  type ZipCodeCount {
    zip_code: String!
    count: Int!
  }

  type Query {
    ordersBetweenDates(startDate: String!, endDate: String!): [Order]
    topCustomerZipCodes(seller_id: String!): [ZipCodeCount]
  }
`;

// Define the resolvers
const resolvers = {
  Query: {
    ordersBetweenDates: async (_, { startDate, endDate }) => {
      try {
        const orders = await Order.findAll({
          where: {
            order_purchase_timestamp: {
              [Op.between]: [new Date(startDate), new Date(endDate)]
            }
          }
        });
        return orders;
      } catch (error) {
        console.error('Error fetching orders:', error);
        throw new Error(`Failed to fetch orders: ${error.message}`);
      }
    },
    
    topCustomerZipCodes: async (_, { seller_id }) => {
      try {
        console.log('Searching for seller_id:', seller_id);
        const zipCodes = await OrderItem.findAll({
          attributes: [
            [sequelize.col('Order.Customer.zip_code'), 'zip_code'],
            [Sequelize.fn('COUNT', Sequelize.col('Order.Customer.zip_code')), 'count']
          ],
          include: [
            {
              model: Product,
              required: true,
              attributes: [],
              where: { seller_id }
            },
            {
              model: Order,
              required: true,
              attributes: [],
              include: {
                model: Customer,
                required: true,
                attributes: []
              }
            }
          ],
          group: ['Order.Customer.zip_code'],
          order: [[Sequelize.literal('count'), 'DESC']],
          limit: 5,
          raw: true
        });

        console.log('Found zip codes:', zipCodes);
        return zipCodes.map(({ zip_code, count }) => ({
          zip_code,
          count: parseInt(count, 10)
        }));
      } catch (error) {
        console.error('Detailed error:', error);
        throw new Error(`Failed to fetch top zip codes: ${error.message}`);
      }
    }
  }
};

// Create ApolloServer instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Start the server and apply middleware
async function startServer() {
  await server.start();
  server.applyMiddleware({ app });
  
  app.listen(4000, () => {
    console.log('Server is running on http://localhost:4000/graphql');
  });
}

startServer().catch(error => {
  console.error('Failed to start the server:', error);
});
