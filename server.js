const express = require("express");
const app = express();
const path = require("path");
const multer = require("multer");
const fs = require("fs"); // For file operations
const pdfParse = require("pdf-parse");
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
    console.log("Uploaded file path:", req.file.path);
    console.log("Uploaded file MIME type:", req.file.mimetype);
    const filePath = req.file.path; // Path to uploaded resume file
    try {
      const mimeType = req.file.mimetype;
      let extractedSkills = [];
      if (mimeType === "application/pdf") {
        const file = await fs.promises.readFile(filePath);
        extractedSkills = await extractSkillsFromPDF(file);
      } else if (mimeType === "text/plain") {
        const fileData = fs.readFileSync(filePath, "utf-8");
        extractedSkills = extractSkills(fileData);
      } else {
        res
          .status(400)
          .send("Invalid file format. Please upload a PDF or text file.");
        return;
      }

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

async function extractSkillsFromPDF(pdfBuffer) {
  try {
    const parsedText = await pdfParse(pdfBuffer); // Parse PDF text
    const text = parsedText.text; // Get extracted text
    return extractSkills(text); // Call skill extraction function
  } catch (error) {
    console.error("Error parsing PDF:", error);
    return []; // Return empty array on error
  }
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
