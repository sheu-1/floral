'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Bride',
    content: 'Shillah Flowers made our wedding day absolutely magical! The floral arrangements were beyond our wildest dreams. Every detail was perfect, and the team was so professional and accommodating.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Corporate Event Manager',
    content: 'We\'ve worked with Shillah Flowers for multiple corporate events, and they never disappoint. Their attention to detail and ability to transform any space is remarkable. Highly recommended!',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Birthday Celebration',
    content: 'The birthday party decorations were absolutely stunning! My daughter was over the moon with the fairy-tale theme. The team went above and beyond to make her day special.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 4,
    name: 'David Thompson',
    role: 'Anniversary Celebration',
    content: 'For our 25th anniversary, Shillah Flowers created the most romantic atmosphere. The attention to detail and personalized touches made our celebration truly unforgettable.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 5,
    name: 'Lisa Park',
    role: 'Baby Shower Host',
    content: 'The baby shower decorations were perfect! Soft, elegant, and exactly what we envisioned. The team was so easy to work with and delivered everything on time.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 6,
    name: 'James Wilson',
    role: 'Groom',
    content: 'From the initial consultation to the wedding day, everything was seamless. The floral arrangements were breathtaking and perfectly matched our vision. Thank you for making our day perfect!',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
  }
]

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.ceil(testimonials.length / 3))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const visibleTestimonials = testimonials.slice(currentIndex * 3, (currentIndex * 3) + 3)

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
            What Our Clients Say
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our satisfied clients have to say 
            about their experience with Shillah Flowers.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">4.9</div>
            <div className="flex justify-center mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-5 h-5 text-amber-400 fill-current" />
              ))}
            </div>
            <div className="text-neutral-600">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">500+</div>
            <div className="text-neutral-600">Happy Clients</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">98%</div>
            <div className="text-neutral-600">Satisfaction Rate</div>
          </div>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {visibleTestimonials.map((testimonial, index) => (
            <motion.div
              key={`${testimonial.id}-${currentIndex}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="card p-6"
            >
              <div className="flex items-center mb-4">
                <Quote className="w-8 h-8 text-primary-300 mr-3" />
                <div className="flex">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
                  ))}
                </div>
              </div>
              
              <p className="text-neutral-700 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>
              
              <div className="flex items-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <div className="font-semibold text-neutral-900">{testimonial.name}</div>
                  <div className="text-sm text-neutral-600">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: Math.ceil(testimonials.length / 3) }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                index === currentIndex ? 'bg-primary-500' : 'bg-neutral-300'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
