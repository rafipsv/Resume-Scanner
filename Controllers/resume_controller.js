const fs = require("fs"); // For file operations
const referenceSkills = require("../referenceSkills");
const textConverter = require("../Utils/textConverter");
const skils = require("../Utils/extractSkils");
exports.ResumeController = async (req, res, next) => {
  const filePath = req.file.path; // Path to uploaded resume file
  try {
    const mimeType = req.file.mimetype;
    let extractedSkills = [];
    if (mimeType === "application/pdf") {
      const file = await fs.promises.readFile(filePath);
      extractedSkills = await textConverter.extractSkillsFromPDF(file);
    } else if (mimeType === "text/plain") {
      const fileData = fs.readFileSync(filePath, "utf-8");
      extractedSkills = skils.extractSkills(fileData);
    } else {
      res
        .status(400)
        .send("Invalid file format. Please upload a PDF or text file.");
      return;
    }
    const comparisonResults = textConverter.compareSkills(
      extractedSkills,
      referenceSkills
    );
    res.render("result", { ...comparisonResults, referenceSkills });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error processing resume");
  } finally {
    await fs.promises.unlink(filePath);
  }
};
