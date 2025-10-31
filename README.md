# Cliste Dashboard

A beautiful, modern dashboard with an animated sidebar built using Next.js, TypeScript, Tailwind CSS, and Framer Motion. **Secured with Clerk authentication.**

## Features

- **🔐 Clerk Authentication**: Secure sign-in/sign-up with automatic session management
- **Animated Sidebar**: Collapsible sidebar that expands on hover (desktop) or toggle (mobile)
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark Mode**: Full dark mode support
- **Modern UI**: Clean and intuitive interface using shadcn/ui components
- **Smooth Animations**: Powered by Framer Motion for fluid transitions

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Clerk account ([sign up free](https://dashboard.clerk.com))

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Set up Clerk authentication:**
   - Sign up at [https://dashboard.clerk.com](https://dashboard.clerk.com)
   - Create a new application
   - Copy your API keys from the dashboard
   - Create a `.env.local` file in the root directory:
   ```bash
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
   CLERK_SECRET_KEY=sk_test_your_secret_key_here
   ```

3. **Run the development server:**
```bash
npm run dev
```

4. **Open your browser:**
   - Navigate to [http://localhost:3000](http://localhost:3000)
   - You'll be redirected to sign in
   - Create an account and access the dashboard

📖 **Detailed setup instructions:** See [SETUP.md](./SETUP.md)

🔒 **Security information:** See [SECURITY.md](./SECURITY.md)

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
