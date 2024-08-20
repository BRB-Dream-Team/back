const db = require('../db');

class Passport {
  static async create(passportData) {
    const { series, number, issue_date, expiration_date } = passportData;
    const query = 'INSERT INTO Passport (series, number, issue_date, expiration_date) VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [series, number, issue_date, expiration_date];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findById(passportId) {
    const query = 'SELECT * FROM Passport WHERE passport_id = $1';
    const result = await db.query(query, [passportId]);
    return result.rows[0];
  }

  static async update(passportId, passportData) {
    const { series, number, issue_date, expiration_date } = passportData;
    const query = 'UPDATE Passport SET series = $1, number = $2, issue_date = $3, expiration_date = $4 WHERE passport_id = $5 RETURNING *';
    const values = [series, number, issue_date, expiration_date, passportId];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async delete(passportId) {
    const query = 'DELETE FROM Passport WHERE passport_id = $1 RETURNING *';
    const result = await db.query(query, [passportId]);
    return result.rows[0];
  }
}

module.exports = Passport;