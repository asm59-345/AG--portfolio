# Ashmit Gautam — AI/ML & Full-Stack Portfolio

A premium, highly interactive developer portfolio featuring a modern dark cybernetic theme, dynamic Canvas neural background, command center search portal, and a custom voice/text AI assistant.

![AG Portfolio Showcase](public/portfolio_mockup.png)

---

## 🛠️ Technology Stack

- **Framework**: Next.js 15+ (React 19, App Router)
- **Styling**: Tailwind CSS v4 & custom glassmorphism glows
- **Animations**: Framer Motion
- **Services**: Supabase (database), Resend (email automation), Gemini (AI assistant)
- **Deployment**: Standalone Docker configuration & Vercel-ready

---

## 🚀 Getting Started

### 1. Environment Setup
Create a `.env` file in the root directory and configure the following:
```env
# Database & Authentication
DATABASE_URL="your_supabase_postgresql_pooler_url"
DIRECT_URL="your_supabase_postgresql_direct_url"
NEXTAUTH_SECRET="your_nextauth_secret_key"
NEXTAUTH_URL="http://localhost:3000"

# API Integrations
RESEND_API_KEY="your_resend_api_key"
GEMINI_API_KEY="your_gemini_api_key"

# Admin Access
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="your_admin_password"
```

### 2. Installation & Development
```bash
# Install dependencies
npm install --legacy-peer-deps

# Run local development server
npm run dev
```

### 3. Production Build
```bash
# Compile and build the production bundle
npm run build

# Start the Next.js production server
npm run start
```

### 4. Docker Deployment
```bash
# Build the production image
docker build -t portfolio-2026 .

# Run the container (injecting your environment variables)
docker run -p 3000:3000 --env-file .env portfolio-2026
```

---

## ✉️ Troubleshooting the Resend API

If contact form submissions or emails are failing:
1. **Sandbox Restriction**: On Resend's free tier, you can only send emails **to your own verified email** (`gautamashmit1485@gmail.com`). Sending auto-replies to other addresses will fail unless you verify their domains or upgrade.
2. **Diagnostic Test**: Use the included diagnostic script to test your API key directly:
   ```bash
   node scratch/test-resend.js <your_resend_api_key>
   ```
3. **Environment Injection**: Ensure `RESEND_API_KEY` is set in your Vercel project settings or passed during the Docker run command.
