import { HeroBanner } from '@/components/HeroBanner'
import { FeaturedCategories } from '@/components/FeaturedCategories'
import { FeaturedServices } from '@/components/FeaturedServices'
import { Testimonials } from '@/components/Testimonials'
import { Newsletter } from '@/components/Newsletter'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroBanner />
      <FeaturedCategories />
      <FeaturedServices />
      <Testimonials />
      <Newsletter />
    </div>
  )
}
