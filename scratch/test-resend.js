const { Resend } = require('resend');

// Read API key from arguments or environment variable
const apiKey = process.argv[2] || process.env.RESEND_API_KEY;

if (!apiKey) {
  console.error("ERROR: Please provide your Resend API Key.");
  console.log("\nUsage:");
  console.log("  node scratch/test-resend.js re_yourApiKeyHere");
  process.exit(1);
}

const resend = new Resend(apiKey);

console.log("Initiating connection to Resend API...");
console.log("Sending diagnostic email to gautamashmit1485@gmail.com via onboarding@resend.dev...\n");

resend.emails.send({
  from: 'Acme <onboarding@resend.dev>',
  to: 'gautamashmit1485@gmail.com',
  subject: 'Resend API Diagnostics Test',
  html: `
    <div style="font-family: sans-serif; padding: 20px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #2563eb;">Resend Diagnostics Test Success</h2>
      <p>This email confirms that your Resend API key is fully working and authenticated.</p>
      <p>Timestamp: <strong>${new Date().toISOString()}</strong></p>
    </div>
  `
})
.then(response => {
  if (response.error) {
    console.error("❌ RESEND API ERROR RETURNED:");
    console.error(JSON.stringify(response.error, null, 2));
  } else {
    console.log("✅ SUCCESS! Email sent successfully.");
    console.log("Response data:", JSON.stringify(response.data, null, 2));
  }
})
.catch(error => {
  console.error("❌ RUNTIME CONNECTION FAILURE:");
  console.error(error);
});
