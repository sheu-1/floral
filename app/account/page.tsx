'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { User, Mail, Phone, MapPin, Save, Package, Heart } from 'lucide-react'
import { useAuth } from '@/lib/providers/AuthProvider'
import { supabase } from '@/lib/supabase/client'
import { Order } from '@/lib/types/database'
import Link from 'next/link'

export default function AccountPage() {
  const router = useRouter()
  const { user, profile, updateProfile } = useAuth()
  
  const [loading, setLoading] = useState(false)
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    default_address: '',
  })

  useEffect(() => {
    if (!user) {
      router.push('/auth')
      return
    }

    if (profile) {
      setProfileData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
        default_address: profile.default_address || '',
      })
    }

    fetchRecentOrders()
  }, [user, profile, router])

  const fetchRecentOrders = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)

      if (error) throw error
      setRecentOrders(data || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }))
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await updateProfile(profileData)
      alert('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'paid':
        return 'text-green-600 bg-green-100'
      case 'processing':
        return 'text-blue-600 bg-blue-100'
      case 'completed':
        return 'text-purple-600 bg-purple-100'
      case 'cancelled':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-neutral-600 bg-neutral-100'
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen pt-20 bg-gradient-floral">
      <div className="container-max section-padding">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 mb-8">
            My Account
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="card p-8 mb-8"
            >
              <h2 className="font-serif text-2xl font-semibold text-neutral-900 mb-6">
                Profile Information
              </h2>

              <form onSubmit={handleSaveProfile} className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      First Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                      <input
                        type="text"
                        value={profileData.first_name}
                        onChange={(e) => handleInputChange('first_name', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="First name"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Last Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                      <input
                        type="text"
                        value={profileData.last_name}
                        onChange={(e) => handleInputChange('last_name', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Last name"
                      />
                    </div>
                  </div>
                </div>

                {/* Email (Read Only) */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                    <input
                      type="email"
                      value={user.email || ''}
                      disabled
                      className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg bg-neutral-50 text-neutral-500 cursor-not-allowed"
                    />
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">
                    Email cannot be changed. Contact support if needed.
                  </p>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Your phone number"
                    />
                  </div>
                </div>

                {/* Default Address */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Default Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-neutral-400 w-5 h-5" />
                    <textarea
                      rows={3}
                      value={profileData.default_address}
                      onChange={(e) => handleInputChange('default_address', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                      placeholder="Your default address for events"
                    />
                  </div>
                </div>

                {/* Save Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <Save className="w-5 h-5 mr-2" />
                  )}
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </motion.div>

            {/* Recent Orders */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="card p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-2xl font-semibold text-neutral-900">
                  Recent Orders
                </h2>
                <Link href="/account/orders" className="text-primary-600 hover:underline text-sm">
                  View All Orders
                </Link>
              </div>

              {recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="border border-neutral-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium text-neutral-900">
                            Order #{order.id.slice(0, 8)}
                          </p>
                          <p className="text-sm text-neutral-600">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-neutral-900">
                            ${order.total.toFixed(2)}
                          </p>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      {order.event_date && (
                        <p className="text-sm text-neutral-600">
                          Event Date: {new Date(order.event_date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                  <p className="text-neutral-600 mb-4">No orders yet</p>
                  <Link href="/services" className="btn-primary">
                    Browse Services
                  </Link>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="card p-6 sticky top-24"
            >
              <h3 className="font-serif text-lg font-semibold text-neutral-900 mb-4">
                Quick Actions
              </h3>
              
              <div className="space-y-3">
                <Link
                  href="/account/orders"
                  className="w-full btn-secondary flex items-center justify-center"
                >
                  <Package className="w-4 h-4 mr-2" />
                  View All Orders
                </Link>
                
                <Link
                  href="/wishlist"
                  className="w-full btn-secondary flex items-center justify-center"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  My Wishlist
                </Link>
                
                <Link
                  href="/services"
                  className="w-full btn-primary flex items-center justify-center"
                >
                  Browse Services
                </Link>
              </div>

              {/* Account Stats */}
              <div className="mt-8 pt-6 border-t border-neutral-200">
                <h4 className="font-medium text-neutral-900 mb-4">Account Summary</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Total Orders</span>
                    <span className="font-medium">{recentOrders.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Member Since</span>
                    <span className="font-medium">
                      {new Date(user.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
