# Shillah Flowers - E-commerce Platform

A modern, responsive e-commerce website for flowers & event decoration services built with Next.js, Supabase, and Stripe.

## 🌸 Features

### Frontend
- **Modern Design**: Elegant floral theme with pastel colors and smooth animations
- **Responsive**: Fully responsive design for desktop, tablet, and mobile
- **Interactive**: Smooth hover effects, floating petals animation, and intuitive UI
- **Performance**: Optimized with Next.js 14 and Tailwind CSS

### Backend & Database
- **Supabase Integration**: PostgreSQL database with real-time capabilities
- **Authentication**: Email/password and social login support
- **File Storage**: Image storage for service photos
- **Row Level Security**: Secure data access patterns

### E-commerce Features
- **Service Catalog**: Browse services by category with filtering and search
- **Shopping Cart**: Add/remove items with persistent cart state
- **Checkout Flow**: Complete checkout with event details and venue information
- **Payment Processing**: Secure payments via Stripe
- **Order Management**: Track order status and history

### User Experience
- **User Accounts**: Profile management and order history
- **Wishlist**: Save favorite services for later
- **Reviews**: Customer reviews and ratings system
- **Responsive Design**: Optimized for all device sizes

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **Payments**: Paystack
- **State Management**: Zustand
- **Icons**: Lucide React
- **Deployment**: Vercel (Frontend), Supabase (Backend)

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- Paystack account

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd shillah_website
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Run the database migration:
   ```bash
   # Install Supabase CLI if you haven't already
   npm install -g supabase
   
   # Login to Supabase
   supabase login
   
   # Link your project
   supabase link --project-ref YOUR_PROJECT_REF
   
   # Run migrations
   supabase db push
   ```

### 4. Set Up Paystack

1. Create a Paystack account at [paystack.com](https://paystack.com)
2. Get your publishable and secret keys from the Paystack dashboard
3. Configure your webhook URL for payment verification

### 5. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Paystack Configuration
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
PAYSTACK_SECRET_KEY=your_paystack_secret_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 6. Run the Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 🗄️ Database Schema

The application uses the following main tables:

- **categories**: Service categories (Wedding, Birthday, Corporate, Seasonal)
- **services**: Individual services with pricing and details
- **orders**: Customer orders with event information
- **order_items**: Items within each order
- **reviews**: Customer reviews and ratings
- **user_profiles**: Extended user information
- **wishlists**: User wishlist items

## 🔗 Stripe Integration

### Webhook Setup

1. In your Stripe dashboard, go to Developers > Webhooks
2. Add a new webhook endpoint: `https://your-supabase-project.supabase.co/functions/v1/stripe-webhook`
3. Select these events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
4. Copy the webhook signing secret to your environment variables

### Payment Flow

1. User adds items to cart and proceeds to checkout
2. Event details are collected (date, time, venue, etc.)
3. Order is created in Supabase with 'draft' status
4. Stripe Checkout session is created
5. User completes payment on Stripe
6. Webhook updates order status to 'paid' then 'confirmed'

## 🚀 Deployment

### Frontend (Vercel)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push to main branch

### Backend (Supabase)

1. Database and Auth are automatically hosted on Supabase
2. Deploy Edge Functions:
   ```bash
   supabase functions deploy stripe-webhook
   ```

### Environment Variables for Production

Update your production environment variables:
- `NEXT_PUBLIC_APP_URL`: Your production domain
- Stripe keys: Use live keys for production
- Supabase: Already configured for production

## 🎨 Customization

### Colors and Theming

The design uses a pastel floral theme defined in `tailwind.config.js`:
- **Primary**: Pink tones for main actions
- **Secondary**: Lavender for accents
- **Accent**: Mint green for highlights
- **Neutral**: Warm grays for text and backgrounds

### Adding New Services

1. Add images to Supabase Storage
2. Insert service data via Supabase dashboard or API
3. Services automatically appear on the website

### Custom Categories

Add new categories in the database and they'll automatically appear in navigation and filtering.

## 📱 Features Overview

### Homepage
- Hero banner with rotating background images
- Featured categories showcase
- Best-selling services
- Customer testimonials
- Newsletter signup

### Services
- Category-based browsing
- Search and filtering
- Detailed service pages with image galleries
- Add to cart and wishlist functionality

### Shopping Experience
- Persistent shopping cart
- Detailed checkout with event planning
- Secure Stripe payment processing
- Order confirmation and tracking

### User Account
- Profile management
- Order history and status tracking
- Wishlist management
- Account settings

## 🔧 Development

### Project Structure
```
shillah_website/
├── app/                    # Next.js app directory
│   ├── (routes)/          # Page routes
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # React components
├── lib/                   # Utilities and configurations
│   ├── supabase/         # Supabase client setup
│   ├── stripe.ts         # Stripe configuration
│   └── types/            # TypeScript type definitions
├── supabase/             # Supabase configuration
│   ├── migrations/       # Database migrations
│   └── functions/        # Edge functions
└── public/               # Static assets
```

### Key Components
- `Navbar`: Navigation with cart and user menu
- `ServiceCard`: Reusable service display component
- `CartSidebar`: Sliding cart panel
- `HeroBanner`: Animated homepage hero section

### State Management
- **Cart**: Zustand store with localStorage persistence
- **Auth**: React Context with Supabase Auth
- **UI State**: Local component state with React hooks

## 🐛 Troubleshooting

### Common Issues

1. **TypeScript Errors**: Run `npm install` to ensure all dependencies are installed
2. **Supabase Connection**: Check your environment variables and project URL
3. **Stripe Webhooks**: Ensure webhook URL is correct and events are selected
4. **Image Loading**: Verify Supabase Storage bucket is public for service images

### Development Tips

- Use Supabase local development for testing: `supabase start`
- Test webhooks locally with Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
- Check browser console for client-side errors
- Monitor Supabase logs for database issues

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📞 Support

For support and questions:
- Email: shillahjuma1@gmail.com
- Phone: +254 112 013474
- Location: Nairobi, Kenya
- Documentation: Check this README and inline code comments
- Issues: Create a GitHub issue for bugs or feature requests

---

Built with ❤️ using Next.js, Supabase, and Stripe
