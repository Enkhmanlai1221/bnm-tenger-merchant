const fs = require("fs");
const path = require("path");
const babel = require("@babel/core");

let translations = [];

function shouldCollectText(text) {
  // Skip if text is empty after trimming
  if (!text.trim()) return false;

  // Skip if text contains only special characters, numbers or symbols
  if (/^[^a-zа-яөү\s]+$/i.test(text)) return false;

  // Skip if text is too short (like single characters)
  if (text.trim().length < 2) return false;

  // Skip if text is just numbers
  if (/^\d+$/.test(text)) return false;

  // Skip if text contains HTML entities or markdown
  if (text.includes("&") || /[<>{}[\]#*`]/.test(text)) return false;

  return true;
}

function processFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");

  babel.transform(content, {
    filename: filePath,
    plugins: [
      ["@babel/plugin-syntax-typescript", { isTSX: true }],
      {
        visitor: {
          JSXElement(path) {
            let isInRender = false;
            let currentPath = path;

            while (currentPath.parentPath) {
              const parent = currentPath.parentPath;
              if (
                (parent.node.type === "ClassMethod" &&
                  parent.node.key.name === "render") ||
                (parent.node.type === "ReturnStatement" &&
                  parent.findParent(
                    (p) =>
                      p.node.type === "FunctionDeclaration" ||
                      p.node.type === "ArrowFunctionExpression",
                  ))
              ) {
                isInRender = true;
                break;
              }
              currentPath = parent;
            }

            if (isInRender) {
              path.traverse({
                JSXText(textPath) {
                  const text = textPath.node.value.trim();
                  if (shouldCollectText(text)) {
                    const location = `${path.hub.file.opts.filename}:${textPath.node.loc.start.line}`;
                    const key = generateKey(text);

                    const existingEntry = translations.find(
                      (t) => t.text === text,
                    );
                    if (!existingEntry) {
                      translations.push({
                        key,
                        text,
                        search: text,
                        locations: [location],
                      });
                    } else {
                      if (!existingEntry.locations.includes(location)) {
                        existingEntry.locations.push(location);
                      }
                    }
                  }
                },
              });
            }
          },
        },
      },
    ],
  });
}

function generateKey(text) {
  // Transliterate text first
  const transliterated = transliterate(text);

  // Convert transliterated text to snake case and clean it up
  const baseKey = transliterated
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  // If the key is longer than 30 characters, create a shorter version
  if (baseKey.length > 30) {
    // Take first 20 characters
    const shortPrefix = baseKey.slice(0, 20);
    // Create a simple hash of the full text
    const hash = text.split("").reduce((acc, char) => {
      return ((acc << 5) - acc + char.charCodeAt(0)) | 0;
    }, 0);
    // Convert hash to hex and take last 8 characters
    const hashSuffix = Math.abs(hash).toString(16).slice(-8);
    return `${shortPrefix}_${hashSuffix}`;
  }

  return baseKey;
}

function transliterate(text) {
  const cyrillicToLatin = {
    // Mongolian specific
    ө: "u",
    Ө: "U",
    ү: "u",
    Ү: "U",
    // Standard Cyrillic
    а: "a",
    б: "b",
    в: "v",
    г: "g",
    д: "d",
    е: "e",
    ё: "yo",
    ж: "zh",
    з: "z",
    и: "i",
    й: "y",
    к: "k",
    л: "l",
    м: "m",
    н: "n",
    о: "o",
    п: "p",
    р: "r",
    с: "s",
    т: "t",
    у: "u",
    ф: "f",
    х: "h",
    ц: "ts",
    ч: "ch",
    ш: "sh",
    щ: "sch",
    ъ: "",
    ы: "y",
    ь: "",
    э: "e",
    ю: "yu",
    я: "ya",
    А: "A",
    Б: "B",
    В: "V",
    Г: "G",
    Д: "D",
    Е: "E",
    Ё: "Yo",
    Ж: "Zh",
    З: "Z",
    И: "I",
    Й: "Y",
    К: "K",
    Л: "L",
    М: "M",
    Н: "N",
    О: "O",
    П: "P",
    Р: "R",
    С: "S",
    Т: "T",
    У: "U",
    Ф: "F",
    Х: "H",
    Ц: "Ts",
    Ч: "Ch",
    Ш: "Sh",
    Щ: "Sch",
    Ъ: "",
    Ы: "Y",
    Ь: "",
    Э: "E",
    Ю: "Yu",
    Я: "Ya",
  };

  return text
    .split("")
    .map((char) => cyrillicToLatin[char] || char)
    .join("");
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (/\.(tsx?|jsx?)$/.test(file)) {
      processFile(filePath);
    }
  }
}

// Scan specific directories
const dirsToScan = ["./src/app", "./src/components"];

dirsToScan.forEach((dir) => {
  if (fs.existsSync(dir)) {
    console.log(`Scanning directory: ${dir}`);
    walkDir(dir);
  } else {
    console.log(`Directory not found: ${dir}`);
  }
});

// Modify the writing function to output the new format
function writeDictionaryFile(translations) {
  const content = `${JSON.stringify(translations, null, 2)}`;
  fs.writeFileSync(
    path.join(process.cwd(), "scripts", "raw-translations.json"),
    content,
  );
}

console.log("Translation dictionary has been generated!");
console.log(`Total translations found: ${translations.length}`);

writeDictionaryFile(translations);
