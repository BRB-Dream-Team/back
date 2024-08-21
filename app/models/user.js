
const db = require('../db');

class User {
  static async create(userData) {
    const { first_name, last_name, phone_id, email } = userData;
    const query = 'INSERT INTO "User" (first_name, last_name, phone_id, email) VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [first_name, last_name, phone_id, email];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findById(userId) {
    const query = 'SELECT * FROM "User" WHERE user_id = $1';
    const result = await db.query(query, [userId]);
    return result.rows[0];
  }

  static async update(userId, userData) {
    const { first_name, last_name, phone_id, email } = userData;
    const query = 'UPDATE "User" SET first_name = $1, last_name = $2, phone_id = $3, email = $4 WHERE user_id = $5 RETURNING *';
    const values = [first_name, last_name, phone_id, email, userId];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async delete(userId) {
    const query = 'DELETE FROM "User" WHERE user_id = $1 RETURNING *';
    const result = await db.query(query, [userId]);
    return result.rows[0];
  }
}

module.exports = User;