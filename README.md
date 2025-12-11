# Vault | Enterprise Banking Dashboard

**Vault** is a high-performance internal administration tool designed for modern fintech platforms. It provides a comprehensive "God View" of financial operations, allowing compliance teams and administrators to monitor transactions, review KYC applications, and manage system liquidity in real-time.

Built with **Next.js 16**, **Server Actions**, and **PostgreSQL**.

---

## 🚀 Key Features

### 1\. 📊 The Command Center (Dashboard)

- **Real-time Metrics:** Tracks total transaction volume, active users, and system health.
- **Data Visualization:** Interactive charts showing transaction trends over time.

### 2\. 💸 Transaction Engine

- **High-Volume Grid:** Capable of handling millions of rows with server-side pagination.
- **Smart Search:** Debounced server-side filtering by reference, email, or customer name.
- **Deep Linking:** Shareable URLs for specific transaction views.

### 3\. 🛡️ KYC Compliance Queue

- **Split-Screen Workflow:** "Outlook-style" master-detail view for rapid application review.
- **Mobile Optimized:** Adapts to a full-screen workflow on mobile devices.
- **Instant Mutations:** Approve or Reject applications with optimistic UI updates.

### 4\. 👤 Customer 360° View

- **Unified Profile:** Aggregates user identity, multiple wallet balances (NGN/USD), and transaction history in one view.
- **Risk Control:** "Danger Zone" allowing admins to **Freeze/Unfreeze** accounts instantly.
- **Responsive Cards:** Adaptive layout for viewing complex user data on any device.

### 5\. 🏦 Treasury & Liquidity

- **System Liability:** Monitors total NGN and USD liquidity across all user wallets.
- **Whale Monitoring:** Automatically tracks high-value accounts to manage concentration risk.

### 6\. 🔒 Audit & Governance

- **Immutable Logs:** Automatically records every admin action (Freeze, KYC Decision, Invite) with timestamps and admin IDs.
- **Role Management:** Invite new team members with specific roles (Admin/Super Admin).

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Database:** [PostgreSQL](https://www.postgresql.org/) (via [Neon](https://neon.tech/))
- **ORM:** [Prisma](https://www.prisma.io/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **State/Mutations:** React Server Actions & `useActionState`
- **UI Components:** Lucide Icons, Radix UI primitives.

---

## ⚡ Getting Started

### 1\. Clone the repository

```bash
git clone https://github.com/EL-ILUMINADO/vault-app.git
cd vault-app
```

### 2\. Install dependencies

```bash
npm install
```

### 3\. Environment Setup

Create a `.env` file in the root directory and add your database connection string:

```env
# Connect to your local Postgres or Neon Cloud DB
DATABASE_URL="postgresql://user:password@host:port/neondb?sslmode=require"
```

### 4\. Database Initialization

Push the schema to your database and seed initial data:

```bash
npx prisma db push
npx prisma generate
npm run seed  # (If you have a seed script)
```

### 5\. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) to see the app.

---

## 📂 Project Structure

```bash
├── app/
│   ├── actions/       # Server Actions (Mutations)
│   ├── api/           # Route Handlers (if any)
│   ├── audit/         # Audit Log Module
│   ├── customers/     # Customer Directory & Profile
│   ├── kyc/           # KYC Review Queue
│   ├── transactions/  # Transaction Grid
│   ├── wallets/       # Treasury Module
│   ├── settings/      # Admin Management
│   └── layout.tsx     # Root Layout (Sidebar + Mobile Nav)
├── components/
│   ├── ui/            # Reusable UI (Buttons, Inputs, Spinners)
│   ├── layout/        # Sidebar, MobileDrawer
│   └── [module]/      # Feature-specific components (tables, cards)
├── lib/
│   ├── prisma-db.ts   # Database Client Singleton
│   ├── logger.ts      # Custom Audit Logger
│   └── utils.ts       # Helper functions
└── prisma/
    └── schema.prisma  # Database Schema Definition
```

---

## 🛡️ Security Highlights

- **Server-Side Logic:** All sensitive logic (Freezing accounts, Approving KYC) runs strictly on the server via Server Actions.
- **Audit Trails:** Critical actions are wrapped in a `logAction` middleware that persists records to the database.
- **Type Safety:** End-to-end type safety from the Database (Prisma) to the Frontend (React).

---

## 📄 License

This project is open-source and available under the [MIT License](https://www.google.com/search?q=LICENSE).
