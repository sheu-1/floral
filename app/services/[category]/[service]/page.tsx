'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Heart, ShoppingCart, Star, Check, Calendar, MapPin, Clock } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase/client'
import { Service, Review } from '@/lib/types/database'
import { useCart } from '@/lib/store/cart'
import { useAuth } from '@/lib/providers/AuthProvider'

export default function ServiceDetailPage() {
  const params = useParams()
  const categorySlug = params.category as string
  const serviceSlug = params.service as string

  const [service, setService] = useState<Service | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  
  const { addItem } = useCart()
  const { user } = useAuth()

  useEffect(() => {
    if (categorySlug && serviceSlug) {
      fetchServiceDetails()
    }
  }, [categorySlug, serviceSlug])

  const fetchServiceDetails = async () => {
    try {
      // Get service details
      const { data: serviceData, error: serviceError } = await supabase
        .from('services')
        .select(`
          *,
          category:categories(*)
        `)
        .eq('slug', serviceSlug)
        .eq('is_active', true)
        .single()

      if (serviceError) throw serviceError
      setService(serviceData)

      // Get reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select(`
          *,
          user_profile:user_profiles(first_name, last_name)
        `)
        .eq('service_id', serviceData.id)
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
        .limit(10)

      if (reviewsError) throw reviewsError
      setReviews(reviewsData || [])

    } catch (error) {
      console.error('Error fetching service details:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (service) {
      addItem(service, quantity)
    }
  }

  const handleWishlist = () => {
    if (!user) {
      // Redirect to auth
      return
    }
    setIsWishlisted(!isWishlisted)
  }

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0

  if (loading) {
    return (
      <div className="min-h-screen pt-20">
        <div className="container-max section-padding">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="aspect-square bg-neutral-200 rounded-lg" />
              <div>
                <div className="h-8 bg-neutral-200 rounded w-3/4 mb-4" />
                <div className="h-4 bg-neutral-200 rounded w-1/2 mb-6" />
                <div className="h-20 bg-neutral-200 rounded mb-6" />
                <div className="h-12 bg-neutral-200 rounded w-1/3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-2xl font-bold text-neutral-900 mb-4">
            Service Not Found
          </h1>
          <p className="text-neutral-600 mb-6">
            The service you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/services" className="btn-primary">
            View All Services
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="container-max section-padding">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <nav className="flex items-center space-x-2 text-sm text-neutral-600">
            <Link href="/services" className="hover:text-primary-600 transition-colors">
              Services
            </Link>
            <span>/</span>
            <Link 
              href={`/services/${service.category?.slug}`}
              className="hover:text-primary-600 transition-colors"
            >
              {service.category?.name}
            </Link>
            <span>/</span>
            <span className="text-neutral-900">{service.title}</span>
          </nav>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square rounded-lg overflow-hidden bg-neutral-100">
                {service.images?.[selectedImage] && (
                  <Image
                    src={service.images[selectedImage]}
                    alt={service.title}
                    width={600}
                    height={600}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Thumbnail Images */}
              {service.images && service.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {service.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImage === index 
                          ? 'border-primary-500' 
                          : 'border-transparent hover:border-neutral-300'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${service.title} ${index + 1}`}
                        width={150}
                        height={150}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-6">
              {/* Header */}
              <div>
                {service.is_featured && (
                  <span className="inline-block bg-accent-100 text-accent-700 text-sm font-medium px-3 py-1 rounded-full mb-3">
                    Featured Service
                  </span>
                )}
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 mb-2">
                  {service.title}
                </h1>
                
                {/* Rating */}
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(averageRating)
                            ? 'text-amber-400 fill-current'
                            : 'text-neutral-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-neutral-600">
                    {averageRating > 0 ? averageRating.toFixed(1) : 'No reviews'} 
                    ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
                  </span>
                </div>

                <p className="text-lg text-neutral-600 leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Price */}
              <div className="border-t border-b border-neutral-200 py-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-3xl font-bold text-neutral-900">
                      ${service.price.toFixed(2)}
                    </span>
                    <span className="text-neutral-600 ml-2">per service</span>
                  </div>
                  <button
                    onClick={handleWishlist}
                    className={`p-3 rounded-full border-2 transition-all ${
                      isWishlisted
                        ? 'border-red-500 bg-red-500 text-white'
                        : 'border-neutral-300 text-neutral-600 hover:border-red-500 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Inclusions */}
              {service.inclusions && service.inclusions.length > 0 && (
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-3">What's Included:</h3>
                  <ul className="space-y-2">
                    {service.inclusions.map((inclusion, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="w-5 h-5 text-accent-500 mr-3 flex-shrink-0" />
                        <span className="text-neutral-700">{inclusion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Add to Cart */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="font-medium text-neutral-900">Quantity:</label>
                  <div className="flex items-center border border-neutral-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 hover:bg-neutral-100 transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 border-x border-neutral-300">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 hover:bg-neutral-100 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="w-full btn-primary flex items-center justify-center"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart - ${(service.price * quantity).toFixed(2)}
                </button>

                <div className="grid grid-cols-3 gap-4 text-center text-sm text-neutral-600">
                  <div className="flex flex-col items-center">
                    <Calendar className="w-5 h-5 mb-1" />
                    <span>Event Planning</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <MapPin className="w-5 h-5 mb-1" />
                    <span>Delivery Available</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Clock className="w-5 h-5 mb-1" />
                    <span>Setup Service</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        {reviews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-16 pt-16 border-t border-neutral-200"
          >
            <h2 className="font-serif text-2xl font-bold text-neutral-900 mb-8">
              Customer Reviews
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.slice(0, 4).map((review) => (
                <div key={review.id} className="card p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-neutral-600">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {review.comment && (
                    <p className="text-neutral-700 mb-4">"{review.comment}"</p>
                  )}
                  <div className="text-sm font-medium text-neutral-900">
                    {review.user_profile?.first_name} {review.user_profile?.last_name}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
