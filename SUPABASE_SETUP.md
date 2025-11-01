# Supabase Setup Instructions

## ✅ Supabase Client Installed

The Supabase client library has been installed and configured in your project.

## 📝 Next Steps

### 1. Get Your Supabase Credentials

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Create a new project
4. Wait for your project to be provisioned
5. Go to **Settings** → **API**
6. Copy your **Project URL** and **anon/public key**

### 2. Update Your Local Environment

Add your Supabase credentials to `.env.local`:

```bash
# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Update Vercel Environment Variables

1. Go to [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your **dashboard-cliste-vercel-app** project
3. Navigate to **Settings** → **Environment Variables**
4. Add these variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Select **Production**, **Preview**, and **Development** for each
6. Click **Save**
7. **Redeploy** your application

### 4. Use Supabase in Your Code

Import the Supabase client:

```typescript
import { supabase } from '@/lib/supabase';
```

Example query:

```typescript
// Fetch data
const { data, error } = await supabase
  .from('your_table')
  .select('*');

// Insert data
const { data, error } = await supabase
  .from('your_table')
  .insert([{ column: 'value' }]);
```

---

**Your Supabase client is ready to use!** 🎉

