const pool = require("../config/db");

exports.getTestimonials = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM testimonials");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createTestimonial = async (req, res) => {
  const { name, role, quote } = req.body;
  try {
    const newTestimonial = await pool.query(
      "INSERT INTO testimonials (name, role, quote) VALUES ($1,$2,$3) RETURNING *",
      [name, role, quote]
    );
    res.json(newTestimonial.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
