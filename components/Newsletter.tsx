'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, CheckCircle } from 'lucide-react'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSubscribed(true)
    setEmail('')
    setIsLoading(false)

    // Reset after 3 seconds
    setTimeout(() => setIsSubscribed(false), 3000)
  }

  return (
    <section className="section-padding bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="container-max">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
              <Mail className="w-8 h-8 text-primary-600" />
            </div>
            
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
              Stay in Bloom
            </h2>
            
            <p className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter and be the first to know about seasonal collections, 
              special offers, and expert decoration tips to make your events unforgettable.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-md mx-auto"
          >
            {isSubscribed ? (
              <div className="flex items-center justify-center space-x-2 text-green-600 bg-green-50 py-4 px-6 rounded-lg">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Thank you for subscribing!</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="flex-1 input-field"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
            )}
            
            <p className="text-sm text-neutral-500 mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </motion.div>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-600 font-bold">🌸</span>
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2">Seasonal Collections</h3>
              <p className="text-sm text-neutral-600">
                Be first to see our latest seasonal arrangements and themes
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-600 font-bold">💝</span>
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2">Exclusive Offers</h3>
              <p className="text-sm text-neutral-600">
                Get special discounts and early access to promotions
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-600 font-bold">💡</span>
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2">Expert Tips</h3>
              <p className="text-sm text-neutral-600">
                Learn decoration tips and trends from our expert team
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
