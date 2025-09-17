const pool = require("../config/db");
const { cloudinary } = require("../config/cloudinary");

// GET ALL PROJECTS
exports.getProjects = async (req, res) => {
  try {
    const projects = await pool.query(
      "SELECT * FROM projects ORDER BY id DESC"
    );
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

// GET PROJECT BY ID
exports.getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await pool.query("SELECT * FROM projects WHERE id=$1", [
      id,
    ]);
    if (project.rows.length === 0)
      return res.status(404).json({ message: "Project not found" });

    const images = await pool.query(
      "SELECT * FROM project_images WHERE project_id=$1",
      [id]
    );

    res.json({
      ...project.rows[0],
      images: images.rows.map((i) => i.image_url),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE PROJECT
exports.createProject = async (req, res) => {
  const { title, location, category, description } = req.body;
  try {
    // cover = file pertama
    const coverUrl = req.files["cover"] ? req.files["cover"][0].path : null;

    const newProject = await pool.query(
      "INSERT INTO projects (title, location, cover, category, description) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [title, location, coverUrl, category, description]
    );

    // images = file lainnya
    if (req.files["images"]) {
      for (let file of req.files["images"]) {
        await pool.query(
          "INSERT INTO project_images (project_id, image_url) VALUES ($1,$2)",
          [newProject.rows[0].id, file.path]
        );
      }
    }

    res.status(201).json(newProject.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE PROJECT
exports.updateProject = async (req, res) => {
  const { id } = req.params;
  const { title, location, category, description } = req.body;

  try {
    const project = await pool.query("SELECT * FROM projects WHERE id=$1", [
      id,
    ]);
    if (project.rows.length === 0)
      return res.status(404).json({ message: "Project not found" });

    const coverUrl = req.files["cover"]
      ? req.files["cover"][0].path
      : project.rows[0].cover;

    const updatedProject = await pool.query(
      `UPDATE projects 
       SET title=$1, location=$2, cover=$3, category=$4, description=$5, updated_at=NOW()
       WHERE id=$6 RETURNING *`,
      [title, location, coverUrl, category, description, id]
    );

    // jika ada gambar baru, tambahkan ke project_images
    if (req.files["images"]) {
      for (let file of req.files["images"]) {
        await pool.query(
          "INSERT INTO project_images (project_id, image_url) VALUES ($1,$2)",
          [id, file.path]
        );
      }
    }

    res.json(updatedProject.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE PROJECT
exports.deleteProject = async (req, res) => {
  const { id } = req.params;
  try {
    const project = await pool.query("SELECT * FROM projects WHERE id=$1", [
      id,
    ]);
    if (project.rows.length === 0)
      return res.status(404).json({ message: "Project not found" });

    // hapus project_images dulu
    await pool.query("DELETE FROM project_images WHERE project_id=$1", [id]);
    // hapus project
    await pool.query("DELETE FROM projects WHERE id=$1", [id]);

    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
