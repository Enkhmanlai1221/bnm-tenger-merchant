const fs = require("fs");
const path = require("path");
const dictionary = require("./raw-translations.json");

// Get unique directories from dictionary locations
function getUniqueDirs(dictionary) {
  const dirs = new Set();
  dictionary.forEach((item) => {
    item.locations.forEach((location) => {
      const filePath = location.split(":")[0];
      const dir = path.dirname(filePath);
      dirs.add(dir);
    });
  });
  return Array.from(dirs);
}

// Get unique files from dictionary locations
function getUniqueFiles(dictionary) {
  const files = new Set();
  dictionary.forEach((item) => {
    item.locations.forEach((location) => {
      const filePath = location.split(":")[0];
      files.add(filePath);
    });
  });
  return Array.from(files);
}

function replaceStringsInFile(filePath, translations) {
  let content = fs.readFileSync(filePath, "utf8");
  const lines = content.split("\n");

  // Find all translations that appear in this file
  const fileTranslations = translations.filter((item) =>
    item.locations.some((loc) => loc.split(":")[0] === filePath),
  );

  // Sort translations by length (longest first) to avoid partial replacements
  fileTranslations.sort((a, b) => b.text.length - a.text.length);

  // Replace each translation
  fileTranslations.forEach((item) => {
    const { key, text, locations } = item;

    // Get line numbers for this file
    const fileLineNumbers = locations
      .filter((loc) => loc.split(":")[0] === filePath)
      .map((loc) => Number(loc.split(":")[1]))
      .sort((a, b) => b - a); // Sort in reverse order

    // Replace text in specific lines
    fileLineNumbers.forEach((lineNum) => {
      const line = lines[lineNum - 1];
      if (line) {
        const escapedText = text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(`(>\\s*)${escapedText}(\\s*<)`, "g");
        lines[lineNum - 1] = line.replace(
          regex,
          `$1{translate('${key}', '${text}')}$2`,
        );
      }
    });
  });

  // Add import if it doesn't exist
  const importStatement = "import { useLanguage } from '@/providers/language';";
  const hookStatement = "const { translate } = useLanguage();";

  if (!content.includes(importStatement)) {
    // Find the last import statement
    const lastImportIndex = lines.findIndex((line, index) => {
      const nextLine = lines[index + 1] || "";
      return line.startsWith("import") && !nextLine.startsWith("import");
    });

    if (lastImportIndex !== -1) {
      lines.splice(lastImportIndex + 1, 0, importStatement);
    } else {
      // If no imports found, add at the beginning
      lines.unshift(importStatement);
    }
  }

  // Add hook usage if it's a functional component
  if (!content.includes(hookStatement)) {
    // Find the first line after function declaration or arrow function
    const functionStartIndex = lines.findIndex((line) =>
      /^(export\s+)?(function|const)\s+\w+\s*[=]?\s*(\(|<)/.test(line),
    );

    if (functionStartIndex !== -1) {
      // Find the opening bracket of the function body
      const bodyStartIndex = lines.findIndex(
        (line, index) => index >= functionStartIndex && line.includes("{"),
      );

      if (bodyStartIndex !== -1) {
        lines.splice(bodyStartIndex + 1, 0, "  " + hookStatement);
      }
    }
  }

  // Write the modified content back to file
  fs.writeFileSync(filePath, lines.join("\n"));
}

// Main execution
try {
  console.log("Starting translation replacement process...");

  // Get unique files to process
  const filesToProcess = getUniqueFiles(dictionary);

  // Process each file
  filesToProcess.forEach((filePath) => {
    console.log(`Processing ${filePath}...`);
    if (fs.existsSync(filePath)) {
      replaceStringsInFile(filePath, dictionary);
    } else {
      console.warn(`⚠️ File not found: ${filePath}`);
    }
  });

  console.log("✅ String replacement completed successfully!");
  console.log(`📝 Processed ${filesToProcess.length} files`);
} catch (error) {
  console.error("❌ Error replacing strings:", error);
}

// Export the function
module.exports = { replaceStringsInFile };
