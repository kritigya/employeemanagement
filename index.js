require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const app = express();
app.use(cors());

// Function to extract user from the token
const getUser = (token) => {
  try {
    if (!token) return null;
    return jwt.verify(token, process.env.JWT_SECRET);  // Use the JWT_SECRET from .env
  } catch (err) {
    console.error('JWT verification error:', err);
    return null;
  }
};

// Set up Apollo Server with context to include user
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization || '';
    const user = getUser(token.replace('Bearer ', ''));
    return { user };
  },
});

// Function to start the server and connect to MongoDB
const startServer = async () => {
  try {
    await server.start();
    server.applyMiddleware({ app });

    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');

    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  } catch (err) {
    console.error('Error starting server:', err);
  }
};

startServer();
