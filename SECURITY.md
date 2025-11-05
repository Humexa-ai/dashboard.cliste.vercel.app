## Security Documentation

## Authentication Setup with Supabase

This dashboard uses **Supabase** for authentication and security.

### Overview

Supabase provides:
- Secure user authentication
- JWT token management
- Session handling
- User metadata storage
- Email verification

### Environment Variables

⚠️ **IMPORTANT**: Create a `.env.local` file with your Supabase keys:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

#### 2. **Get Your Supabase Keys**

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create an account
3. Create a new project
4. Go to **Project Settings** → **API**
5. Copy your **Project URL** and **anon/public key**

### Security Features

- ✅ Protected routes via middleware
- ✅ Automatic session validation
- ✅ Secure cookie handling
- ✅ JWT token validation
- ✅ Server-side session checks
- ✅ Client-side session management

### How It Works

1. **Middleware Protection**: All `/dashboard` routes are protected
2. **Session Check**: Server-side validation using Supabase `getSession()`
3. **Automatic Redirect**: Unauthenticated users redirected to `/sign-in`
4. **Token Validation**: Supabase validates JWT tokens automatically
5. **Secure Cookie Handling**: Sessions stored in secure HTTP-only cookies

### Security Best Practices

1. **Rate Limiting**: Configure rate limits in Supabase dashboard
2. **Email Verification**: Enable email verification in Supabase settings
3. **Password Requirements**: Configure strong password requirements
4. **Session Timeout**: Set appropriate session expiration times
5. **Audit Logs**: Monitor authentication events in Supabase dashboard

### Additional Resources

- Supabase Documentation: [https://supabase.com/docs](https://supabase.com/docs)
- Supabase Support: [https://supabase.com/support](https://supabase.com/support)
