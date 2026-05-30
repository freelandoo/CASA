const fs = require("fs");
const path = require("path");
const pool = require("./db");

// Aplica o migrations.sql na subida do servidor.
// Tudo no .sql é idempotente (IF NOT EXISTS), então rodar repetidas vezes é seguro.
async function runMigrations() {
  const sqlPath = path.join(__dirname, "migrations.sql");
  const sql = fs.readFileSync(sqlPath, "utf8");
  console.log("🔧 Aplicando migrations...");
  await pool.query(sql);
  console.log("✅ Migrations aplicadas com sucesso");
}

module.exports = { runMigrations };
