#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

function sortPrismaFields(filePath = "./prisma/schema.prisma") {
  if (!filePath) {
    console.error("Error: Please provide the path to the Prisma schema file.");
    process.exit(1);
  }

  const schemaPath = path.resolve(filePath);

  fs.readFile(schemaPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading schema file:", err);
      process.exit(1);
    }

    // Match all models in the Prisma schema
    const sortedSchema = data.replace(
      /model\s+\w+\s+{[^}]+}/g,
      (modelBlock) => {
        const lines = modelBlock.split("\n");
        const header = lines.shift(); // Keep "model ModelName {"
        const footer = lines.pop(); // Keep "}"

        const fields = lines.filter((line) => line.trim()); // Exclude empty lines

        // Separate fields into categories
        const idField = fields.filter((line) => line.trim().startsWith("id "));
        const originalCreatedAtUpdatedAtFields = fields.filter(
          (line) => line.includes("createdAt") || line.includes("updatedAt")
        );
        const otherFields = fields.filter(
          (line) =>
            !line.trim().startsWith("id ") &&
            !(line.includes("createdAt") || line.includes("updatedAt"))
        );

        // Add missing createdAt and updatedAt fields if needed
        const createdAtUpdatedAtFields = [...originalCreatedAtUpdatedAtFields];
        if (
          !originalCreatedAtUpdatedAtFields.some((line) =>
            line.includes("createdAt")
          )
        ) {
          createdAtUpdatedAtFields.push(
            "    createdAt DateTime @default(now())"
          );
        }
        if (
          !originalCreatedAtUpdatedAtFields.some((line) =>
            line.includes("updatedAt")
          )
        ) {
          createdAtUpdatedAtFields.push("    updatedAt DateTime @updatedAt");
        }

        // Sort `otherFields` alphabetically
        const sortedFields = otherFields.sort((a, b) =>
          a.trim().localeCompare(b.trim())
        );

        // Combine fields in the correct order
        return [
          header,
          ...idField,
          ...sortedFields,
          ...createdAtUpdatedAtFields,
          footer,
        ].join("\n");
      }
    );

    // Write the sorted schema back to the file
    fs.writeFile(schemaPath, sortedSchema, "utf8", (err) => {
      if (err) {
        console.error("Error writing sorted schema:", err);
        process.exit(1);
      }

      console.log("Prisma fields sorted successfully!");

      // Run `npx prisma format` to format the schema
      exec("npx prisma format", (formatErr, stdout, stderr) => {
        if (formatErr) {
          console.error("Error running prisma format:", stderr);
          process.exit(1);
        }
        console.log(stdout);
      });
    });
  });
}

// Run the sorter
const filePath = process.argv[2];
sortPrismaFields(filePath);
