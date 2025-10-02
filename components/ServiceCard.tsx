'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import { Service } from '@/lib/types/database'
import { useCart } from '@/lib/store/cart'
import { useAuth } from '@/lib/providers/AuthProvider'

interface ServiceCardProps {
  service: Service
  index?: number
}

export function ServiceCard({ service, index = 0 }: ServiceCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const { addItem } = useCart()
  const { user } = useAuth()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem(service)
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!user) {
      // Redirect to auth or show login modal
      return
    }
    setIsWishlisted(!isWishlisted)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <Link href={`/services/${service.category?.slug}/${service.slug}`}>
        <div className="card group-hover:shadow-2xl transition-all duration-300">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden">
            {service.images?.[0] && (
              <Image
                src={service.images[0]}
                alt={service.title}
                fill
                className={`object-cover transition-all duration-500 group-hover:scale-105 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
              />
            )}
            
            {/* Loading placeholder */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-secondary-100 animate-pulse" />
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />

            {/* Actions */}
            <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={handleWishlist}
                className={`p-2 rounded-full backdrop-blur-soft transition-all duration-200 ${
                  isWishlisted
                    ? 'bg-red-500 text-white'
                    : 'bg-white/90 text-neutral-700 hover:bg-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={handleAddToCart}
                className="p-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors duration-200"
              >
                <ShoppingCart className="w-4 h-4" />
              </button>
            </div>

            {/* Featured badge */}
            {service.is_featured && (
              <div className="absolute top-4 left-4">
                <span className="bg-accent-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                  Featured
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-serif text-lg font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors duration-200">
                {service.title}
              </h3>
              <div className="flex items-center space-x-1 text-sm text-amber-500">
                <Star className="w-4 h-4 fill-current" />
                <span>4.8</span>
              </div>
            </div>

            {service.short_description && (
              <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
                {service.short_description}
              </p>
            )}

            {/* Inclusions */}
            {service.inclusions && service.inclusions.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {service.inclusions.slice(0, 2).map((inclusion, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded-full"
                    >
                      {inclusion}
                    </span>
                  ))}
                  {service.inclusions.length > 2 && (
                    <span className="text-xs text-neutral-500">
                      +{service.inclusions.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xl font-bold text-neutral-900">
                  ${service.price.toFixed(2)}
                </span>
                <span className="text-sm text-neutral-500 ml-1">per service</span>
              </div>
              
              <button
                onClick={handleAddToCart}
                className="btn-primary text-sm py-2 px-4"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
