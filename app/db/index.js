const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const checkConnection = () => {
  return new Promise((resolve, reject) => {
    pool.connect((err, client, release) => {
      if (err) {
        reject('❌ Error acquiring client: ' + err.stack);
        return;
      }
      resolve('✅ DB');
      release();
    });
  });
};

module.exports = {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect(),
  checkConnection,
};