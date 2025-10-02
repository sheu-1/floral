'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen pt-20 bg-gradient-floral flex items-center justify-center">
      <div className="text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-8xl font-bold text-primary-300 mb-4">404</div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
            Page Not Found
          </h1>
          <p className="text-lg text-neutral-600 mb-8 max-w-md mx-auto">
            Sorry, we couldn't find the page you're looking for. 
            It might have been moved or doesn't exist.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="btn-primary flex items-center justify-center"
            >
              <Home className="w-5 h-5 mr-2" />
              Go Home
            </Link>
            <Link
              href="/services"
              className="btn-secondary flex items-center justify-center"
            >
              <Search className="w-5 h-5 mr-2" />
              Browse Services
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
