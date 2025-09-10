const pool = require("../config/db");

async function getAllTestimonials() {
  const result = await pool.query("SELECT * FROM testimonials");
  return result.rows;
}

async function createTestimonial({ name, role, quote }) {
  const result = await pool.query(
    "INSERT INTO testimonials (name, role, quote) VALUES ($1,$2,$3) RETURNING *",
    [name, role, quote]
  );
  return result.rows[0];
}

module.exports = { getAllTestimonials, createTestimonial };
