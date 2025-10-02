'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'

const heroImages = [
  'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1920&q=80',
  'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1920&q=80',
  'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=1920&q=80',
]

export function HeroBanner() {
  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Images */}
      <div className="absolute inset-0">
        {heroImages.map((image, index) => (
          <motion.div
            key={image}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${image})` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: index === currentImage ? 1 : 0 }}
            transition={{ duration: 1.5 }}
          />
        ))}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Floating Petals */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="petal" />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-center mb-6"
        >
          <Sparkles className="w-6 h-6 text-primary-300 mr-2" />
          <span className="text-primary-300 font-medium tracking-wide uppercase text-sm">
            Elegant Event Decorations
          </span>
          <Sparkles className="w-6 h-6 text-primary-300 ml-2" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
        >
          Transform Your
          <span className="block text-gradient bg-gradient-to-r from-primary-300 to-secondary-300 bg-clip-text text-transparent">
            Special Moments
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg sm:text-xl text-neutral-200 mb-8 max-w-2xl mx-auto leading-relaxed"
        >
          Create unforgettable memories with our exquisite floral arrangements and event decoration services. 
          From intimate celebrations to grand occasions, we bring your vision to life.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            href="/services"
            className="group bg-primary-500 hover:bg-primary-600 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center"
          >
            Explore Services
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
          
          <Link
            href="/contact"
            className="group border-2 border-white text-white hover:bg-white hover:text-neutral-900 font-semibold py-4 px-8 rounded-full transition-all duration-300 backdrop-blur-soft"
          >
            Get Consultation
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-white/20"
        >
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-primary-300 mb-1">500+</div>
            <div className="text-sm text-neutral-300">Events Decorated</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-primary-300 mb-1">98%</div>
            <div className="text-sm text-neutral-300">Client Satisfaction</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-primary-300 mb-1">5+</div>
            <div className="text-sm text-neutral-300">Years Experience</div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-white/50 rounded-full mt-2"
          />
        </div>
      </motion.div>
    </section>
  )
}
