// Generates cloudflare/seed.sql from the Laravel SQLite database.
// Run: node cloudflare/tools/gen_seed.mjs
import { DatabaseSync } from "node:sqlite";
import { pbkdf2Sync, randomBytes } from "node:crypto";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const dbPath = join(here, "..", "..", "database", "database.sqlite");
const outPath = join(here, "..", "seed.sql");

const ITERATIONS = 10000;
const DEMO_PASSWORD = "password123";

const b64url = (buf) => buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

function hashPassword(password) {
  const salt = randomBytes(16);
  const hash = pbkdf2Sync(password, salt, ITERATIONS, 32, "sha256");
  return `pbkdf2$${ITERATIONS}$${b64url(salt)}$${b64url(hash)}`;
}

const q = (value) => {
  if (value === null || value === undefined) return "NULL";
  return "'" + String(value).replace(/'/g, "''") + "'";
};

const db = new DatabaseSync(dbPath, { readOnly: true });

const users = db.prepare("SELECT id, name, email, created_at, updated_at FROM users ORDER BY id").all();
const quotes = db.prepare("SELECT id, user_id, content, created_at, updated_at FROM quotes ORDER BY id").all();
const likes = db.prepare("SELECT id, quote_id, user_id, created_at FROM quote_likes ORDER BY id").all();

const lines = [];
lines.push("-- Generated from database/database.sqlite");
lines.push("PRAGMA foreign_keys = ON;");
lines.push("DELETE FROM quote_likes;");
lines.push("DELETE FROM quotes;");
lines.push("DELETE FROM users;");
lines.push("");

for (const u of users) {
  lines.push(
    `INSERT INTO users (id, name, email, password_hash, created_at, updated_at) VALUES (` +
      `${u.id}, ${q(u.name)}, ${q(u.email)}, ${q(hashPassword(DEMO_PASSWORD))}, ${q(u.created_at)}, ${q(u.updated_at)});`
  );
}

lines.push("");
for (const s of quotes) {
  lines.push(
    `INSERT INTO quotes (id, user_id, content, created_at, updated_at) VALUES (` +
      `${s.id}, ${s.user_id}, ${q(s.content)}, ${q(s.created_at)}, ${q(s.updated_at)});`
  );
}

lines.push("");
for (const l of likes) {
  lines.push(
    `INSERT INTO quote_likes (id, quote_id, user_id, created_at) VALUES (` +
      `${l.id}, ${l.quote_id}, ${l.user_id}, ${q(l.created_at)});`
  );
}

lines.push("");
lines.push("-- keep AUTOINCREMENT counters ahead of the imported ids");
lines.push("DELETE FROM sqlite_sequence;");
lines.push("INSERT INTO sqlite_sequence (name, seq) VALUES ('users', (SELECT MAX(id) FROM users));");
lines.push("INSERT INTO sqlite_sequence (name, seq) VALUES ('quotes', (SELECT MAX(id) FROM quotes));");
lines.push("INSERT INTO sqlite_sequence (name, seq) VALUES ('quote_likes', (SELECT MAX(id) FROM quote_likes));");
lines.push("");

writeFileSync(outPath, lines.join("\n"), "utf8");

console.log(`users=${users.length} quotes=${quotes.length} likes=${likes.length}`);
console.log(`seed written: ${outPath}`);
