'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, User, Menu, X, Heart, Search } from 'lucide-react'
import { useCart } from '@/lib/store/cart'
import { useAuth } from '@/lib/providers/AuthProvider'
import { CartSidebar } from './CartSidebar'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services' },
  { name: 'Wedding', href: '/services/wedding' },
  { name: 'Birthday', href: '/services/birthday' },
  { name: 'Corporate', href: '/services/corporate' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const { getTotalItems, toggleCart } = useCart()
  const { user, signOut } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    setIsOpen(false)
  }

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-soft shadow-lg' 
          : 'bg-transparent'
      }`}>
        <div className="container-max">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="font-serif text-xl font-semibold text-gradient">
                Shillah Flowers
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-colors duration-200 hover:text-primary-600 ${
                    pathname === item.href
                      ? 'text-primary-600'
                      : isScrolled
                      ? 'text-neutral-700'
                      : 'text-white'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <button className={`p-2 rounded-full transition-colors duration-200 hover:bg-primary-100 ${
                isScrolled ? 'text-neutral-700' : 'text-white'
              }`}>
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              {user && (
                <Link
                  href="/wishlist"
                  className={`p-2 rounded-full transition-colors duration-200 hover:bg-primary-100 ${
                    isScrolled ? 'text-neutral-700' : 'text-white'
                  }`}
                >
                  <Heart className="w-5 h-5" />
                </Link>
              )}

              {/* Cart */}
              <button
                onClick={toggleCart}
                className={`relative p-2 rounded-full transition-colors duration-200 hover:bg-primary-100 ${
                  isScrolled ? 'text-neutral-700' : 'text-white'
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </button>

              {/* User Menu */}
              <div className="relative">
                {user ? (
                  <div className="flex items-center space-x-2">
                    <Link
                      href="/account"
                      className={`p-2 rounded-full transition-colors duration-200 hover:bg-primary-100 ${
                        isScrolled ? 'text-neutral-700' : 'text-white'
                      }`}
                    >
                      <User className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className={`hidden sm:block text-sm font-medium transition-colors duration-200 hover:text-primary-600 ${
                        isScrolled ? 'text-neutral-700' : 'text-white'
                      }`}
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/auth"
                    className={`text-sm font-medium transition-colors duration-200 hover:text-primary-600 ${
                      isScrolled ? 'text-neutral-700' : 'text-white'
                    }`}
                  >
                    Sign In
                  </Link>
                )}
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`lg:hidden p-2 rounded-full transition-colors duration-200 hover:bg-primary-100 ${
                  isScrolled ? 'text-neutral-700' : 'text-white'
                }`}
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t border-neutral-200"
            >
              <div className="px-4 py-4 space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 hover:bg-primary-50 hover:text-primary-600 ${
                      pathname === item.href
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-neutral-700'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                {!user && (
                  <Link
                    href="/auth"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:bg-primary-50 hover:text-primary-600"
                  >
                    Sign In
                  </Link>
                )}
                {user && (
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:bg-primary-50 hover:text-primary-600"
                  >
                    Sign Out
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <CartSidebar />
    </>
  )
}
