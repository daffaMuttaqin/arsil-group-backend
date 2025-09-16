const Testimonial = require("../models/Testimonial");

// GET all testimonials
exports.getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.getAll();
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET testimonial by ID
exports.getTestimonialById = async (req, res) => {
  try {
    const testimonial = await Testimonial.getById(req.params.id);
    if (!testimonial)
      return res.status(404).json({ message: "Testimonial not found" });
    res.json(testimonial);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE testimonial
exports.createTestimonial = async (req, res) => {
  const { name, role, quote } = req.body;
  try {
    const newTestimonial = await Testimonial.create({ name, role, quote });
    res.status(201).json(newTestimonial);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE testimonial
exports.updateTestimonial = async (req, res) => {
  const { id } = req.params;
  const { name, role, quote } = req.body;
  try {
    const updated = await Testimonial.update(id, { name, role, quote });
    if (!updated)
      return res.status(404).json({ message: "Testimonial not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE testimonial
exports.deleteTestimonial = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Testimonial.delete(id);
    if (!deleted)
      return res.status(404).json({ message: "Testimonial not found" });
    res.json({
      message: "Testimonial deleted successfully",
      testimonial: deleted,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
