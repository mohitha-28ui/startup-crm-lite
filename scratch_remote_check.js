async function checkProduction() {
  const url = "https://startup-crm-lite-production-1493.up.railway.app";
  console.log("=== Checking Production Backend URL ===");
  try {
    const resRoot = await fetch(url, { redirect: "manual" });
    console.log("Root Route Redirect Status:", resRoot.status);
    console.log("Location Header:", resRoot.headers.get("location"));

    const resHealth = await fetch(`${url}/api/health`);
    console.log("Health Check Status:", resHealth.status);
    const dataHealth = await resHealth.json();
    console.log("Health Check Data:", dataHealth);
  } catch (err) {
    console.error("Error during production checks:", err.message);
  }
}
checkProduction();
