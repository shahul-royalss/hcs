import { Suspense, lazy } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ScrollToTop from '@/components/common/ScrollToTop'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import FloatingWhatsApp from '@/components/common/FloatingWhatsApp'
import SmoothScroll from '@/components/common/SmoothScroll'
import Cursor from '@/components/common/Cursor'
import ChatWidget from '@/components/chatbot/ChatWidget'

// Public pages (route-based code splitting)
const Home = lazy(() => import('@/pages/Home'))
const About = lazy(() => import('@/pages/About'))
const Services = lazy(() => import('@/pages/Services'))
const ServiceDetail = lazy(() => import('@/pages/ServiceDetail'))
const Specialties = lazy(() => import('@/pages/Specialties'))
const WhoWeServe = lazy(() => import('@/pages/WhoWeServe'))
const Packages = lazy(() => import('@/pages/Packages'))
const Gallery = lazy(() => import('@/pages/Gallery'))
const Team = lazy(() => import('@/pages/Team'))
const Stories = lazy(() => import('@/pages/Stories'))
const Contact = lazy(() => import('@/pages/Contact'))
const BookConsultation = lazy(() => import('@/pages/BookConsultation'))
const FAQ = lazy(() => import('@/pages/FAQ'))
const Careers = lazy(() => import('@/pages/Careers'))
const Blog = lazy(() => import('@/pages/Blog'))
const BlogPost = lazy(() => import('@/pages/BlogPost'))
const Emergency = lazy(() => import('@/pages/Emergency'))
const PrivacyPolicy = lazy(() => import('@/pages/PrivacyPolicy'))
const TermsConditions = lazy(() => import('@/pages/TermsConditions'))
const NotFound = lazy(() => import('@/pages/NotFound'))

// Admin portal (lazy-loaded so public visitors never download it)
const AdminLogin = lazy(() => import('@/admin/pages/Login'))
const AdminLayout = lazy(() => import('@/admin/AdminLayout'))
const AdminDashboard = lazy(() => import('@/admin/pages/Dashboard'))
const AdminBookings = lazy(() => import('@/admin/pages/Bookings'))
const AdminStaff = lazy(() => import('@/admin/pages/Staff'))
const AdminPatients = lazy(() => import('@/admin/pages/Patients'))
const AdminAnalytics = lazy(() => import('@/admin/pages/Analytics'))
const AdminGallery = lazy(() => import('@/admin/pages/Gallery'))
const AdminReviews = lazy(() => import('@/admin/pages/Reviews'))
const AdminInquiries = lazy(() => import('@/admin/pages/Inquiries'))
const AdminSettings = lazy(() => import('@/admin/pages/Settings'))

export default function App() {
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith('/admin')

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      {!isAdmin && (
        <>
          <SmoothScroll />
          <Cursor />
          <Navbar />
        </>
      )}

      <main className="flex-1">
        <Suspense fallback={<LoadingSpinner fullPage />}>
          <Routes>
            {/* Public site */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:slug" element={<ServiceDetail />} />
            <Route path="/specialties" element={<Specialties />} />
            <Route path="/who-we-serve" element={<WhoWeServe />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/team" element={<Team />} />
            <Route path="/stories" element={<Stories />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/book-consultation" element={<BookConsultation />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/emergency" element={<Emergency />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-conditions" element={<TermsConditions />} />

            {/* Admin portal */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="bookings" element={<AdminBookings />} />
              <Route path="staff" element={<AdminStaff />} />
              <Route path="patients" element={<AdminPatients />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="gallery" element={<AdminGallery />} />
              <Route path="reviews" element={<AdminReviews />} />
              <Route path="inquiries" element={<AdminInquiries />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      {!isAdmin && (
        <>
          <Footer />
          <FloatingWhatsApp />
          <ChatWidget />
        </>
      )}
    </div>
  )
}
