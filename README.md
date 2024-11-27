## `prisma-field-sorter`

A simple CLI tool to sort fields within Prisma models in a `schema.prisma` file.
The tool ensures:

- **`id` fields are always at the top**.
- **`createdAt` and `updatedAt` fields are always at the end**.
- Other fields are sorted **alphabetically**.
- Fields with special characters (e.g., `@`, `[]`) are placed at the very end.

Additionally, the tool formats the schema using `npx prisma format` after
sorting.

---

### ✨ Features

- Automatically organizes your Prisma models for consistency.
- Ensures specific field order:
  - `id` at the top.
  - Alphabetically sorted fields in the middle.
  - `createdAt` and `updatedAt` just before fields with special characters.
- Runs `npx prisma format` after sorting for proper formatting.

---

### 📦 Installation

Install the package globally to use the CLI:

`npm install -g prisma-field-sorter`

---

### 🚀 Usage

Run the command and provide the path to your `schema.prisma` file:

`prisma-field-sorter ./prisma/schema.prisma`

This will:

1.  Sort the fields in your Prisma schema.
2.  Format the schema using `npx prisma format`.

---

### 🛠 Example

#### Before Sorting:

`schema.prisma`

```
model User {
    email String @unique
    updatedAt DateTime @updatedAt
    username String
    createdAt DateTime @default(now())
    id Int @id @default(autoincrement())
    profile Profile? @relation(fields: [profileId], references: [id])
    profileId Int?
    }
```

#### After Sorting:

`schema.prisma`

```
model User {
    id Int @id @default(autoincrement())
    email String @unique
    username String
    profileId Int?
    profile Profile? @relation(fields: [profileId],
    references: [id])
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
    }
```

---

### 🧰 Requirements

- Node.js version **14+**
- Prisma installed in your project

---

### 🛡 Best Practices

For best results, use this tool in combination with Prettier and a pre-commit
hook to enforce schema consistency in team projects.

---

### 💡 Tips

- Add it to your `package.json` scripts for easier usage:

```json
"scripts": {
    "sort-prisma-fields": "prisma-field-sorter ./prisma/schema.prisma"
    }
```

- Use it in your CI pipeline to ensure sorted and formatted Prisma schemas.

---

### 🤝 Contributing

Contributions are welcome! To get started:

1.  Clone the repository:

    ```bash
    git clone https://github.com/yourusername/prisma-field-sorter.git
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

Feel free to open issues or submit pull requests.

---

### 📝 License

This project is licensed under the MIT License.

---

### 💬 Feedback

For feedback or issues, open a GitHub issue or contact me at
[kifah.andary@gmail.com](mailto:kifah.andary@gmail.com).

---
