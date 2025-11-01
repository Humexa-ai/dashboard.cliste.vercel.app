# Step-by-Step: Disable Account Portal in Clerk Dashboard

## Follow These Exact Steps:

### Step 1: Click "Account Portal" in Left Sidebar
- Look at the **left sidebar** in your Clerk dashboard
- Scroll to the section labeled **"Customization"**
- Click on **"Account Portal"** (it's the first item under Customization)

### Step 2: Find the Toggle on the Account Portal Page
Once you're on the Account Portal page:
- Look for a toggle switch that says **"Account Portal"** or **"Enable Account Portal"**
- **Turn it OFF** (it should be gray/dark when off, not colored)

### Step 3: Save Your Changes
- Click the **"Save"** or **"Update"** button at the bottom of the page

### Alternative: If You Don't See an Account Portal Toggle
If there's no toggle to disable, the issue might be in the "Paths" configuration you're already looking at.

**On the Current "Paths" Page:**

For the **`<SignIn />` Component paths** section:
- Make sure **"Sign-in page on development host"** is selected ✅
- In the input field below it, enter: **`/sign-in`**
- Make sure "Sign-in page on Account Portal" is NOT selected

For the **`<SignUp />` Component paths** section:
- Make sure **"Sign-up page on development host"** is selected ✅
- In the input field below it, enter: **`/sign-up`**
- Make sure "Sign-up page on Account Portal" is NOT selected

Then click **"Save"** at the bottom of the page.

---

**After making these changes:**
1. Wait 1-2 minutes for Clerk to update
2. Clear your browser cache
3. Visit: https://dashboard-cliste-vercel-app.vercel.app
4. You should now see your custom sign-in page!



