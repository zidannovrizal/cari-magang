// Test koneksi ke Railway backend
import fetch from "node-fetch";

const testConnection = async () => {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://cari-magang-be-production.up.railway.app";

  console.log("🔍 Testing connection to Railway backend...");
  console.log("📍 API URL:", apiUrl);

  try {
    // Test health endpoint
    console.log("\n1. Testing health endpoint...");
    const healthResponse = await fetch(`${apiUrl}/api/health`);
    const healthData = await healthResponse.json();
    console.log("✅ Health check:", healthData);

    // Test popular jobs endpoint
    console.log("\n2. Testing popular jobs endpoint...");
    const popularResponse = await fetch(`${apiUrl}/api/job-board/popular`);
    const popularData = await popularResponse.json();
    console.log("✅ Popular jobs:", popularData.success ? "Success" : "Failed");

    // Test organizations endpoint
    console.log("\n3. Testing organizations endpoint...");
    const orgResponse = await fetch(`${apiUrl}/api/job-board/organizations`);
    const orgData = await orgResponse.json();
    console.log("✅ Organizations:", orgData.success ? "Success" : "Failed");

    console.log("\n🎉 All tests completed successfully!");
  } catch (error) {
    console.error("❌ Connection failed:", error.message);
    console.log("\n🔧 Troubleshooting tips:");
    console.log("1. Check if Railway backend is running");
    console.log("2. Verify NEXT_PUBLIC_API_URL in .env.local");
    console.log("3. Check Railway logs for backend errors");
    console.log("4. Ensure CORS is properly configured");
    console.log("5. Try with public Railway URL instead of internal");

    // Test dengan public URL sebagai fallback
    console.log("\n🔄 Trying with public Railway URL...");
    try {
      const publicUrl = "https://cari-magang-be-production.up.railway.app";
      const healthResponse = await fetch(`${publicUrl}/api/health`);
      const healthData = await healthResponse.json();
      console.log("✅ Public URL works:", healthData);
    } catch (publicError) {
      console.error("❌ Public URL also failed:", publicError.message);
    }
  }
};

// Run test if called directly
if (typeof window === "undefined") {
  testConnection();
}

export default testConnection;
