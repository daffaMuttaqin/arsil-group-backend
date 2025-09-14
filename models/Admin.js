const pool = require("../config/db");

class Admin {
  static async findByUsername(username) {
    const result = await pool.query("SELECT * FROM admins WHERE username=$1", [
      username,
    ]);
    return result.rows[0];
  }

  static async create(username, hashedPassword) {
    const result = await pool.query(
      "INSERT INTO admins (username, password) VALUES ($1, $2) RETURNING *",
      [username, hashedPassword]
    );
    return result.rows[0];
  }
}

module.exports = Admin;
