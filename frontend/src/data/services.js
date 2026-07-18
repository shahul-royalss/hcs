/**
 * The six core service categories (architecture doc §3 Services Page).
 * `color` maps to Tailwind theme colors; `icon` is a lucide-react icon name
 * resolved via components/common/ServiceIcon.
 */

export const services = [
  {
    slug: 'personal-care',
    name: 'Personal Care Services',
    shortName: 'Personal Care',
    category: 'personal_care',
    icon: 'HandHeart',
    color: 'secondary',
    image: '/images/services/personal-care.svg',
    excerpt:
      'Dignified day-to-day assistance with bathing, grooming, mobility and meals — delivered with warmth at home.',
    description:
      'Our personal care attendants help your loved ones stay independent and comfortable in their own home. From morning routines to medication reminders, we take care of the everyday essentials with patience, privacy and respect.',
    features: [
      'Bathing assistance',
      'Grooming',
      'Mobility support',
      'Meal assistance',
      'Medication reminders',
    ],
    included: [
      'Trained and verified care attendant',
      'Personalised daily-care routine',
      'Hygiene and grooming support',
      'Assistance with walking and transfers',
      'Daily activity and wellness updates to family',
    ],
    pricingStartsFrom: 349,
    pricingUnit: 'per visit',
    related: ['elder-care', 'patient-care', 'home-nursing'],
  },
  {
    slug: 'home-nursing',
    name: 'Home Nursing Services',
    shortName: 'Home Nursing',
    category: 'nursing',
    icon: 'Stethoscope',
    color: 'primary',
    image: '/images/services/home-nursing.svg',
    excerpt:
      'Certified nurses at home for wound care, injections, IV therapy, vitals monitoring and post-operative care.',
    description:
      'Hospital-quality nursing at home. Our certified nurses handle clinical procedures under physician guidance — safely, hygienically and on schedule — so recovery can happen where patients heal best: at home.',
    features: [
      'Wound care',
      'Injection administration',
      'IV therapy',
      'Vital signs monitoring',
      'Post-operative care',
    ],
    included: [
      'Certified nurse (GNM/B.Sc)',
      'Doctor-directed clinical procedures',
      'Vitals tracking with digital reports',
      'Dressing, catheter and tube care',
      'Coordination with treating physician',
    ],
    pricingStartsFrom: 599,
    pricingUnit: 'per visit',
    related: ['patient-care', 'personal-care', 'elder-care'],
  },
  {
    slug: 'elder-care',
    name: 'Elder Care',
    shortName: 'Elder Care',
    category: 'elder_care',
    icon: 'Armchair',
    color: 'success',
    image: '/images/services/elder-care.svg',
    excerpt:
      'Companionship and daily living support for seniors, including dementia, Alzheimer’s and stroke-recovery care.',
    description:
      'Growing old at home, surrounded by family, is a blessing — and our elder-care team makes it safe and joyful. We combine companionship with specialised support for age-related conditions, so seniors live with dignity and families live with peace of mind.',
    features: [
      'Companionship',
      'Daily living assistance',
      'Dementia care',
      "Alzheimer's support",
      'Stroke recovery',
    ],
    included: [
      'Compassionate, verified caregiver',
      'Companionship and engagement activities',
      'Memory-care routines for dementia/Alzheimer’s',
      'Mobility and fall-prevention support',
      'Regular health and mood updates to family',
    ],
    pricingStartsFrom: 449,
    pricingUnit: 'per day',
    related: ['personal-care', 'patient-care', 'day-care'],
  },
  {
    slug: 'patient-care',
    name: 'Patient Care',
    shortName: 'Patient Care',
    category: 'patient_care',
    icon: 'BedDouble',
    color: 'warning',
    image: '/images/services/patient-care.svg',
    excerpt:
      'Round-the-clock care for bedridden patients, chronic illness management, palliative care and rehabilitation.',
    description:
      'For patients who need continuous attention, our patient-care attendants provide skilled, empathetic support — managing chronic conditions, preventing complications and keeping patients comfortable through recovery or long-term care.',
    features: [
      'Bedridden patient care',
      'Chronic illness management',
      'Palliative care',
      'Rehabilitation support',
    ],
    included: [
      'Trained patient-care attendant',
      'Positioning and bedsore prevention',
      'Feeding, hygiene and medication support',
      'Chronic-condition monitoring',
      'Rehabilitation exercise assistance',
    ],
    pricingStartsFrom: 799,
    pricingUnit: 'per day',
    related: ['home-nursing', 'elder-care', 'personal-care'],
  },
  {
    slug: 'child-care',
    name: 'Child Care Services',
    shortName: 'Child Care',
    category: 'child_care',
    icon: 'Baby',
    color: 'childcare',
    image: '/images/services/child-care.svg',
    excerpt:
      'Gentle, attentive care for infants and children — including special-needs support and post-surgery care.',
    description:
      'From newborns to children with special needs, our child-care professionals bring training, patience and genuine affection. We support your child’s health, nutrition and development while you balance work and family.',
    features: [
      'Infant care',
      'Special needs children',
      'Post-surgery care',
      'Nutritious meals',
      'Development activities',
      'Medicine reminders',
    ],
    included: [
      'Background-verified child-care professional',
      'Infant feeding, bathing and sleep routines',
      'Special-needs and post-surgery support',
      'Age-appropriate learning activities',
      'Meal planning and medicine schedules',
    ],
    pricingStartsFrom: 399,
    pricingUnit: 'per day',
    related: ['day-care', 'personal-care', 'home-nursing'],
  },
  {
    slug: 'day-care',
    name: 'Day Care Services',
    shortName: 'Day Care',
    category: 'day_care',
    icon: 'Sun',
    color: 'daycare',
    image: '/images/services/day-care.svg',
    excerpt:
      'A safe, supervised day-care environment with health monitoring, timely meals and engaging activity programs.',
    description:
      'Our day-care service offers families a trusted place for loved ones to spend the day — or full 24-hour care when needed. Health supervision, nutritious meals, rest and social activities are all part of a structured, caring routine.',
    features: [
      'Full day care (24 hours)',
      'Rest & health monitoring',
      'Timely meals',
      'Health supervision',
      'Activity programs',
    ],
    included: [
      'Safe, supervised care environment',
      'Round-the-clock health monitoring',
      'Nutritious meals and hydration schedule',
      'Recreation and social activities',
      'Daily reports to family members',
    ],
    pricingStartsFrom: 899,
    pricingUnit: 'per day',
    related: ['elder-care', 'child-care', 'patient-care'],
  },
]

export const getServiceBySlug = (slug) => services.find((s) => s.slug === slug)

export const getRelatedServices = (slugs = []) =>
  slugs.map((slug) => getServiceBySlug(slug)).filter(Boolean)
