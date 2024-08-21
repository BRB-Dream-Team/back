const db = require('../db');

class Startup {
  static async create(startupData) {
    const { title, active_status, start_date, end_date, description, video_link, donated_amount, number_of_contributors, rating, type, batch, category_id, region_id } = startupData;
    const query = 'INSERT INTO Startup (title, active_status, start_date, end_date, description, video_link, donated_amount, number_of_contributors, rating, type, batch, category_id, region_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *';
    const values = [title, active_status, start_date, end_date, description, video_link, donated_amount, number_of_contributors, rating, type, batch, category_id, region_id];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findById(startupId) {
    const query = 'SELECT * FROM Startup WHERE startup_id = $1';
    const result = await db.query(query, [startupId]);
    return result.rows[0];
  }

  static async update(startupId, startupData) {
    const { title, active_status, start_date, end_date, description, video_link, donated_amount, number_of_contributors, rating, type, batch, category_id, region_id } = startupData;
    const query = 'UPDATE Startup SET title = $1, active_status = $2, start_date = $3, end_date = $4, description = $5, video_link = $6, donated_amount = $7, number_of_contributors = $8, rating = $9, type = $10, batch = $11, category_id = $12, region_id = $13 WHERE startup_id = $14 RETURNING *';
    const values = [title, active_status, start_date, end_date, description, video_link, donated_amount, number_of_contributors, rating, type, batch, category_id, region_id, startupId];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async delete(startupId) {
    const query = 'DELETE FROM Startup WHERE startup_id = $1 RETURNING *';
    const result = await db.query(query, [startupId]);
    return result.rows[0];
  }
}

module.exports = Startup;