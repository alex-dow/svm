import fs from "fs";

export const parseDocs = (docsPath: string) => {
  const docs = fs.readFileSync(docsPath, "utf16le");

  // Remove BOM (Byte Order Mark) if present
  const cleanedDocs = docs.replace(/^\uFEFF/, "");

  return JSON.parse(cleanedDocs);
};
