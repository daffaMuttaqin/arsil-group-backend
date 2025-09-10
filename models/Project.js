const pool = require("../config/db");

// Ambil semua project beserta gambar
async function getAllProjects() {
  const projects = await pool.query("SELECT * FROM projects");
  const images = await pool.query("SELECT * FROM project_images");

  return projects.rows.map((p) => ({
    ...p,
    images: images.rows
      .filter((img) => img.project_id === p.id)
      .map((i) => i.image_url),
  }));
}

// Tambah project baru
async function createProject({
  title,
  location,
  cover,
  category,
  description,
  images,
}) {
  const result = await pool.query(
    "INSERT INTO projects (title, location, cover, category, description) VALUES ($1,$2,$3,$4,$5) RETURNING *",
    [title, location, cover, category, description]
  );

  const project = result.rows[0];

  if (images && images.length > 0) {
    for (let img of images) {
      await pool.query(
        "INSERT INTO project_images (project_id, image_url) VALUES ($1,$2)",
        [project.id, img]
      );
    }
  }

  return project;
}

module.exports = { getAllProjects, createProject };
