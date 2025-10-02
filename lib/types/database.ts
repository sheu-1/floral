export interface Category {
  id: string
  name: string
  description: string | null
  image_url: string | null
  slug: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Service {
  id: string
  category_id: string
  title: string
  description: string
  short_description: string | null
  price: number
  images: string[]
  is_featured: boolean
  is_active: boolean
  customization_options: Record<string, any>
  inclusions: string[] | null
  slug: string
  created_at: string
  updated_at: string
  category?: Category
}

export interface Order {
  id: string
  user_id: string
  total: number
  status: 'draft' | 'confirmed' | 'paid' | 'processing' | 'completed' | 'cancelled'
  event_date: string | null
  event_time: string | null
  venue_address: string | null
  venue_contact: string | null
  special_instructions: string | null
  stripe_payment_intent_id: string | null
  created_at: string
  updated_at: string
  order_items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  service_id: string
  quantity: number
  unit_price: number
  subtotal: number
  customizations: Record<string, any>
  created_at: string
  service?: Service
}

export interface Review {
  id: string
  user_id: string
  service_id: string
  order_id: string | null
  rating: number
  comment: string | null
  is_verified: boolean
  is_approved: boolean
  created_at: string
  updated_at: string
  user_profile?: UserProfile
}

export interface UserProfile {
  id: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  default_address: string | null
  created_at: string
  updated_at: string
}

export interface Wishlist {
  id: string
  user_id: string
  service_id: string
  created_at: string
  service?: Service
}

export interface CartItem {
  service: Service
  quantity: number
  customizations?: Record<string, any>
}

export interface CheckoutData {
  event_date: string
  event_time: string
  venue_address: string
  venue_contact: string
  special_instructions?: string
}
