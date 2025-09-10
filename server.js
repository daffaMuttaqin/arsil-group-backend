const express = require("express");
const cors = require("cors");
require("dotenv").config();

const projectRoutes = require("./routes/projectRoutes");
const testimonialRoutes = require("./routes/testimonialRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/projects", projectRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
