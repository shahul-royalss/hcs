import Seo from '@/components/common/Seo'
import HeroSection from '@/components/home/HeroSection'
import StorySection from '@/components/home/StorySection'
import ServicesOverview from '@/components/home/ServicesOverview'
import HowItWorks from '@/components/home/HowItWorks'
import WhyChooseUs from '@/components/home/WhyChooseUs'
import StatsSection from '@/components/home/StatsSection'
import PackagesPreview from '@/components/home/PackagesPreview'
import Testimonials from '@/components/home/Testimonials'
import MomentsStrip from '@/components/home/MomentsStrip'
import FaqPreview from '@/components/home/FaqPreview'
import EmergencyBanner from '@/components/home/EmergencyBanner'
import SunsetContact from '@/components/home/SunsetContact'

/**
 * Home page — the "morning light" film in ten scenes
 * (docs/design/MORNING_LIGHT_BLUEPRINT.md): calm → empathy → capability →
 * clarity → trust → proof → humanity → intimacy → honesty → hope.
 */
export default function Home() {
  return (
    <>
      <Seo description="Trusted home healthcare in Chittoor — home nursing, elder care, patient care, child care and day care. Certified nurses, verified caregivers, 24/7 support. Book a free consultation today." />
      <HeroSection />
      <StorySection />
      <ServicesOverview />
      <HowItWorks />
      <WhyChooseUs />
      <StatsSection />
      <PackagesPreview />
      <Testimonials />
      <MomentsStrip />
      <FaqPreview />
      <EmergencyBanner />
      <SunsetContact />
    </>
  )
}
