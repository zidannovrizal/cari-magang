// Test koneksi database Railway
import pg from "pg";

const testDatabase = async () => {
  const DATABASE_URL =
    "postgresql://postgres:password@switchyard.proxy.rlwy.net:13187/railway";

  console.log("🔍 Testing Railway database connection...");
  console.log(
    "📍 Database URL:",
    DATABASE_URL.replace(/\/\/.*@/, "//***:***@")
  );

  try {
    const client = new pg.Client({
      connectionString: DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });

    await client.connect();
    console.log("✅ Database connection successful!");

    // Test query
    const result = await client.query(
      "SELECT NOW() as current_time, version() as postgres_version"
    );
    console.log("📊 Current time:", result.rows[0].current_time);
    console.log(
      "📊 PostgreSQL version:",
      result.rows[0].postgres_version.split(" ")[0]
    );

    // Check tables
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);

    console.log(
      "📋 Available tables:",
      tablesResult.rows.map((row) => row.table_name)
    );

    // Check users table
    try {
      const usersResult = await client.query(
        "SELECT COUNT(*) as user_count FROM users"
      );
      console.log("👥 Users count:", usersResult.rows[0].user_count);
    } catch (error) {
      console.log("❌ Users table not found or empty");
    }

    // Check internships table
    try {
      const internshipsResult = await client.query(
        "SELECT COUNT(*) as internship_count FROM internships"
      );
      console.log(
        "💼 Internships count:",
        internshipsResult.rows[0].internship_count
      );
    } catch (error) {
      console.log("❌ Internships table not found or empty");
    }

    await client.end();
    console.log("\n🎉 Database test completed successfully!");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    console.log("\n🔧 Troubleshooting:");
    console.log("1. Check if Railway database is running");
    console.log("2. Verify DATABASE_URL in Railway environment variables");
    console.log("3. Check Railway logs for database errors");
    console.log("4. Ensure database schema is created");
  }
};

testDatabase();
