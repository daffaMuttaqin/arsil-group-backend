const pool = require("../config/db");

class Testimonial {
  static async getAll() {
    const result = await pool.query(
      "SELECT * FROM testimonials ORDER BY created_at DESC"
    );
    return result.rows;
  }

  static async getById(id) {
    const result = await pool.query(
      "SELECT * FROM testimonials WHERE id = $1",
      [id]
    );
    return result.rows[0];
  }

  static async create({ name, role, quote }) {
    const result = await pool.query(
      "INSERT INTO testimonials (name, role, quote) VALUES ($1, $2, $3) RETURNING *",
      [name, role, quote]
    );
    return result.rows[0];
  }

  static async update(id, { name, role, quote }) {
    const result = await pool.query(
      `UPDATE testimonials 
       SET name = $1, role = $2, quote = $3, updated_at = NOW()
       WHERE id = $4 RETURNING *`,
      [name, role, quote, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query(
      "DELETE FROM testimonials WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  }
}

module.exports = Testimonial;
