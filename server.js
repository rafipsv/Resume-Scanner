const express = require("express");
const app = express();
const path = require("path");
const multer = require("multer");
const resumeConverter = require("./Controllers/resume_controller");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
const upload = multer({ dest: "uploads/" });

app
  .route("/")
  .get((req, res, next) => {
    res.render("index"); // Render the upload form
  })
  .post(upload.single("resume"), resumeConverter.ResumeController);

// **Placeholder functions for skill extraction and comparison (replace with your logic):**

// Serve static files (EJS templates)
app.use(express.static(path.join(__dirname, "public")));

// Start the server
app.listen(3000, () => console.log("Server listening on port 3000"));
