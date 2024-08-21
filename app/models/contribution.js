const db = require('../db');

class Contribution {
  static async create(contributionData) {
    const { start_date, end_date, amount, startup_id, contributor_id } = contributionData;
    const query = 'INSERT INTO Contribution (start_date, end_date, amount, startup_id, contributor_id) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const values = [start_date, end_date, amount, startup_id, contributor_id];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findById(contributionId) {
    const query = 'SELECT * FROM Contribution WHERE contribution_id = $1';
    const result = await db.query(query, [contributionId]);
    return result.rows[0];
  }

  static async update(contributionId, contributionData) {
    const { start_date, end_date, amount, startup_id, contributor_id } = contributionData;
    const query = 'UPDATE Contribution SET start_date = $1, end_date = $2, amount = $3, startup_id = $4, contributor_id = $5 WHERE contribution_id = $6 RETURNING *';
    const values = [start_date, end_date, amount, startup_id, contributor_id, contributionId];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async delete(contributionId) {
    const query = 'DELETE FROM Contribution WHERE contribution_id = $1 RETURNING *';
    const result = await db.query(query, [contributionId]);
    return result.rows[0];
  }
}

module.exports = Contribution;