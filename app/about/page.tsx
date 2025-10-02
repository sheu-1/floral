'use client'

import { motion } from 'framer-motion'
import { Heart, Award, Users, Sparkles } from 'lucide-react'
import Image from 'next/image'

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-20 bg-gradient-floral">
      <div className="container-max section-padding">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-neutral-900 mb-6">
            About Shillah Flowers
          </h1>
          <p className="text-lg text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            Creating beautiful memories through exquisite floral arrangements and event decorations. 
            We transform your special moments into unforgettable experiences with our passion for beauty and attention to detail.
          </p>
        </motion.div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="font-serif text-3xl font-semibold text-neutral-900 mb-6">
              Our Story
            </h2>
            <div className="space-y-4 text-neutral-600">
              <p>
                Founded in 2020 with a simple mission: to bring joy and beauty to life's most precious moments. 
                What started as a passion for floral design has grown into a full-service event decoration company 
                serving clients across Nairobi and beyond.
              </p>
              <p>
                We believe that every celebration deserves to be extraordinary. Whether it's an intimate wedding, 
                a milestone birthday, or a corporate gathering, we work closely with our clients to understand 
                their vision and bring it to life with creativity and precision.
              </p>
              <p>
                Our team of skilled designers and decorators are committed to excellence, using only the freshest 
                flowers and highest quality materials to create arrangements that not only look stunning but also 
                tell your unique story.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1606800052052-a08af7148866?w=600&q=80"
                alt="Shillah Flowers team at work"
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary-500 rounded-full flex items-center justify-center shadow-lg">
              <Heart className="w-12 h-12 text-white" />
            </div>
          </motion.div>
        </div>

        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-20"
        >
          <h2 className="font-serif text-3xl font-semibold text-neutral-900 text-center mb-12">
            What We Stand For
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-neutral-900 mb-4">
                Creativity & Innovation
              </h3>
              <p className="text-neutral-600">
                We constantly push the boundaries of floral design, bringing fresh ideas and innovative 
                approaches to every project we undertake.
              </p>
            </div>

            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-neutral-900 mb-4">
                Quality Excellence
              </h3>
              <p className="text-neutral-600">
                We source only the finest flowers and materials, ensuring every arrangement meets our 
                high standards of beauty and longevity.
              </p>
            </div>

            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-neutral-900 mb-4">
                Personal Service
              </h3>
              <p className="text-neutral-600">
                Every client receives personalized attention and care. We listen to your needs and work 
                tirelessly to exceed your expectations.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-20"
        >
          <h2 className="font-serif text-3xl font-semibold text-neutral-900 text-center mb-12">
            Meet Our Team
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card p-6 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white font-bold text-2xl">S</span>
              </div>
              <h3 className="font-serif text-xl font-semibold text-neutral-900 mb-2">
                Shillah Juma
              </h3>
              <p className="text-primary-600 font-medium mb-3">Founder & Lead Designer</p>
              <p className="text-neutral-600 text-sm">
                With over 5 years of experience in floral design, Shillah brings creativity and 
                passion to every project.
              </p>
            </div>

            <div className="card p-6 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-secondary-400 to-accent-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white font-bold text-2xl">M</span>
              </div>
              <h3 className="font-serif text-xl font-semibold text-neutral-900 mb-2">
                Mary Wanjiku
              </h3>
              <p className="text-primary-600 font-medium mb-3">Senior Decorator</p>
              <p className="text-neutral-600 text-sm">
                Mary specializes in large-scale event decorations and has a keen eye for 
                spatial design and color coordination.
              </p>
            </div>

            <div className="card p-6 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-accent-400 to-primary-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white font-bold text-2xl">J</span>
              </div>
              <h3 className="font-serif text-xl font-semibold text-neutral-900 mb-2">
                James Ochieng
              </h3>
              <p className="text-primary-600 font-medium mb-3">Event Coordinator</p>
              <p className="text-neutral-600 text-sm">
                James ensures every event runs smoothly, coordinating logistics and managing 
                setup to perfection.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="card p-12 text-center"
        >
          <h2 className="font-serif text-3xl font-semibold text-neutral-900 mb-12">
            Our Impact in Numbers
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">500+</div>
              <div className="text-neutral-600">Events Decorated</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">98%</div>
              <div className="text-neutral-600">Client Satisfaction</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">5+</div>
              <div className="text-neutral-600">Years Experience</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">50+</div>
              <div className="text-neutral-600">Partner Vendors</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
