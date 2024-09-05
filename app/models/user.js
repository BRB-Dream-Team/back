const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class User {
  static async create(userData) {
    const { first_name, last_name, email, password, phone_id, entrepreneur_id, contributor_id } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO Users (first_name, last_name, email, password, phone_id, entrepreneur_id, contributor_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';
    const values = [first_name, last_name, email, hashedPassword, phone_id, entrepreneur_id, contributor_id];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findById(userId) {
    const query = 'SELECT * FROM Users WHERE user_id = $1';
    const result = await db.query(query, [userId]);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM Users WHERE email = $1';
    const result = await db.query(query, [email]);
    return result.rows[0];
  }

  static async update(userId, userData) {
    const { first_name, last_name, phone_id, email, password } = userData;
    let query, values;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query = 'UPDATE Users SET first_name = $1, last_name = $2, phone_id = $3, email = $4, password = $5 WHERE user_id = $6 RETURNING *';
      values = [first_name, last_name, phone_id, email, hashedPassword, userId];
    } else {
      query = 'UPDATE Users SET first_name = $1, last_name = $2, phone_id = $3, email = $4 WHERE user_id = $5 RETURNING *';
      values = [first_name, last_name, phone_id, email, userId];
    }
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async delete(userId) {
    const query = 'DELETE FROM Users WHERE user_id = $1 RETURNING *';
    const result = await db.query(query, [userId]);
    return result.rows[0];
  }

  static async authenticate(email, password) {
    const user = await this.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return { user, token };
    }
    return null;
  }
}

module.exports = User;