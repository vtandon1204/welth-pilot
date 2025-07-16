# Wealth Pilot

An AI-powered finance platform that revolutionizes personal expense management through automated receipt scanning, transaction categorization, and intelligent financial insights.

## Features

### AI-Powered Automation
- **Automated Receipt Scanning**: Reduce manual expense tracking by 80% through advanced Gemini AI integration
- **Smart Transaction Categorization**: Automatically categorize expenses using machine learning

### Budget Management & Alerts
- **Real-time Budget Tracking**: Monitor spending against set budgets
- **Smart Alerts**: Receive notifications when approaching budget limits
- **Monthly Financial Reports**: Automated generation of comprehensive financial summaries
- **Recurring Transaction Automation**: Set up and manage recurring expenses effortlessly

### Security & Visualization
- **Rate Limiting**: Built-in protection against excessive API requests
- **Bot Protection**: Advanced security measures to prevent unauthorized access
- **Interactive Dashboards**: Visualize financial data through Arcjet integration
- **Secure Data Handling**: Enterprise-grade security for sensitive financial information


## Architecture
Wealth Pilot Platform
├── Next.js Frontend (React)
├── Supabase Database (PostgreSQL)
├── Prisma ORM (Data Layer)
├── Gemini AI (Receipt Processing)
├── Inngest (Background Jobs)
├── Clerk (Authentication)
└── Arcjet (Security Layer)


## Getting Started
- Clone the repository:
```bash 
git clone https://github.com/vtandon1204/welth-pilot.git
cd welth-pilot
```

- Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```
- Set up environment variables:
```env
# Database
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# AI Integration
GEMINI_API_KEY=your_gemini_api_key

# Authentication
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Security
ARCJET_KEY=your_arcjet_key

# Background Jobs
INNGEST_EVENT_KEY=your_inngest_event_key
```

- Set up the database:
```bash
npx prisma migrate dev
npx prisma generate
```
- Run the development server:
```bash 
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

- Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **Gemini AI** for intelligent receipt processing
- **Supabase** for robust database infrastructure
- **Clerk** for seamless authentication
- **Arcjet** for comprehensive security
- **Inngest** for reliable background processing
- **Prisma** for type-safe database operations