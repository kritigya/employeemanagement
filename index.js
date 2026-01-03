require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const app = express();

// ✅ CORS configuration
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://bucolic-tartufo-c59a78.netlify.app"
  ],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "OPTIONS"],
}));

// Extract user from JWT
const getUser = (token) => {
  try {
    if (!token) return null;
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    console.error('JWT verification error:', err);
    return null;
  }
};

// Apollo Server setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization || "";
    const user = getUser(token.replace("Bearer ", ""));
    return { user, req };
  },
});

// Start server function
const startServer = async () => {
  try {
    await server.start();
    server.applyMiddleware({ app, path: "/graphql", cors: false });

    // ✅ Connect to MongoDB (no extra options needed in Mongoose v7+)
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');

    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
      console.log(`GraphQL endpoint: ${process.env.PORT || 5000}${server.graphqlPath}`);
    });
  } catch (err) {
    console.error('Error starting server:', err);
  }
};

startServer();
