// Check backend Railway status
import fetch from "node-fetch";

const checkBackendStatus = async () => {
  const urls = [
    "https://cari-magang-be-production.up.railway.app",
    "https://cari-magang-be.railway.internal",
  ];

  console.log("🔍 Checking Railway backend status...");

  for (const url of urls) {
    console.log(`\n📍 Testing: ${url}`);

    try {
      // Test basic connectivity
      const response = await fetch(url, {
        method: "GET",
        timeout: 5000,
      });

      console.log(`✅ Status: ${response.status} ${response.statusText}`);

      if (response.ok) {
        // Test health endpoint
        try {
          const healthResponse = await fetch(`${url}/api/health`);
          const healthData = await healthResponse.json();
          console.log("✅ Health endpoint:", healthData);
        } catch (healthError) {
          console.log("❌ Health endpoint failed:", healthError.message);
        }

        // Test job-board endpoint
        try {
          const jobResponse = await fetch(`${url}/api/job-board/popular`);
          const jobData = await jobResponse.json();
          console.log(
            "✅ Job-board endpoint:",
            jobData.success ? "Success" : "Failed"
          );
        } catch (jobError) {
          console.log("❌ Job-board endpoint failed:", jobError.message);
        }
      }
    } catch (error) {
      console.log(`❌ Connection failed: ${error.message}`);
    }
  }

  console.log("\n🔧 Troubleshooting:");
  console.log("1. Check Railway dashboard for deployment status");
  console.log("2. Check Railway logs for errors");
  console.log("3. Verify environment variables in Railway");
  console.log("4. Check if database is connected");
};

checkBackendStatus();
