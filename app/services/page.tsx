'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Filter, Search, SlidersHorizontal } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { Service, Category } from '@/lib/types/database'
import { ServiceCard } from '@/components/ServiceCard'

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'featured'>('featured')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    filterAndSortServices()
  }, [searchTerm, selectedCategory, sortBy])

  const fetchData = async () => {
    try {
      const [servicesResponse, categoriesResponse] = await Promise.all([
        supabase
          .from('services')
          .select(`
            *,
            category:categories(*)
          `)
          .eq('is_active', true),
        supabase
          .from('categories')
          .select('*')
          .eq('is_active', true)
          .order('name')
      ])

      if (servicesResponse.error) throw servicesResponse.error
      if (categoriesResponse.error) throw categoriesResponse.error

      setServices(servicesResponse.data || [])
      setCategories(categoriesResponse.data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortServices = () => {
    let filtered = services

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(service => service.category_id === selectedCategory)
    }

    // Sort services
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title)
        case 'price':
          return a.price - b.price
        case 'featured':
          if (a.is_featured && !b.is_featured) return -1
          if (!a.is_featured && b.is_featured) return 1
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

    return filtered
  }

  const filteredServices = filterAndSortServices()

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

  return (
    <div className="min-h-screen pt-20">
      <div className="container-max section-padding">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-neutral-900 mb-4">
            Our Services
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Discover our complete range of floral arrangements and event decoration services, 
            designed to make every occasion memorable and beautiful.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden btn-secondary flex items-center"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
            </button>
          </div>

          {/* Filters */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-field"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'featured')}
                className="input-field"
              >
                <option value="featured">Featured First</option>
                <option value="name">Name A-Z</option>
                <option value="price">Price Low to High</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <p className="text-neutral-600">
            Showing {filteredServices.length} of {services.length} services
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
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('')
                setSortBy('featured')
              }}
              className="btn-primary"
            >
              Clear Filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
