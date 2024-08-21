const db = require('../db');

class Region {
  static async create(regionData) {
    const { name } = regionData;
    const query = 'INSERT INTO Region (name) VALUES ($1) RETURNING *';
    const result = await db.query(query, [name]);
    return result.rows[0];
  }

  static async findById(regionId) {
    const query = 'SELECT * FROM Region WHERE region_id = $1';
    const result = await db.query(query, [regionId]);
    return result.rows[0];
  }

  static async update(regionId, regionData) {
    const { name } = regionData;
    const query = 'UPDATE Region SET name = $1 WHERE region_id = $2 RETURNING *';
    const result = await db.query(query, [name, regionId]);
    return result.rows[0];
  }

  static async delete(regionId) {
    const query = 'DELETE FROM Region WHERE region_id = $1 RETURNING *';
    const result = await db.query(query, [regionId]);
    return result.rows[0];
  }
}

module.exports = Region;