const BACKEND_URL = "https://startup-crm-lite-production-1493.up.railway.app";

async function testBackend() {
  console.log("=== Starting Backend API Tests ===");
  const uniqueId = Math.random().toString(36).substring(7);
  const testUser = {
    name: `QA Tester ${uniqueId}`,
    email: `qa_test_${uniqueId}@example.com`,
    password: "Password123!"
  };

  let token = "";
  let leadId = "";

  // 1. SIGNUP TEST
  console.log("\n--- Testing Signup (POST /api/auth/register) ---");
  try {
    const signupRes = await fetch(`${BACKEND_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testUser)
    });
    const signupData = await signupRes.json();
    console.log(`Signup Status: ${signupRes.status}`);
    console.log("Signup Response:", signupData);

    if (signupRes.status !== 201 && signupRes.status !== 200) {
      throw new Error(`Signup failed with status ${signupRes.status}`);
    }
  } catch (err) {
    console.error("Signup Error:", err.message);
    process.exit(1);
  }

  // 2. LOGIN TEST
  console.log("\n--- Testing Login (POST /api/auth/login) ---");
  try {
    const loginRes = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: testUser.email, password: testUser.password })
    });
    const loginData = await loginRes.json();
    console.log(`Login Status: ${loginRes.status}`);
    console.log("Login Response (truncated token):", {
      ...loginData,
      token: loginData.token ? `${loginData.token.substring(0, 15)}...` : undefined
    });

    if (loginRes.status !== 200 || !(loginData.token || (loginData.data && loginData.data.token))) {
      throw new Error(`Login failed with status ${loginRes.status}`);
    }
    token = loginData.token || loginData.data.token;
  } catch (err) {
    console.error("Login Error:", err.message);
    process.exit(1);
  }

  // 3. JWT VALIDATION TEST (GET /api/auth/profile)
  console.log("\n--- Testing JWT Validation (GET /api/auth/profile) ---");
  try {
    const profileRes = await fetch(`${BACKEND_URL}/api/auth/profile`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    const profileData = await profileRes.json();
    console.log(`Profile Status: ${profileRes.status}`);
    console.log("Profile Response:", profileData);

    if (profileRes.status !== 200) {
      throw new Error(`Profile check failed with status ${profileRes.status}`);
    }
  } catch (err) {
    console.error("Profile check Error:", err.message);
    process.exit(1);
  }

  // 4. CREATE LEAD (POST /api/leads)
  console.log("\n--- Testing Create Lead (POST /api/leads) ---");
  const testLead = {
    name: "John Doe",
    company: "Test Corp",
    email: "john@testcorp.com",
    status: "New",
    source: "Website",
    value: 5000,
    notes: "Initial contact via QA automated test script."
  };
  try {
    const createRes = await fetch(`${BACKEND_URL}/api/leads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(testLead)
    });
    const createData = await createRes.json();
    console.log(`Create Lead Status: ${createRes.status}`);
    console.log("Create Lead Response:", createData);

    if (createRes.status !== 201 && createRes.status !== 200) {
      throw new Error(`Create Lead failed with status ${createRes.status}`);
    }
    leadId = createData.data ? createData.data._id : createData._id;
    if (!leadId) {
      throw new Error("Lead ID not returned in response");
    }
  } catch (err) {
    console.error("Create Lead Error:", err.message);
    process.exit(1);
  }

  // 5. GET ALL LEADS (GET /api/leads)
  console.log("\n--- Testing Get All Leads (GET /api/leads) ---");
  try {
    const getLeadsRes = await fetch(`${BACKEND_URL}/api/leads`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    const getLeadsData = await getLeadsRes.json();
    console.log(`Get All Leads Status: ${getLeadsRes.status}`);
    console.log("Get All Leads Response (Summary):", {
      success: getLeadsData.success,
      count: getLeadsData.data ? getLeadsData.data.length : (getLeadsData.length || 0)
    });

    if (getLeadsRes.status !== 200) {
      throw new Error(`Get Leads failed with status ${getLeadsRes.status}`);
    }
  } catch (err) {
    console.error("Get Leads Error:", err.message);
    process.exit(1);
  }

  // 6. GET LEAD BY ID (GET /api/leads/:id)
  console.log(`\n--- Testing Get Lead By ID (GET /api/leads/${leadId}) ---`);
  try {
    const getLeadRes = await fetch(`${BACKEND_URL}/api/leads/${leadId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    const getLeadData = await getLeadRes.json();
    console.log(`Get Lead By ID Status: ${getLeadRes.status}`);
    console.log("Get Lead By ID Response:", getLeadData);

    if (getLeadRes.status !== 200) {
      throw new Error(`Get Lead By ID failed with status ${getLeadRes.status}`);
    }
  } catch (err) {
    console.error("Get Lead By ID Error:", err.message);
    process.exit(1);
  }

  // 7. UPDATE LEAD (PUT /api/leads/:id)
  console.log(`\n--- Testing Update Lead (PUT /api/leads/${leadId}) ---`);
  const updatedLead = {
    name: "John Doe Updated",
    company: "Test Corp Premium",
    email: "john.updated@testcorp.com",
    value: 7500
  };
  try {
    const updateRes = await fetch(`${BACKEND_URL}/api/leads/${leadId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(updatedLead)
    });
    const updateData = await updateRes.json();
    console.log(`Update Lead Status: ${updateRes.status}`);
    console.log("Update Lead Response:", updateData);

    if (updateRes.status !== 200) {
      throw new Error(`Update Lead failed with status ${updateRes.status}`);
    }
  } catch (err) {
    console.error("Update Lead Error:", err.message);
    process.exit(1);
  }

  // 8. UPDATE LEAD STATUS (PATCH /api/leads/:id/status)
  console.log(`\n--- Testing Patch Lead Status (PATCH /api/leads/${leadId}/status) ---`);
  try {
    const statusRes = await fetch(`${BACKEND_URL}/api/leads/${leadId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ status: "Contacted" })
    });
    const statusData = await statusRes.json();
    console.log(`Patch Lead Status Status: ${statusRes.status}`);
    console.log("Patch Lead Status Response:", statusData);

    if (statusRes.status !== 200) {
      throw new Error(`Patch Lead Status failed with status ${statusRes.status}`);
    }
  } catch (err) {
    console.error("Patch Lead Status Error:", err.message);
    process.exit(1);
  }

  // 9. DELETE LEAD (DELETE /api/leads/:id)
  console.log(`\n--- Testing Delete Lead (DELETE /api/leads/${leadId}) ---`);
  try {
    const deleteRes = await fetch(`${BACKEND_URL}/api/leads/${leadId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    const deleteData = await deleteRes.json();
    console.log(`Delete Lead Status: ${deleteRes.status}`);
    console.log("Delete Lead Response:", deleteData);

    if (deleteRes.status !== 200) {
      throw new Error(`Delete Lead failed with status ${deleteRes.status}`);
    }
  } catch (err) {
    console.error("Delete Lead Error:", err.message);
    process.exit(1);
  }

  // 10. VERIFY DELETED LEAD (GET /api/leads/:id should error/fail)
  console.log(`\n--- Verifying Deletion of Lead (GET /api/leads/${leadId}) ---`);
  try {
    const getDeletedRes = await fetch(`${BACKEND_URL}/api/leads/${leadId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    console.log(`Verify Delete Status (expected 404): ${getDeletedRes.status}`);
    if (getDeletedRes.status === 404) {
      console.log("Verified: Lead is deleted successfully.");
    } else {
      console.warn(`Warning: Lead fetch after delete returned ${getDeletedRes.status} instead of 404`);
    }
  } catch (err) {
    console.error("Verify Delete Error:", err.message);
  }

  console.log("\n=== All Backend API Tests Completed Successfully! ===");
}

testBackend();
