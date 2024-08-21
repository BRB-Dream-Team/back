const db = require('../db');

class BankAgreement {
  static async create(agreementData) {
    const { document, is_signed } = agreementData;
    const query = 'INSERT INTO BankAgreement (document, is_signed) VALUES ($1, $2) RETURNING *';
    const values = [document, is_signed];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findById(agreementId) {
    const query = 'SELECT * FROM BankAgreement WHERE agreement_id = $1';
    const result = await db.query(query, [agreementId]);
    return result.rows[0];
  }

  static async update(agreementId, agreementData) {
    const { document, is_signed } = agreementData;
    const query = 'UPDATE BankAgreement SET document = $1, is_signed = $2 WHERE agreement_id = $3 RETURNING *';
    const values = [document, is_signed, agreementId];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async delete(agreementId) {
    const query = 'DELETE FROM BankAgreement WHERE agreement_id = $1 RETURNING *';
    const result = await db.query(query, [agreementId]);
    return result.rows[0];
  }
}

module.exports = BankAgreement;