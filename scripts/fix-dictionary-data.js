const fs = require("fs");
const path = require("path");

// Read the raw translations file
const rawTranslationsPath = path.join(__dirname, "raw-translations-new.json");
const csvTranslationsPath = path.join(__dirname, "raw-translations-new.csv");
const rawTranslations = require("./raw-translations.json");

// Mongolian to English translations
const mongolianToEnglish = {
  "Хэрэглэгчийн мэдээлэл": "User Information",
  "Та өөрийн мэдээллийг үнэн зөв бөглөнө үү.":
    "Please fill in your information correctly.",
  "Захиалга цуцлах": "Cancel Booking",
  Төлбөр: "Payment",
  Хөнгөлөлт: "Discount",
  "Холбоо барих": "Contact Us",
  "Хаяг: Сүхбаатар дүүрэг 1-р хороо 5-р хороолол 14б байр 52 тоот":
    "Address: Sukhbaatar District, 1st Khoroo, 5th Khoroolol, Building 14b, Apartment 52",
  "Утас:": "Phone:",
  "Цагийн хуваарь:": "Working Hours:",
  "Даваа-Баасан": "Monday-Friday",
  "Цахим шуудан:": "Email:",
  "Сошиал холбоосууд:": "Social Links:",
  "Одоогоор мэдэгдэл байхгүй байна.": "No notifications available.",
  "Өнөөдрийн орох захиалга": "Today's Check-in Bookings",
  үнэлгээ: "reviews",
  Болих: "Cancel",
  Хадгалах: "Save",
  Засах: "Edit",
  "Нийт орлого": "Total Income",
  захиалга: "bookings",
  Өмнөх: "Previous",
  Дараах: "Next",
  "Илэрц олдсонгүй.": "No results found.",
  "Дансны мэдээлэл": "Account Information",
};

// Use a Map to keep only the first occurrence of each key
const translationsMap = new Map();
rawTranslations.forEach((entry) => {
  // Only add the entry if the key hasn't been seen before
  if (!translationsMap.has(entry.key)) {
    // Check if the text is in Mongolian and has a translation
    const text = mongolianToEnglish[entry.text] || entry.text;

    // Remove extra spaces and trim
    const cleanedText = text.replace(/\s+/g, " ").trim();

    translationsMap.set(entry.key, {
      key: entry.key,
      text: cleanedText,
    });
  }
});

// Convert Map back to array
const cleanedTranslations = Array.from(translationsMap.values());

// Write the cleaned data back to JSON file
fs.writeFileSync(
  rawTranslationsPath,
  JSON.stringify(cleanedTranslations, null, 2),
  "utf8",
);

// Create CSV content
const csvHeader = "key,text\n";
const csvContent = cleanedTranslations
  .map(({ key, text }) => `"${key}","${text.replace(/"/g, '""')}"`)
  .join("\n");
const csvData = csvHeader + csvContent;

// Write CSV file
fs.writeFileSync(csvTranslationsPath, csvData, "utf8");

console.log(
  "Successfully cleaned translations data, removed duplicates, translated Mongolian text, and exported to JSON and CSV",
);
