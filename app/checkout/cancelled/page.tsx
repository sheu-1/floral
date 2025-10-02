'use client'

import { motion } from 'framer-motion'
import { XCircle, ArrowLeft, ShoppingCart } from 'lucide-react'
import Link from 'next/link'

export default function CheckoutCancelledPage() {
  return (
    <div className="min-h-screen pt-20 bg-gradient-floral">
      <div className="container-max section-padding">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-12 h-12 text-orange-600" />
            </div>
            
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
              Payment Cancelled
            </h1>
            
            <p className="text-lg text-neutral-600 mb-8">
              Your payment was cancelled and no charges were made to your account. 
              Your items are still in your cart if you'd like to try again.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="card p-8 mb-8"
          >
            <h2 className="font-serif text-xl font-semibold text-neutral-900 mb-4">
              What would you like to do?
            </h2>
            
            <div className="space-y-4">
              <p className="text-neutral-600">
                Don't worry! Your cart items are saved and you can complete your order whenever you're ready.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/cart" className="btn-primary flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Return to Cart
                </Link>
                <Link href="/services" className="btn-secondary flex items-center justify-center">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Continue Shopping
                </Link>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center"
          >
            <p className="text-sm text-neutral-600 mb-4">
              Need help with your order or have questions about our services?
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
              <a 
                href="mailto:hello@shillahflowers.com" 
                className="text-primary-600 hover:underline"
              >
                Email: hello@shillahflowers.com
              </a>
              <a 
                href="tel:+15551234567" 
                className="text-primary-600 hover:underline"
              >
                Phone: (555) 123-4567
              </a>
            </div>
            
            <Link 
              href="/contact" 
              className="inline-block mt-4 text-primary-600 hover:underline"
            >
              Contact our support team
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
