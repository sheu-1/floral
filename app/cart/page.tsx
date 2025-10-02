'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCart } from '@/lib/store/cart'

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-20">
        <div className="container-max section-padding">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16"
          >
            <ShoppingBag className="w-16 h-16 text-neutral-300 mx-auto mb-6" />
            <h1 className="font-serif text-3xl font-bold text-neutral-900 mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-lg text-neutral-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any services to your cart yet. 
              Discover our beautiful arrangements and decorations.
            </p>
            <Link href="/services" className="btn-primary">
              Browse Services
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="container-max section-padding">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 mb-8">
            Shopping Cart
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              {items.map((item, index) => (
                <motion.div
                  key={item.service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="card p-6"
                >
                  <div className="flex flex-col sm:flex-row gap-6">
                    {/* Image */}
                    <div className="relative w-full sm:w-32 h-32 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
                      {item.service.images?.[0] && (
                        <Image
                          src={item.service.images[0]}
                          alt={item.service.title}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                        <div className="mb-4 sm:mb-0">
                          <h3 className="font-serif text-lg font-semibold text-neutral-900 mb-1">
                            {item.service.title}
                          </h3>
                          <p className="text-sm text-neutral-600 mb-2">
                            {item.service.category?.name}
                          </p>
                          <p className="text-lg font-bold text-neutral-900">
                            ${item.service.price.toFixed(2)} each
                          </p>
                        </div>

                        <button
                          onClick={() => removeItem(item.service.id)}
                          className="text-red-600 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-lg self-start"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Quantity and Total */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-medium text-neutral-700">Quantity:</span>
                          <div className="flex items-center border border-neutral-300 rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.service.id, item.quantity - 1)}
                              className="p-2 hover:bg-neutral-100 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-4 py-2 border-x border-neutral-300 min-w-[3rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.service.id, item.quantity + 1)}
                              className="p-2 hover:bg-neutral-100 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-lg font-bold text-neutral-900">
                            ${(item.service.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Clear Cart */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex justify-end"
              >
                <button
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-700 transition-colors text-sm font-medium"
                >
                  Clear Cart
                </button>
              </motion.div>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="card p-6 sticky top-24"
            >
              <h2 className="font-serif text-xl font-semibold text-neutral-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Subtotal</span>
                  <span className="font-medium">${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Delivery</span>
                  <span className="font-medium">Calculated at checkout</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Setup Service</span>
                  <span className="font-medium">Included</span>
                </div>
                <div className="border-t border-neutral-200 pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Link
                  href="/checkout"
                  className="w-full btn-primary flex items-center justify-center"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link
                  href="/services"
                  className="w-full btn-secondary text-center"
                >
                  Continue Shopping
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="mt-6 pt-6 border-t border-neutral-200">
                <div className="space-y-3 text-sm text-neutral-600">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span>Free consultation included</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span>Professional setup service</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span>Satisfaction guaranteed</span>
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
