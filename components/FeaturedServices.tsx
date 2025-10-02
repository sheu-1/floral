'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { Service } from '@/lib/types/database'
import { ServiceCard } from './ServiceCard'

export function FeaturedServices() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedServices()
  }, [])

  const fetchFeaturedServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select(`
          *,
          category:categories(*)
        `)
        .eq('is_featured', true)
        .eq('is_active', true)
        .limit(6)

      if (error) throw error
      setServices(data || [])
    } catch (error) {
      console.error('Error fetching featured services:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="section-padding bg-gradient-floral">
        <div className="container-max">
          <div className="text-center mb-12">
            <div className="h-8 bg-white/50 rounded w-64 mx-auto mb-4 animate-pulse" />
            <div className="h-4 bg-white/50 rounded w-96 mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card animate-pulse">
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
      </section>
    )
  }

  return (
    <section className="section-padding bg-gradient-floral">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
            Featured Services
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Discover our most popular decoration services, carefully crafted to make 
            your special moments truly unforgettable.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link
            href="/services"
            className="inline-flex items-center btn-primary group"
          >
            View All Services
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
