const pool = require("../config/db");

exports.getProjects = async (req, res) => {
  try {
    const projects = await pool.query("SELECT * FROM projects");
    const images = await pool.query("SELECT * FROM project_images");

    const combined = projects.rows.map((p) => ({
      ...p,
      images: images.rows
        .filter((img) => img.project_id === p.id)
        .map((i) => i.image_url),
    }));

    res.json(combined);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createProject = async (req, res) => {
  const { title, location, cover, category, description, images } = req.body;
  try {
    const newProject = await pool.query(
      "INSERT INTO projects (title, location, cover, category, description) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [title, location, cover, category, description]
    );

    if (images && images.length > 0) {
      for (let img of images) {
        await pool.query(
          "INSERT INTO project_images (project_id, image_url) VALUES ($1,$2)",
          [newProject.rows[0].id, img]
        );
      }
    }

    res.json(newProject.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
