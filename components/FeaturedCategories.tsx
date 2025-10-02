'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { Category } from '@/lib/types/database'

export function FeaturedCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('name')

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="text-center mb-12">
            <div className="h-8 bg-neutral-200 rounded w-64 mx-auto mb-4 animate-pulse" />
            <div className="h-4 bg-neutral-200 rounded w-96 mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="aspect-[4/3] bg-neutral-200" />
                <div className="p-6">
                  <div className="h-6 bg-neutral-200 rounded mb-2" />
                  <div className="h-4 bg-neutral-200 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="section-padding bg-white">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
            Our Specialties
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            From intimate gatherings to grand celebrations, we create stunning decorations 
            for every occasion and milestone in your life.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <Link href={`/services/${category.slug}`}>
                <div className="card group-hover:shadow-2xl transition-all duration-300 overflow-hidden">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {category.image_url && (
                      <Image
                        src={category.image_url}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Category name overlay */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="font-serif text-xl font-semibold text-white mb-1">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="text-sm text-neutral-200 line-clamp-2">
                          {category.description}
                        </p>
                      )}
                    </div>

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-primary-500/0 group-hover:bg-primary-500/20 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                        <div className="bg-white/90 backdrop-blur-soft rounded-full p-3">
                          <ArrowRight className="w-6 h-6 text-primary-600" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
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
            className="inline-flex items-center btn-outline group"
          >
            View All Services
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
