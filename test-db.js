// test-db.js

// 1. Force WebSockets (HTTP) to bypass Firewall
neonConfig.webSocketConstructor = ws;

// 2. PASTE YOUR CONNECTION STRING HERE
const connectionString =
  "postgresql://neondb_owner:npg_WSDgI4UF1EJO@ep-crimson-resonance-ah7nvm66-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

console.log("Testing connection to:", connectionString);

async function run() {
  try {
    console.log("⏳ Attempting to connect...");
    const pool = new Pool({ connectionString });
    const client = await pool.connect();

    console.log("✅ SUCCESS! Connected to Neon.");

    const result = await client.query("SELECT NOW()");
    console.log("📅 Database Time:", result.rows[0]);

    await client.release();
    await pool.end();
  } catch (err) {
    console.error("❌ CONNECTION FAILED");
    console.error(err);
  }
}

run();
