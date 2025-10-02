'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle, Calendar, Mail, Phone } from 'lucide-react'
import Link from 'next/link'
import { useCart } from '@/lib/store/cart'
import { verifyPaystackPayment } from '@/lib/paystack'

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { clearCart } = useCart()
  const [paymentReference, setPaymentReference] = useState<string | null>(null)
  const [verifying, setVerifying] = useState(true)
  const [verificationError, setVerificationError] = useState<string | null>(null)

  useEffect(() => {
    const reference = searchParams.get('reference')
    const trxref = searchParams.get('trxref')
    
    // Paystack returns reference or trxref parameter
    const paymentRef = reference || trxref
    
    if (paymentRef) {
      setPaymentReference(paymentRef)
      verifyPayment(paymentRef)
    } else {
      // Redirect to home if no payment reference
      router.push('/')
    }
  }, [searchParams, router])

  const verifyPayment = async (reference: string) => {
    try {
      setVerifying(true)
      const result = await verifyPaystackPayment(reference)
      
      if (result.success) {
        // Payment verified successfully
        clearCart()
        setVerifying(false)
      } else {
        throw new Error('Payment verification failed')
      }
    } catch (error) {
      console.error('Payment verification error:', error)
      setVerificationError('Failed to verify payment. Please contact support.')
      setVerifying(false)
    }
  }

  if (verifying) {
    return (
      <div className="min-h-screen pt-20 bg-gradient-floral flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-neutral-900 mb-2">Verifying Payment...</h2>
          <p className="text-neutral-600">Please wait while we confirm your payment.</p>
        </div>
      </div>
    )
  }

  if (verificationError) {
    return (
      <div className="min-h-screen pt-20 bg-gradient-floral">
        <div className="container-max section-padding">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-red-600 text-2xl">⚠️</span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-neutral-900 mb-4">Payment Verification Failed</h1>
            <p className="text-lg text-neutral-600 mb-8">{verificationError}</p>
            <Link href="/contact" className="btn-primary">Contact Support</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 bg-gradient-floral">
      <div className="container-max section-padding">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
              Order Confirmed!
            </h1>
            
            <p className="text-lg text-neutral-600 mb-8">
              Thank you for choosing Shillah Flowers! Your order has been successfully placed 
              and we're excited to help make your event beautiful.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="card p-8 mb-8"
          >
            <h2 className="font-serif text-xl font-semibold text-neutral-900 mb-6">
              What Happens Next?
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Mail className="w-4 h-4 text-primary-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-neutral-900 mb-1">
                    Confirmation Email
                  </h3>
                  <p className="text-sm text-neutral-600">
                    You'll receive a detailed confirmation email with your order details 
                    and receipt within the next few minutes.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Phone className="w-4 h-4 text-primary-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-neutral-900 mb-1">
                    Personal Consultation
                  </h3>
                  <p className="text-sm text-neutral-600">
                    Our team will contact you within 24 hours to discuss your event details, 
                    preferences, and finalize the decoration plan.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Calendar className="w-4 h-4 text-primary-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-neutral-900 mb-1">
                    Event Day Setup
                  </h3>
                  <p className="text-sm text-neutral-600">
                    Our professional team will arrive at your venue on the event day 
                    to set up everything perfectly according to your vision.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-4"
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/account/orders" className="btn-primary">
                View Order Details
              </Link>
              <Link href="/services" className="btn-secondary">
                Browse More Services
              </Link>
            </div>

            <p className="text-sm text-neutral-600">
              Need help? Contact us at{' '}
              <a href="mailto:shillahjuma1@gmail.com" className="text-primary-600 hover:underline">
                shillahjuma1@gmail.com
              </a>{' '}
              or{' '}
              <a href="tel:+254112013474" className="text-primary-600 hover:underline">
                +254 112 013474
              </a>
            </p>
          </motion.div>

          {/* Confetti Animation */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 50 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-primary-400 rounded-full"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: -10,
                  rotate: 0,
                }}
                animate={{
                  y: window.innerHeight + 10,
                  rotate: 360,
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  delay: Math.random() * 2,
                  ease: 'linear',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
