/** Target audiences (architecture doc §5 Who We Serve). */

export const audiences = [
  {
    id: 'senior-citizens',
    title: 'Senior Citizens',
    icon: 'Armchair',
    color: 'success',
    description:
      'Seniors who want to age gracefully at home — with companionship, daily-living support and health supervision that keeps them independent and safe.',
    howWeHelp: [
      'Companionship and emotional support',
      'Assistance with bathing, dressing and meals',
      'Medication schedules and health monitoring',
      'Fall-prevention and mobility support',
    ],
    relatedService: 'elder-care',
  },
  {
    id: 'post-surgery',
    title: 'Patients Recovering from Surgery',
    icon: 'Syringe',
    color: 'primary',
    description:
      'Patients discharged after surgery who need disciplined wound care, medication management and gentle rehabilitation to recover fully at home.',
    howWeHelp: [
      'Nurse-led wound care and dressing changes',
      'Pain and medication management',
      'Physiotherapy coordination',
      'Recovery progress reports to your surgeon',
    ],
    relatedService: 'home-nursing',
  },
  {
    id: 'special-needs-children',
    title: 'Children with Special Needs',
    icon: 'Baby',
    color: 'childcare',
    description:
      'Children who need patient, trained care — from developmental support to post-surgery recovery — delivered with genuine affection.',
    howWeHelp: [
      'Trained special-needs caregivers',
      'Therapy and development activities',
      'Nutrition and medicine schedules',
      'Respite support for parents',
    ],
    relatedService: 'child-care',
  },
  {
    id: 'disabled-individuals',
    title: 'Disabled Individuals',
    icon: 'Accessibility',
    color: 'secondary',
    description:
      'Adults living with physical disabilities who deserve capable, respectful assistance that maximises independence and dignity.',
    howWeHelp: [
      'Personal care and transfer assistance',
      'Mobility-aid support and exercises',
      'Household routine assistance',
      'Companionship and outings support',
    ],
    relatedService: 'personal-care',
  },
  {
    id: 'chronic-illness',
    title: 'Chronic Illness Patients',
    icon: 'HeartPulse',
    color: 'warning',
    description:
      'People managing diabetes, hypertension, cardiac, kidney or neurological conditions who need consistent monitoring and care between hospital visits.',
    howWeHelp: [
      'Daily vitals and symptom monitoring',
      'Medication adherence management',
      'Diet and lifestyle support',
      'Doctor coordination and escalation',
    ],
    relatedService: 'patient-care',
  },
  {
    id: 'families',
    title: 'Families Seeking Home Care',
    icon: 'Users',
    color: 'daycare',
    description:
      'Busy families — often living in other cities — who want a trustworthy partner caring for their loved ones back home, with full transparency.',
    howWeHelp: [
      'Verified, background-checked staff',
      'Daily updates on WhatsApp',
      'Single care coordinator as point of contact',
      '24/7 helpline for emergencies',
    ],
    relatedService: 'day-care',
  },
]
