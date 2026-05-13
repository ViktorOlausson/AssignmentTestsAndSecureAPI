import express from "express";
// Import { PrismaClient } from "./generated/prisma/client.js";
// Import { PrismaPg } from "@prisma/adapter-pg";
// Import "dotenv/config";

const app = express();
app.use(express.json());
const PORT = 3000;
// Const connectionString = process.env.DATABASE_URL;

// If (!connectionString) {
//   Throw new Error("DATABASE_URL is not set");
// }

// Const adapter = new PrismaPg({ connectionString });
// Const prisma = new PrismaClient({ adapter });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:3000`);
});

app.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});
