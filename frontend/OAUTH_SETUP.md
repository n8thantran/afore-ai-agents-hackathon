# GitHub OAuth Setup Guide

Follow these steps to enable one-click GitHub login for your OpsPilot dashboard:

## Step 1: Create a GitHub OAuth App

1. Go to GitHub Settings: https://github.com/settings/developers
2. Click on "OAuth Apps" in the left sidebar
3. Click "New OAuth App"
4. Fill in the application details:
   - **Application name**: `OpsPilot Dashboard` (or any name you prefer)
   - **Homepage URL**: `http://localhost:3000`
   - **Application description**: `Deployment dashboard for managing repositories`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`

5. Click "Register application"

## Step 2: Get Your OAuth Credentials

After creating the app, you'll see:
- **Client ID**: Copy this value
- **Client Secret**: Click "Generate a new client secret" and copy the generated secret

⚠️ **Important**: Keep your client secret secure and never commit it to version control!

## Step 3: Update Environment Variables

1. Open the file `.env.local` in your frontend directory
2. Replace the placeholder values:

```bash
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=fF1qxo3K1SdNQrJkWxpcnqBvQ9Zo2k3kNJ0SfuDEMxI=

# GitHub OAuth App Credentials
GITHUB_CLIENT_ID=your_actual_client_id_from_step_2
GITHUB_CLIENT_SECRET=your_actual_client_secret_from_step_2
```

## Step 4: Restart Your Development Server

After updating the environment variables:

1. Stop the current dev server (Ctrl+C)
2. Start it again: `npm run dev`
3. Open http://localhost:3000

## Step 5: Test the OAuth Flow

1. You should see the login screen
2. Click "Continue with GitHub"
3. You'll be redirected to GitHub to authorize the app
4. After authorization, you'll be redirected back to the dashboard
5. You should now see your actual GitHub repositories!

## What This Enables

With proper OAuth setup, your app will:
- ✅ Allow one-click GitHub login
- ✅ Display your actual GitHub repositories
- ✅ Show real repository data (name, description, language, etc.)
- ✅ Respect repository visibility (public/private)
- ✅ Sort repositories by most recently updated

## Troubleshooting

### "Configuration Error" or OAuth not working:
- Verify your Client ID and Client Secret are correct
- Make sure the callback URL matches exactly: `http://localhost:3000/api/auth/callback/github`
- Restart the dev server after changing environment variables

### Still seeing mock data:
- Check that your `GITHUB_CLIENT_ID` is not `your_github_client_id_here`
- Verify you've restarted the server after updating `.env.local`

### "Access Denied" errors:
- The OAuth app needs `repo` scope to read private repositories
- Public repositories work with default scopes

## Production Deployment

When deploying to production:
1. Create a new GitHub OAuth App for production
2. Update the URLs to your production domain
3. Set the environment variables in your hosting platform
4. Update `NEXTAUTH_URL` to your production URL

## Security Notes

- Never commit `.env.local` to version control
- Use different OAuth apps for development and production
- Regularly rotate your client secrets
- The app requests minimal permissions (user info + repository access)
