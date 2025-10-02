'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Phone, MessageSquare, CreditCard, Lock } from 'lucide-react'
import { useCart } from '@/lib/store/cart'
import { useAuth } from '@/lib/providers/AuthProvider'
import { stripePromise } from '@/lib/stripe'
import { CheckoutData } from '@/lib/types/database'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCart()
  const { user } = useAuth()
  
  const [loading, setLoading] = useState(false)
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    event_date: '',
    event_time: '',
    venue_address: '',
    venue_contact: '',
    special_instructions: '',
  })

  useEffect(() => {
    if (!user) {
      router.push('/auth?redirect=/checkout')
      return
    }

    if (items.length === 0) {
      router.push('/cart')
      return
    }
  }, [user, items, router])

  const handleInputChange = (field: keyof CheckoutData, value: string) => {
    setCheckoutData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user || items.length === 0) return

    setLoading(true)

    try {
      // Create checkout session
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          checkoutData,
          userId: user.id,
        }),
      })

      const { sessionId, error } = await response.json()

      if (error) {
        throw new Error(error)
      }

      // Redirect to Stripe Checkout
      const stripe = await stripePromise
      if (stripe) {
        const { error: stripeError } = await stripe.redirectToCheckout({
          sessionId,
        })

        if (stripeError) {
          throw new Error(stripeError.message)
        }
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = checkoutData.event_date && 
                     checkoutData.event_time && 
                     checkoutData.venue_address && 
                     checkoutData.venue_contact

  if (!user || items.length === 0) {
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
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 mb-8 text-center">
            Checkout
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Event Details Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="card p-8">
              <h2 className="font-serif text-2xl font-semibold text-neutral-900 mb-6">
                Event Details
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Event Date */}
                <div>
                  <label className="flex items-center text-sm font-medium text-neutral-700 mb-2">
                    <Calendar className="w-4 h-4 mr-2" />
                    Event Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={checkoutData.event_date}
                    onChange={(e) => handleInputChange('event_date', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="input-field"
                  />
                </div>

                {/* Event Time */}
                <div>
                  <label className="flex items-center text-sm font-medium text-neutral-700 mb-2">
                    <Calendar className="w-4 h-4 mr-2" />
                    Event Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={checkoutData.event_time}
                    onChange={(e) => handleInputChange('event_time', e.target.value)}
                    className="input-field"
                  />
                </div>

                {/* Venue Address */}
                <div>
                  <label className="flex items-center text-sm font-medium text-neutral-700 mb-2">
                    <MapPin className="w-4 h-4 mr-2" />
                    Venue Address *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Enter the complete venue address including city, state, and ZIP code"
                    value={checkoutData.venue_address}
                    onChange={(e) => handleInputChange('venue_address', e.target.value)}
                    className="input-field resize-none"
                  />
                </div>

                {/* Contact Number */}
                <div>
                  <label className="flex items-center text-sm font-medium text-neutral-700 mb-2">
                    <Phone className="w-4 h-4 mr-2" />
                    Contact Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Your phone number for event coordination"
                    value={checkoutData.venue_contact}
                    onChange={(e) => handleInputChange('venue_contact', e.target.value)}
                    className="input-field"
                  />
                </div>

                {/* Special Instructions */}
                <div>
                  <label className="flex items-center text-sm font-medium text-neutral-700 mb-2">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Special Instructions
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Any special requests, color preferences, or additional details about your event..."
                    value={checkoutData.special_instructions}
                    onChange={(e) => handleInputChange('special_instructions', e.target.value)}
                    className="input-field resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!isFormValid || loading}
                  className="w-full btn-primary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <CreditCard className="w-5 h-5 mr-2" />
                  )}
                  {loading ? 'Processing...' : 'Proceed to Payment'}
                </button>

                <div className="flex items-center justify-center text-sm text-neutral-600">
                  <Lock className="w-4 h-4 mr-2" />
                  Secure checkout powered by Stripe
                </div>
              </form>
            </div>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="card p-8 sticky top-24">
              <h2 className="font-serif text-2xl font-semibold text-neutral-900 mb-6">
                Order Summary
              </h2>

              {/* Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.service.id} className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-neutral-900">{item.service.title}</h3>
                      <p className="text-sm text-neutral-600">
                        ${item.service.price.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                    <div className="font-medium text-neutral-900">
                      ${(item.service.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 pt-6 border-t border-neutral-200">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Subtotal</span>
                  <span className="font-medium">${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Setup Service</span>
                  <span className="font-medium text-green-600">Included</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Consultation</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-3 border-t border-neutral-200">
                  <span>Total</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="mt-8 pt-6 border-t border-neutral-200">
                <h3 className="font-medium text-neutral-900 mb-4">What's Included:</h3>
                <div className="space-y-2 text-sm text-neutral-600">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span>Professional consultation</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span>Complete setup service</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span>Quality guarantee</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span>Event day support</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
