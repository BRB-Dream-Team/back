const db = require('../db');

class Entrepreneur {
  static async create(entrepreneurData) {
    const { gender, dob, passport_id, address_id, agreement_id, startup_id } = entrepreneurData;
    const query = 'INSERT INTO Entrepreneur (gender, dob, passport_id, address_id, agreement_id, startup_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
    const values = [gender, dob, passport_id, address_id, agreement_id, startup_id];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findById(entrepreneurId) {
    const query = 'SELECT * FROM Entrepreneur WHERE entrepreneur_id = $1';
    const result = await db.query(query, [entrepreneurId]);
    return result.rows[0];
  }

  static async update(entrepreneurId, entrepreneurData) {
    const { gender, dob, passport_id, address_id, agreement_id, startup_id } = entrepreneurData;
    const query = 'UPDATE Entrepreneur SET gender = $1, dob = $2, passport_id = $3, address_id = $4, agreement_id = $5, startup_id = $6 WHERE entrepreneur_id = $7 RETURNING *';
    const values = [gender, dob, passport_id, address_id, agreement_id, startup_id, entrepreneurId];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async delete(entrepreneurId) {
    const query = 'DELETE FROM Entrepreneur WHERE entrepreneur_id = $1 RETURNING *';
    const result = await db.query(query, [entrepreneurId]);
    return result.rows[0];
  }
}

module.exports = Entrepreneur;