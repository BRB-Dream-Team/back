const db = require('../db');

class Contributor {
  static async create(contributorData) {
    const { gender, dob, passport_id, agreement_id } = contributorData;
    const query = 'INSERT INTO Contributor (gender, dob, passport_id, agreement_id) VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [gender, dob, passport_id, agreement_id];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findById(contributorId) {
    const query = 'SELECT * FROM Contributor WHERE contributor_id = $1';
    const result = await db.query(query, [contributorId]);
    return result.rows[0];
  }

  static async update(contributorId, contributorData) {
    const { gender, dob, passport_id, agreement_id } = contributorData;
    const query = 'UPDATE Contributor SET gender = $1, dob = $2, passport_id = $3, agreement_id = $4 WHERE contributor_id = $5 RETURNING *';
    const values = [gender, dob, passport_id, agreement_id, contributorId];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async delete(contributorId) {
    const query = 'DELETE FROM Contributor WHERE contributor_id = $1 RETURNING *';
    const result = await db.query(query, [contributorId]);
    return result.rows[0];
  }
}

module.exports = Contributor;