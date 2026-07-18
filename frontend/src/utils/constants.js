/** App-wide constants. Site content lives in src/data. */

export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  SERVICES: '/services',
  SERVICE_DETAIL: '/services/:slug',
  SPECIALTIES: '/specialties',
  WHO_WE_SERVE: '/who-we-serve',
  PACKAGES: '/packages',
  GALLERY: '/gallery',
  TEAM: '/team',
  STORIES: '/stories',
  CONTACT: '/contact',
  BOOK_CONSULTATION: '/book-consultation',
  FAQ: '/faq',
  CAREERS: '/careers',
  BLOG: '/blog',
  EMERGENCY: '/emergency',
  PRIVACY: '/privacy-policy',
  TERMS: '/terms-conditions',
  ADMIN: '/admin',
  ADMIN_LOGIN: '/admin/login',
}

export const BOOKING_STEPS = [
  { id: 1, key: 'service', title: 'Service' },
  { id: 2, key: 'patient', title: 'Patient' },
  { id: 3, key: 'contact', title: 'Contact' },
  { id: 4, key: 'schedule', title: 'Schedule' },
  { id: 5, key: 'staff', title: 'Preferences' },
  { id: 6, key: 'review', title: 'Review' },
  { id: 7, key: 'payment', title: 'Payment' },
]

export const PACKAGE_TYPES = ['hourly', 'daily', 'weekly', 'monthly', 'custom']

export const URGENCY_LEVELS = [
  { value: 'normal', label: 'Normal' },
  { value: 'urgent', label: 'Urgent' },
]

export const TIME_SLOTS = [
  'Morning (6 AM – 12 PM)',
  'Afternoon (12 PM – 6 PM)',
  'Evening (6 PM – 10 PM)',
  'Night (10 PM – 6 AM)',
  'Full Day (24 hours)',
]

export const BOOKING_STATUS = {
  pending: { label: 'Pending', color: 'warning' },
  confirmed: { label: 'Confirmed', color: 'secondary' },
  in_progress: { label: 'In Progress', color: 'primary' },
  completed: { label: 'Completed', color: 'success' },
  cancelled: { label: 'Cancelled', color: 'accent' },
}

/** Pincodes currently covered by the service-area checker (Chittoor region). */
export const SERVICE_AREA_PINCODES = [
  '517001', '517002', '517004', '517101', '517102', '517127',
  '517128', '517129', '517131', '517132', '517167', '517213',
  '517214', '517247', '517257', '517325', '517326', '517415',
  '517416', '517417', '517418', '517419', '517501', '517502',
  '517503', '517505', '517507', '517520', '517561', '517583',
  '517584', '517587', '517588', '517589', '517590', '517599',
]
