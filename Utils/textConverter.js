const pdfParse = require("pdf-parse");
const skils = require("../Utils/extractSkils");

exports.extractSkillsFromPDF = async function extractSkillsFromPDF(pdfBuffer) {
  try {
    const parsedText = await pdfParse(pdfBuffer); // Parse PDF text
    const text = parsedText.text; // Get extracted text
    return skils.extractSkills(text); // Call skill extraction function
  } catch (error) {
    console.error("Error parsing PDF:", error);
    return []; // Return empty array on error
  }
};

exports.compareSkills = function compareSkills(
  extractedSkills,
  referenceSkills
) {
  const matchingSkills = [];
  for (const skill of extractedSkills) {
    if (referenceSkills.includes(skill)) {
      matchingSkills.push(skill);
    }
  }
  const matchPercentage =
    (matchingSkills.length / referenceSkills.length) * 100;
  return { matchingSkills, matchPercentage };
};
