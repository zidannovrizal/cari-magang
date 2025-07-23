// Debug Railway backend secara detail
import fetch from "node-fetch";

const debugBackend = async () => {
  const baseUrl = "https://cari-magang-be-production.up.railway.app";

  console.log("🔍 Debugging Railway backend...");
  console.log("📍 Base URL:", baseUrl);

  const endpoints = [
    { path: "/", method: "GET", name: "Root" },
    { path: "/api/health", method: "GET", name: "Health" },
    { path: "/api/job-board/popular", method: "GET", name: "Popular Jobs" },
    {
      path: "/api/job-board/organizations",
      method: "GET",
      name: "Organizations",
    },
    { path: "/api/auth/login", method: "POST", name: "Login" },
    { path: "/api/sdg8", method: "GET", name: "SDG8" },
  ];

  for (const endpoint of endpoints) {
    console.log(`\n🔗 Testing: ${endpoint.method} ${endpoint.path}`);

    try {
      const options = {
        method: endpoint.method,
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000,
      };

      // Add body for POST requests
      if (endpoint.method === "POST") {
        options.body = JSON.stringify({
          email: "test@example.com",
          password: "test123",
        });
      }

      const response = await fetch(`${baseUrl}${endpoint.path}`, options);
      const data = await response.text();

      console.log(`📊 Status: ${response.status} ${response.statusText}`);
      console.log(
        `📋 Headers:`,
        Object.fromEntries(response.headers.entries())
      );

      try {
        const jsonData = JSON.parse(data);
        console.log(`📄 Response:`, jsonData);
      } catch (parseError) {
        console.log(`📄 Response (raw):`, data.substring(0, 200));
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
  }

  console.log("\n🔧 Debug Summary:");
  console.log("1. Check if all endpoints return proper responses");
  console.log("2. Verify database connection in Railway logs");
  console.log("3. Check environment variables in Railway dashboard");
  console.log("4. Ensure job-board routes are properly loaded");
};

debugBackend();
