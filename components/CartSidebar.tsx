'use client'

import { Fragment } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, ShoppingBag } from 'lucide-react'
import { useCart } from '@/lib/store/cart'

export function CartSidebar() {
  const { items, isOpen, toggleCart, updateQuantity, removeItem, getTotalPrice } = useCart()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-200">
              <h2 className="font-serif text-xl font-semibold">Shopping Cart</h2>
              <button
                onClick={toggleCart}
                className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                  <ShoppingBag className="w-16 h-16 text-neutral-300 mb-4" />
                  <h3 className="font-serif text-lg font-medium text-neutral-600 mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-neutral-500 mb-6">
                    Add some beautiful arrangements to get started
                  </p>
                  <Link
                    href="/services"
                    onClick={toggleCart}
                    className="btn-primary"
                  >
                    Browse Services
                  </Link>
                </div>
              ) : (
                <div className="p-6 space-y-6">
                  {items.map((item) => (
                    <div key={item.service.id} className="flex space-x-4">
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-neutral-100">
                        {item.service.images?.[0] && (
                          <Image
                            src={item.service.images[0]}
                            alt={item.service.title}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-neutral-900 truncate">
                          {item.service.title}
                        </h3>
                        <p className="text-sm text-neutral-500 mb-2">
                          ${item.service.price.toFixed(2)} each
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.service.id, item.quantity - 1)}
                              className="p-1 hover:bg-neutral-100 rounded transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.service.id, item.quantity + 1)}
                              className="p-1 hover:bg-neutral-100 rounded transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <button
                            onClick={() => removeItem(item.service.id)}
                            className="text-sm text-red-600 hover:text-red-700 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-medium text-neutral-900">
                          ${(item.service.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-neutral-200 p-6 space-y-4">
                <div className="flex items-center justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
                
                <div className="space-y-3">
                  <Link
                    href="/cart"
                    onClick={toggleCart}
                    className="block w-full btn-secondary text-center"
                  >
                    View Cart
                  </Link>
                  <Link
                    href="/checkout"
                    onClick={toggleCart}
                    className="block w-full btn-primary text-center"
                  >
                    Checkout
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
