const express = require("express");
const app = express();
const path = require("path");
const multer = require("multer");
const fs = require("fs"); // For file operations
const referenceSkills = require("./referenceSkills");

// Set view engine to EJS
app.set("view engine", "ejs");

// Set path to views directory
app.set("views", path.join(__dirname, "views"));

// Configure Multer for file uploads
const upload = multer({ dest: "uploads/" });

// Route for uploading resume and processing text (handles both GET and POST)
app
  .route("/")
  .get((req, res) => {
    res.render("index"); // Render the upload form
  })
  .post(upload.single("resume"), async (req, res) => {
    const filePath = req.file.path; // Path to uploaded resume file

    try {
      // Read file content (replace with PDF parsing library if needed)
      const text = await fs.promises.readFile(filePath, "utf8");

      // **Placeholder: Implement your skill extraction logic here**
      const extractedSkills = extractSkills(text); // Replace with actual skill extraction

      // Define your reference skills for comparison (replace with your data)

      // **Placeholder: Implement your skill comparison logic here**
      const comparisonResults = compareSkills(extractedSkills, referenceSkills);
      // Render result template with extracted skills and comparison results
      res.render("result", { ...comparisonResults, referenceSkills }); // Spread operator for results
    } catch (error) {
      console.error(error);
      res.status(500).send("Error processing resume");
    } finally {
      // Clean up uploaded file (optional)
      await fs.promises.unlink(filePath);
    }
  });

// **Placeholder functions for skill extraction and comparison (replace with your logic):**

function extractSkills(text) {
  const skills = [];
  referenceSkills.forEach((item, index, arr) => {
    if (text.includes(item)) {
      skills.push(item);
    }
  });

  return skills; // Remove empty strings
}
function compareSkills(extractedSkills, referenceSkills) {
  const matchingSkills = [];
  for (const skill of extractedSkills) {
    if (referenceSkills.includes(skill)) {
      matchingSkills.push(skill);
    }
  }
  const matchPercentage =
    (matchingSkills.length / referenceSkills.length) * 100;
  return { matchingSkills, matchPercentage };
}

// Serve static files (EJS templates)
app.use(express.static(path.join(__dirname, "public")));

// Start the server
app.listen(3000, () => console.log("Server listening on port 3000"));
