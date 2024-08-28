const db = require('../db');

class Category {
  static async create(categoryData) {
    const { name } = categoryData;
    const query = 'INSERT INTO Category (name) VALUES ($1) RETURNING *';
    const result = await db.query(query, [name]);
    return result.rows[0];
  }

  static async findById(categoryId) {
    const query = 'SELECT * FROM Category WHERE category_id = $1';
    const result = await db.query(query, [categoryId]);
    return result.rows[0];
  }

  static async findAll() {
    const query = 'SELECT * FROM Category';
    const result = await db.query(query);
    return result.rows;
  }

  static async update(categoryId, categoryData) {
    const { name } = categoryData;
    const query = 'UPDATE Category SET name = $1 WHERE category_id = $2 RETURNING *';
    const result = await db.query(query, [name, categoryId]);
    return result.rows[0];
  }

  static async delete(categoryId) {
    const query = 'DELETE FROM Category WHERE category_id = $1 RETURNING *';
    const result = await db.query(query, [categoryId]);
    return result.rows[0];
  }
}

module.exports = Category;