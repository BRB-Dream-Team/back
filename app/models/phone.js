const db = require('../db');

class Phone {
  static async create(phoneData) {
    const { country_code, mobile_operator_code, phone_number } = phoneData;
    const query = 'INSERT INTO Phone (country_code, mobile_operator_code, phone_number) VALUES ($1, $2, $3) RETURNING *';
    const values = [country_code, mobile_operator_code, phone_number];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findById(phoneId) {
    const query = 'SELECT * FROM Phone WHERE phone_id = $1';
    const result = await db.query(query, [phoneId]);
    return result.rows[0];
  }

  static async update(phoneId, phoneData) {
    const { country_code, mobile_operator_code, phone_number } = phoneData;
    const query = 'UPDATE Phone SET country_code = $1, mobile_operator_code = $2, phone_number = $3 WHERE phone_id = $4 RETURNING *';
    const values = [country_code, mobile_operator_code, phone_number, phoneId];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async delete(phoneId) {
    const query = 'DELETE FROM Phone WHERE phone_id = $1 RETURNING *';
    const result = await db.query(query, [phoneId]);
    return result.rows[0];
  }
}

module.exports = Phone;