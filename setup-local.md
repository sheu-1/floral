# Quick Local Setup Guide

## Step 1: Install Dependencies
Open your terminal in the project directory and run:
```bash
npm install
```

## Step 2: Create Environment File
Copy `.env.local.example` to `.env.local` and add these placeholder values:

```env
# Supabase Configuration (you can use demo values for now)
NEXT_PUBLIC_SUPABASE_URL=https://demo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=demo_anon_key
SUPABASE_SERVICE_ROLE_KEY=demo_service_key

# Stripe Configuration (you can use demo values for now)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_demo
STRIPE_SECRET_KEY=sk_test_demo
STRIPE_WEBHOOK_SECRET=whsec_demo

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 3: Start Development Server
```bash
npm run dev
```

## Step 4: View Your Site
Open http://localhost:3000 in your browser

## What You'll See
- Beautiful homepage with floating petals animation
- Service categories (Wedding, Birthday, Corporate, Seasonal)
- Shopping cart functionality (will work without backend)
- Responsive design with pastel floral theme

## Note
Some features like authentication and payments won't work until you set up Supabase and Stripe, but you can see the full UI and design!
