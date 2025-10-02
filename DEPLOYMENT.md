# Deployment Guide - Shillah Flowers

This guide walks you through deploying the Shillah Flowers e-commerce platform to production.

## 🚀 Quick Start

### 1. Prerequisites
- GitHub account
- Vercel account
- Supabase account
- Stripe account

### 2. Database Setup (Supabase)

1. **Create Supabase Project**
   ```bash
   # Go to https://supabase.com and create a new project
   # Note down your project URL and anon key
   ```

2. **Run Database Migration**
   ```bash
   # Install Supabase CLI
   npm install -g supabase
   
   # Login and link project
   supabase login
   supabase link --project-ref YOUR_PROJECT_REF
   
   # Apply database schema
   supabase db push
   ```

3. **Configure Storage**
   - Go to Storage in Supabase dashboard
   - Create a bucket named `service-images`
   - Make it public for image access
   - Upload sample service images

4. **Set Up Authentication**
   - Go to Authentication > Settings
   - Configure email templates
   - Enable desired auth providers (Google, Facebook, etc.)

### 3. Payment Setup (Stripe)

1. **Create Stripe Account**
   - Sign up at https://stripe.com
   - Complete account verification
   - Get API keys from Dashboard > Developers > API keys

2. **Configure Webhooks**
   - Go to Dashboard > Developers > Webhooks
   - Add endpoint: `https://YOUR_SUPABASE_PROJECT.supabase.co/functions/v1/stripe-webhook`
   - Select events:
     - `checkout.session.completed`
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
   - Copy webhook signing secret

### 4. Deploy Edge Functions

```bash
# Deploy Stripe webhook handler
supabase functions deploy stripe-webhook

# Set environment variables for the function
supabase secrets set STRIPE_SECRET_KEY=your_stripe_secret_key
supabase secrets set STRIPE_WEBHOOK_SECRET=your_webhook_secret
```

### 5. Frontend Deployment (Vercel)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to https://vercel.com
   - Import your GitHub repository
   - Configure environment variables:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
   ```

3. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your app

## 🔧 Configuration

### Domain Setup

1. **Custom Domain (Optional)**
   - Go to Vercel project settings
   - Add your custom domain
   - Configure DNS records as instructed

2. **Update Environment Variables**
   ```env
   NEXT_PUBLIC_APP_URL=https://your-custom-domain.com
   ```

### SSL and Security

- Vercel automatically provides SSL certificates
- Supabase includes built-in security features
- Stripe handles PCI compliance

## 📊 Monitoring and Analytics

### Error Monitoring

1. **Vercel Analytics**
   - Automatically enabled for performance monitoring
   - View in Vercel dashboard

2. **Supabase Monitoring**
   - Database performance metrics
   - API usage statistics
   - Error logs in dashboard

### User Analytics

Add analytics tools:

```bash
# Install analytics (optional)
npm install @vercel/analytics
```

Update `app/layout.tsx`:
```tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

## 🔄 CI/CD Pipeline

### Automatic Deployments

Vercel automatically deploys when you push to main branch:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main
# Vercel automatically deploys
```

### Environment-Specific Deployments

1. **Staging Environment**
   - Create `staging` branch
   - Deploy to separate Vercel project
   - Use test Stripe keys

2. **Production Environment**
   - Main branch deploys to production
   - Use live Stripe keys
   - Monitor with alerts

## 🛡️ Security Checklist

### Pre-Launch Security

- [ ] Environment variables are set correctly
- [ ] Database RLS policies are enabled
- [ ] Stripe webhook endpoints are secured
- [ ] CORS is configured properly
- [ ] Rate limiting is in place (Supabase Edge Functions)

### Post-Launch Monitoring

- [ ] Set up error alerts
- [ ] Monitor payment failures
- [ ] Check database performance
- [ ] Review security logs

## 📈 Performance Optimization

### Frontend Optimization

1. **Image Optimization**
   - Images are automatically optimized by Next.js
   - Use WebP format when possible
   - Implement lazy loading

2. **Code Splitting**
   - Next.js automatically splits code
   - Dynamic imports for heavy components

3. **Caching**
   - Static assets cached by Vercel CDN
   - API responses cached appropriately

### Database Optimization

1. **Indexing**
   - Database indexes are included in migration
   - Monitor slow queries in Supabase

2. **Connection Pooling**
   - Supabase handles connection pooling
   - Monitor connection usage

## 🚨 Troubleshooting

### Common Deployment Issues

1. **Build Failures**
   ```bash
   # Check build logs in Vercel
   # Common issues: missing dependencies, TypeScript errors
   npm run build # Test locally first
   ```

2. **Environment Variable Issues**
   - Verify all variables are set in Vercel
   - Check variable names match exactly
   - Restart deployment after changes

3. **Database Connection Issues**
   - Verify Supabase URL and keys
   - Check RLS policies
   - Monitor connection limits

4. **Stripe Webhook Issues**
   - Verify webhook URL is correct
   - Check webhook signing secret
   - Monitor webhook delivery in Stripe dashboard

### Getting Help

- **Vercel**: Check deployment logs and documentation
- **Supabase**: Use dashboard logs and community support
- **Stripe**: Monitor webhook delivery and test payments

## 📋 Launch Checklist

### Pre-Launch

- [ ] All features tested in staging
- [ ] Payment flow tested with test cards
- [ ] Email notifications working
- [ ] Mobile responsiveness verified
- [ ] SEO meta tags configured
- [ ] Analytics set up
- [ ] Error monitoring configured

### Launch Day

- [ ] Switch to live Stripe keys
- [ ] Update webhook URLs
- [ ] Test live payment flow
- [ ] Monitor error rates
- [ ] Check performance metrics

### Post-Launch

- [ ] Monitor user feedback
- [ ] Track conversion rates
- [ ] Review error logs
- [ ] Plan feature updates

## 🔄 Updates and Maintenance

### Regular Updates

```bash
# Update dependencies
npm update

# Test changes
npm run build
npm run dev

# Deploy updates
git add .
git commit -m "Update dependencies"
git push origin main
```

### Database Migrations

```bash
# Create new migration
supabase migration new add_new_feature

# Apply migration
supabase db push
```

### Monitoring

- Set up alerts for critical errors
- Monitor payment success rates
- Track user engagement metrics
- Regular security updates

---

🎉 **Congratulations!** Your Shillah Flowers e-commerce platform is now live and ready to help customers create beautiful events!
