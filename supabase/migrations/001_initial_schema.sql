-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create categories table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image_url TEXT,
    slug VARCHAR(100) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create services table
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    short_description VARCHAR(300),
    price DECIMAL(10,2) NOT NULL,
    images TEXT[] DEFAULT '{}',
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    customization_options JSONB DEFAULT '{}',
    inclusions TEXT[],
    slug VARCHAR(200) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    total DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'confirmed', 'paid', 'processing', 'completed', 'cancelled')),
    event_date DATE,
    event_time TIME,
    venue_address TEXT,
    venue_contact VARCHAR(20),
    special_instructions TEXT,
    stripe_payment_intent_id VARCHAR(200),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    customizations JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_verified BOOLEAN DEFAULT false,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_profiles table (extends auth.users)
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    phone VARCHAR(20),
    default_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create wishlists table
CREATE TABLE wishlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, service_id)
);

-- Create indexes for better performance
CREATE INDEX idx_services_category_id ON services(category_id);
CREATE INDEX idx_services_is_featured ON services(is_featured);
CREATE INDEX idx_services_is_active ON services(is_active);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_service_id ON order_items(service_id);
CREATE INDEX idx_reviews_service_id ON reviews(service_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_is_approved ON reviews(is_approved);
CREATE INDEX idx_wishlists_user_id ON wishlists(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample categories
INSERT INTO categories (name, description, slug, image_url) VALUES
('Wedding', 'Elegant floral arrangements and decorations for your special day', 'wedding', 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800'),
('Birthday', 'Colorful and festive decorations to celebrate another year', 'birthday', 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800'),
('Corporate', 'Professional event decorations for business occasions', 'corporate', 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800'),
('Seasonal', 'Beautiful seasonal arrangements for holidays and special occasions', 'seasonal', 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800');

-- Insert sample services
INSERT INTO services (category_id, title, description, short_description, price, images, is_featured, inclusions, slug) VALUES
((SELECT id FROM categories WHERE slug = 'wedding'), 'Bridal Bouquet Deluxe', 'A stunning handcrafted bridal bouquet featuring premium roses, peonies, and eucalyptus with silk ribbon wrap.', 'Premium bridal bouquet with roses and peonies', 150.00, ARRAY['https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=800', 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800'], true, ARRAY['Premium flowers', 'Silk ribbon wrap', 'Boutonniere for groom', 'Consultation'], 'bridal-bouquet-deluxe'),

((SELECT id FROM categories WHERE slug = 'wedding'), 'Wedding Centerpieces', 'Elegant table centerpieces that complement your wedding theme with seasonal flowers and candles.', 'Beautiful wedding table centerpieces', 75.00, ARRAY['https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800'], true, ARRAY['Seasonal flowers', 'Candles', 'Glass vases', 'Setup service'], 'wedding-centerpieces'),

((SELECT id FROM categories WHERE slug = 'birthday'), 'Birthday Party Package', 'Complete birthday decoration package including balloons, banners, and floral arrangements.', 'Complete birthday party decoration package', 120.00, ARRAY['https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800'], true, ARRAY['Balloon arrangements', 'Custom banner', 'Table decorations', 'Setup and cleanup'], 'birthday-party-package'),

((SELECT id FROM categories WHERE slug = 'corporate'), 'Corporate Event Styling', 'Professional event styling for corporate functions, conferences, and business celebrations.', 'Professional corporate event decorations', 200.00, ARRAY['https://images.unsplash.com/photo-1511578314322-379afb476865?w=800'], false, ARRAY['Floral arrangements', 'Professional setup', 'Branded elements', 'Event coordination'], 'corporate-event-styling'),

((SELECT id FROM categories WHERE slug = 'seasonal'), 'Holiday Wreath', 'Beautiful seasonal wreaths perfect for doors, walls, or table centerpieces.', 'Handcrafted seasonal holiday wreaths', 45.00, ARRAY['https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800'], false, ARRAY['Seasonal materials', 'Weather-resistant', 'Custom sizing', 'Delivery included'], 'holiday-wreath');

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Categories and services are publicly readable
CREATE POLICY "Categories are publicly readable" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Services are publicly readable" ON services FOR SELECT USING (is_active = true);

-- Orders are only accessible by the user who created them
CREATE POLICY "Users can view their own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own orders" ON orders FOR UPDATE USING (auth.uid() = user_id);

-- Order items follow the same pattern as orders
CREATE POLICY "Users can view their own order items" ON order_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "Users can create their own order items" ON order_items FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

-- Reviews are publicly readable but only creatable by authenticated users
CREATE POLICY "Reviews are publicly readable" ON reviews FOR SELECT USING (is_approved = true);
CREATE POLICY "Users can create reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own reviews" ON reviews FOR UPDATE USING (auth.uid() = user_id);

-- User profiles are only accessible by the user themselves
CREATE POLICY "Users can view their own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can create their own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);

-- Wishlists are only accessible by the user who created them
CREATE POLICY "Users can view their own wishlist" ON wishlists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own wishlist" ON wishlists FOR ALL USING (auth.uid() = user_id);
