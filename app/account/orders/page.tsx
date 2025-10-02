'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Package, Calendar, MapPin, Eye, Download } from 'lucide-react'
import { useAuth } from '@/lib/providers/AuthProvider'
import { supabase } from '@/lib/supabase/client'
import { Order, OrderItem } from '@/lib/types/database'
import Link from 'next/link'

export default function OrdersPage() {
  const router = useRouter()
  const { user } = useAuth()
  
  const [orders, setOrders] = useState<(Order & { order_items: (OrderItem & { service: any })[] })[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      router.push('/auth')
      return
    }

    fetchOrders()
  }, [user, router])

  const fetchOrders = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            service:services (
              id,
              title,
              price,
              images
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
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

  const getStatusDescription = (status: string) => {
    switch (status) {
      case 'draft':
        return 'Order created but payment pending'
      case 'confirmed':
        return 'Order confirmed, preparing for your event'
      case 'paid':
        return 'Payment received, order in progress'
      case 'processing':
        return 'Preparing decorations for your event'
      case 'completed':
        return 'Event completed successfully'
      case 'cancelled':
        return 'Order has been cancelled'
      default:
        return 'Order status unknown'
    }
  }

  if (!user) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-20">
        <div className="container-max section-padding">
          <div className="animate-pulse">
            <div className="h-8 bg-neutral-200 rounded w-64 mb-8" />
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="card p-6">
                  <div className="h-6 bg-neutral-200 rounded w-1/3 mb-4" />
                  <div className="h-4 bg-neutral-200 rounded w-1/2 mb-2" />
                  <div className="h-4 bg-neutral-200 rounded w-1/4" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 bg-gradient-floral">
      <div className="container-max section-padding">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900">
              My Orders
            </h1>
            <Link href="/account" className="text-primary-600 hover:underline">
              Back to Account
            </Link>
          </div>
        </motion.div>

        {orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                  <div>
                    <h2 className="font-serif text-xl font-semibold text-neutral-900 mb-2">
                      Order #{order.id.slice(0, 8)}
                    </h2>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-600">
                      <span>Placed on {new Date(order.created_at).toLocaleDateString()}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-neutral-900">
                        ${order.total.toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                      className="btn-secondary flex items-center"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      {selectedOrder === order.id ? 'Hide' : 'View'} Details
                    </button>
                  </div>
                </div>

                {/* Event Details */}
                {(order.event_date || order.venue_address) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-neutral-50 rounded-lg">
                    {order.event_date && (
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 text-primary-600 mr-3" />
                        <div>
                          <p className="font-medium text-neutral-900">Event Date</p>
                          <p className="text-sm text-neutral-600">
                            {new Date(order.event_date).toLocaleDateString()}
                            {order.event_time && ` at ${order.event_time}`}
                          </p>
                        </div>
                      </div>
                    )}
                    {order.venue_address && (
                      <div className="flex items-start">
                        <MapPin className="w-5 h-5 text-primary-600 mr-3 mt-1" />
                        <div>
                          <p className="font-medium text-neutral-900">Venue</p>
                          <p className="text-sm text-neutral-600">{order.venue_address}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Status Description */}
                <div className="mb-6">
                  <p className="text-sm text-neutral-600">
                    {getStatusDescription(order.status)}
                  </p>
                </div>

                {/* Order Items (Expandable) */}
                {selectedOrder === order.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-neutral-200 pt-6"
                  >
                    <h3 className="font-medium text-neutral-900 mb-4">Order Items</h3>
                    <div className="space-y-4">
                      {order.order_items?.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4 p-4 bg-neutral-50 rounded-lg">
                          <div className="w-16 h-16 bg-neutral-200 rounded-lg overflow-hidden">
                            {item.service?.images?.[0] && (
                              <img
                                src={item.service.images[0]}
                                alt={item.service.title}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-neutral-900">
                              {item.service?.title}
                            </h4>
                            <p className="text-sm text-neutral-600">
                              Quantity: {item.quantity} × ${item.unit_price.toFixed(2)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-neutral-900">
                              ${item.subtotal.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Special Instructions */}
                    {order.special_instructions && (
                      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-neutral-900 mb-2">Special Instructions</h4>
                        <p className="text-sm text-neutral-700">{order.special_instructions}</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16"
          >
            <Package className="w-16 h-16 text-neutral-300 mx-auto mb-6" />
            <h2 className="font-serif text-2xl font-semibold text-neutral-900 mb-4">
              No Orders Yet
            </h2>
            <p className="text-lg text-neutral-600 mb-8 max-w-md mx-auto">
              You haven't placed any orders yet. Browse our beautiful services 
              and start planning your perfect event.
            </p>
            <Link href="/services" className="btn-primary">
              Browse Services
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  )
}
