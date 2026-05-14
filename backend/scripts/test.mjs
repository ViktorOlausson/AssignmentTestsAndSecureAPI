import { spawnSync } from "node:child_process";
import Database from "better-sqlite3";

const testEnv = Object.fromEntries(
  Object.entries({
    ...process.env,
    NODE_ENV: "test",
    DATABASE_URL: "file:./test.db",
  }).filter(([, value]) => value !== undefined),
);

const run = (command) => {
  const result = spawnSync(command, {
    env: testEnv,
    shell: true,
    stdio: "inherit",
  });

  if (result.error) {
    console.error(result.error);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
};

const db = new Database("test.db");
db.exec(`
  CREATE TABLE IF NOT EXISTS "Gym" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS "Review" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "gymId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Review_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym" ("id") ON DELETE CASCADE ON UPDATE CASCADE
  );
`);
db.close();

run("npm exec -- vitest run");
