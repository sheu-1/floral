'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Search } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { Service, Category } from '@/lib/types/database'
import { ServiceCard } from '@/components/ServiceCard'

export default function CategoryServicesPage() {
  const params = useParams()
  const categorySlug = params.category as string

  const [services, setServices] = useState<Service[]>([])
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (categorySlug) {
      fetchCategoryAndServices()
    }
  }, [categorySlug])

  const fetchCategoryAndServices = async () => {
    try {
      // First get the category
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', categorySlug)
        .eq('is_active', true)
        .single()

      if (categoryError) throw categoryError
      setCategory(categoryData)

      // Then get services for this category
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select(`
          *,
          category:categories(*)
        `)
        .eq('category_id', categoryData.id)
        .eq('is_active', true)
        .order('is_featured', { ascending: false })
        .order('title')

      if (servicesError) throw servicesError
      setServices(servicesData || [])
    } catch (error) {
      console.error('Error fetching category services:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredServices = services.filter(service =>
    service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen pt-20">
        <div className="container-max section-padding">
          <div className="animate-pulse">
            <div className="h-8 bg-neutral-200 rounded w-64 mb-4" />
            <div className="h-4 bg-neutral-200 rounded w-96 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card">
                  <div className="aspect-[4/3] bg-neutral-200" />
                  <div className="p-6">
                    <div className="h-6 bg-neutral-200 rounded mb-2" />
                    <div className="h-4 bg-neutral-200 rounded w-3/4 mb-4" />
                    <div className="h-8 bg-neutral-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-2xl font-bold text-neutral-900 mb-4">
            Category Not Found
          </h1>
          <p className="text-neutral-600 mb-6">
            The category you're looking for doesn't exist or has been removed.
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
      {/* Hero Section */}
      <section 
        className="relative h-64 sm:h-80 bg-cover bg-center"
        style={{ 
          backgroundImage: category.image_url ? `url(${category.image_url})` : 'linear-gradient(135deg, #f9a8d4, #c4b5fd)' 
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 container-max h-full flex items-center px-4 sm:px-6 lg:px-8">
          <div className="text-white">
            <Link
              href="/services"
              className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Services
            </Link>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-lg text-white/90 max-w-2xl">
                {category.description}
              </p>
            )}
          </div>
        </div>
      </section>

      <div className="container-max section-padding">
        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
            <input
              type="text"
              placeholder={`Search ${category.name.toLowerCase()} services...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <p className="text-neutral-600">
            {filteredServices.length} {category.name.toLowerCase()} service{filteredServices.length !== 1 ? 's' : ''} available
          </p>
        </motion.div>

        {/* Services Grid */}
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-neutral-900 mb-2">
              No services found
            </h3>
            <p className="text-neutral-600 mb-6">
              {searchTerm 
                ? `No ${category.name.toLowerCase()} services match your search.`
                : `No ${category.name.toLowerCase()} services are currently available.`
              }
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="btn-primary"
              >
                Clear Search
              </button>
            )}
          </motion.div>
        )}

        {/* Call to Action */}
        {filteredServices.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mt-16 p-8 bg-gradient-floral rounded-2xl"
          >
            <h3 className="font-serif text-2xl font-bold text-neutral-900 mb-4">
              Need Something Custom?
            </h3>
            <p className="text-neutral-600 mb-6 max-w-2xl mx-auto">
              Don't see exactly what you're looking for? Our team specializes in creating 
              custom {category.name.toLowerCase()} decorations tailored to your unique vision and requirements.
            </p>
            <Link href="/contact" className="btn-primary">
              Get Custom Quote
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  )
}
