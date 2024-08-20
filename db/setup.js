const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const setupDatabase = async () => {
  try {
    // Read the schema file
    const schemaFile = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaFile, 'utf8');

    // Connect to the database
    const client = await pool.connect();

    try {
      // Execute the schema
      await client.query(schema);
      console.log('Database schema has been successfully set up.');
    } finally {
      // Release the client back to the pool
      client.release();
    }
  } catch (err) {
    console.error('An error occurred while setting up the database:', err);
  } finally {
    // Close the pool
    await pool.end();
  }
};

setupDatabase();