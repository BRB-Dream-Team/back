const db = require('../db');

class Address {
  static async create(addressData) {
    const { street_number, street_name, region, city, country, zip } = addressData;
    const query = 'INSERT INTO Address (street_number, street_name, region, city, country, zip) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
    const values = [street_number, street_name, region, city, country, zip];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findById(addressId) {
    const query = 'SELECT * FROM Address WHERE address_id = $1';
    const result = await db.query(query, [addressId]);
    return result.rows[0];
  }

  static async update(addressId, addressData) {
    const { street_number, street_name, region, city, country, zip } = addressData;
    const query = 'UPDATE Address SET street_number = $1, street_name = $2, region = $3, city = $4, country = $5, zip = $6 WHERE address_id = $7 RETURNING *';
    const values = [street_number, street_name, region, city, country, zip, addressId];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async delete(addressId) {
    const query = 'DELETE FROM Address WHERE address_id = $1 RETURNING *';
    const result = await db.query(query, [addressId]);
    return result.rows[0];
  }
}

module.exports = Address;