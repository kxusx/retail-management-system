const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const { Sequelize, DataTypes, Op } = require('sequelize');
const cors = require('cors'); // Add this for CORS support

// Create an Express app
const app = express();

// Enable CORS
app.use(cors());

// Set up Sequelize with your local database credentials
const sequelize = new Sequelize('retail_db', 'root', 'sql', {  // Replace '' with your MySQL password if you have one
    host: '127.0.0.1',  // Use 127.0.0.1 instead of localhost,
  dialect: 'mysql',
  port: 3306,
  logging: console.log, // Set to false to disable SQL query logging
});

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

// Define an Order model
const Order = sequelize.define('Order', {
  order_id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
  },
  order_purchase_timestamp: {
    type: DataTypes.DATE,
    allowNull: true,
  }
}, {
  tableName: 'Order', // Specify the actual table name in your database
  timestamps: false    // Set to true if your table has createdAt and updatedAt columns
});

// Define the GraphQL schema
const typeDefs = gql`
  type Order {
    order_id: String!
    order_purchase_timestamp: String!
  }

  type Query {
    ordersBetweenDates(startDate: String!, endDate: String!): [Order]
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
        throw new Error('Failed to fetch orders');
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
