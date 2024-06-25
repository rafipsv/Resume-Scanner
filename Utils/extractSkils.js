const referenceSkills = require("../referenceSkills");
exports.extractSkills = function extractSkills(text) {
  const skills = [];
  referenceSkills.forEach((item, index, arr) => {
    if (text.includes(item)) {
      skills.push(item);
    }
  });

  return skills; // Remove empty strings
};
