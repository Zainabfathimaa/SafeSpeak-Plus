/**
 * ===================================
 * DATABASE CONFIGURATION FILE (config/db.js)
 * ===================================
 * 
 * PURPOSE:
 * This file handles all database connection logic.
 * It connects your Node.js backend to MongoDB.
 * 
 * WHY SEPARATE FILE?
 * - Keeps code organized
 * - Reusable connection function
 * - Easy to modify database settings
 * - Better error handling
 * 
 * HOW IT WORKS:
 * 1. Import mongoose (MongoDB tool)
 * 2. Create connection function
 * 3. Handle connection errors
 * 4. Export function to use in server.js
 * 
 * CONNECTION FLOW:
 * server.js → calls connectDB() → MongoDB connection established
 */

import mongoose from 'mongoose';

/**
 * connectDB Function
 * 
 * Connects to MongoDB database
 * 
 * @returns {Promise} - Resolves when connected
 * 
 * WHAT IT DOES:
 * 1. Reads MONGODB_URI from .env file
 * 2. Attempts to connect to MongoDB
 * 3. If success: Logs connection info
 * 4. If error: Logs error and stops process
 */
export const connectDB = async () => {
  try {
    // Connect to MongoDB using connection string from .env
    // mongoose.connect returns a promise
    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      // useNewUrlParser: true,    // Use new URL parser (deprecated, removed in v6+)
      // useUnifiedTopology: true, // Use new connection management (deprecated)
    });

    // If we reach here, connection was successful
    console.log(`
    ╔══════════════════════════════════════════════════════╗
    ║  ✓ MongoDB Connected Successfully!                  ║
    ║  Host: ${connection.connection.host}
    ║  Database: ${connection.connection.name}
    ║  Port: ${connection.connection.port}
    ╚══════════════════════════════════════════════════════╝
    `);

    return connection; // Return connection object

  } catch (error) {
    // If connection fails, log detailed error
    console.error(`
    ╔══════════════════════════════════════════════════════╗
    ║  ✗ MongoDB Connection Failed                         ║
    ║  Error: ${error.message}
    ║  
    ║  Troubleshooting:
    ║  1. Make sure MongoDB is running
    ║     - Windows: mongod (in MongoDB installation)
    ║     - Mac: brew services start mongodb-community
    ║  2. Check MONGODB_URI in .env file
    ║  3. Verify database name is correct
    ║  4. Check firewall/network settings
    ║  
    ║  Using MongoDB Atlas (Cloud)?
    ║  1. Update MONGODB_URI with correct credentials
    ║  2. Add your IP to whitelist in Atlas
    ║  3. Verify username/password in connection string
    ╚══════════════════════════════════════════════════════╝
    `);

    // Stop the server if database connection fails
    process.exit(1); // Exit code 1 = error
  }
};

/**
 * MONGOOSE CONNECTION EVENTS (Optional to listen to)
 * 
 * You can add these event listeners in server.js:
 * 
 * mongoose.connection.on('connected', () => {
 *   console.log('Mongoose connected to database');
 * });
 * 
 * mongoose.connection.on('error', (err) => {
 *   console.log('Mongoose connection error:', err);
 * });
 * 
 * mongoose.connection.on('disconnected', () => {
 *   console.log('Mongoose disconnected from database');
 * });
 */

/**
 * DEFAULT EXPORT
 * Allows importing like: import { connectDB } from './config/db.js'
 */
export default connectDB;

/**
 * ===================================
 * QUICK REFERENCE
 * ===================================
 * 
 * What is Mongoose?
 * - Library that makes MongoDB easier to use
 * - Provides schema validation
 * - Built-in error handling
 * - Connection management
 * 
 * What is MongoDB?
 * - NoSQL database (not like SQL)
 * - Stores data as JSON-like documents
 * - Flexible structure (schema can change)
 * - Great for rapid development
 * 
 * Database vs Schema vs Model:
 * Database = SafeSpeak-Plus (whole database)
 * Collection = users (like a table)
 * Document = individual user (like a row)
 * Schema = defines structure (email, password, etc.)
 * Model = class representing that schema
 * 
 * Connection String Breakdown:
 * mongodb://localhost:27017/safespeak-plus
 * ├─ mongodb:// = protocol
 * ├─ localhost = server address
 * ├─ 27017 = port number
 * └─ safespeak-plus = database name
 * 
 * MongoDB Atlas (Cloud):
 * mongodb+srv://user:pass@cluster.mongodb.net/db-name
 * ├─ mongodb+srv:// = secure protocol
 * ├─ user:pass = credentials
 * ├─ cluster.mongodb.net = server address
 * └─ db-name = database name
 */
