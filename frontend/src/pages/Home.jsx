import Seo from '@/components/common/Seo'
import HeroSection from '@/components/home/HeroSection'
import StatsSection from '@/components/home/StatsSection'
import ServicesOverview from '@/components/home/ServicesOverview'
import WhyChooseUs from '@/components/home/WhyChooseUs'
import HowItWorks from '@/components/home/HowItWorks'
import PackagesPreview from '@/components/home/PackagesPreview'
import Testimonials from '@/components/home/Testimonials'
import EmergencyBanner from '@/components/home/EmergencyBanner'

/** Home page — composes all landing sections (nav/footer come from the App shell). */
export default function Home() {
  return (
    <>
      <Seo description="Trusted home healthcare in Chittoor — home nursing, elder care, patient care, child care and day care. Certified nurses, verified caregivers, 24/7 support. Book a free consultation today." />
      <HeroSection />
      <StatsSection />
      <ServicesOverview />
      <WhyChooseUs />
      <HowItWorks />
      <PackagesPreview />
      <Testimonials />
      <EmergencyBanner />
    </>
  )
}
