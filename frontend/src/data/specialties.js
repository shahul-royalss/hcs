/** Special care programs (architecture doc §4 Specialties Page). */

export const specialties = [
  {
    slug: 'post-surgery-care',
    name: 'Post Surgery Care',
    icon: 'Syringe',
    color: 'primary',
    image: '/images/specialties/post-surgery-care.svg',
    overview:
      'Recovery after surgery is fastest — and safest — with disciplined wound care, medication schedules and gentle mobilisation at home.',
    approach:
      'A certified nurse manages dressings, drains and medications per the surgeon’s plan, while an attendant supports hygiene, meals and movement. We watch for warning signs and keep your surgeon informed.',
    carePlan: [
      'Surgical wound care and dressing changes',
      'Pain and medication management',
      'Infection watch and vitals monitoring',
      'Gradual mobilisation and physiotherapy coordination',
      'Nutrition support for faster healing',
    ],
    successStory:
      'After a knee-replacement surgery, 68-year-old Mr. Reddy walked unaided in 6 weeks with our structured home recovery program.',
  },
  {
    slug: 'bedridden-patient-care',
    name: 'Bedridden Patient Care',
    icon: 'BedDouble',
    color: 'secondary',
    image: '/images/specialties/bedridden-patient-care.svg',
    overview:
      'Bedridden patients need vigilant, skilled care to stay comfortable and avoid complications like bedsores, infections and stiffness.',
    approach:
      'Two-hourly repositioning, skin care, assisted feeding and hygiene — delivered on a strict schedule by trained attendants, with nursing oversight for catheters, tubes and wounds.',
    carePlan: [
      'Repositioning and bedsore prevention',
      'Bathing, grooming and linen care in bed',
      'Assisted feeding and hydration tracking',
      'Catheter, ryles-tube and ostomy care',
      'Passive limb exercises',
    ],
    successStory:
      'A family in Chittoor trusted us with their bedridden mother for 14 months — zero bedsores, zero hospital readmissions.',
  },
  {
    slug: 'dementia-care',
    name: 'Dementia Care',
    icon: 'Brain',
    color: 'daycare',
    image: '/images/specialties/dementia-care.svg',
    overview:
      'Dementia changes how a person remembers, thinks and feels. The right care keeps them safe, calm and connected to the people they love.',
    approach:
      'Caregivers trained in dementia support use consistent routines, memory cues and calm redirection — reducing agitation and sundowning while preserving dignity and independence.',
    carePlan: [
      'Structured daily routines and memory aids',
      'Safe home environment guidance',
      'Engagement: music, photos, reminiscence therapy',
      'Wandering and sundowning management',
      'Family coaching and monthly reviews',
    ],
    successStory:
      'With familiar routines and a constant caregiver, Mrs. Lakshmi’s evening agitation reduced dramatically within three weeks.',
  },
  {
    slug: 'stroke-recovery-care',
    name: 'Stroke Recovery Care',
    icon: 'Activity',
    color: 'warning',
    image: '/images/specialties/stroke-recovery-care.svg',
    overview:
      'The first months after a stroke decide long-term recovery. Consistent therapy and daily support at home rebuild strength and confidence.',
    approach:
      'We combine attendant care with physiotherapist-led exercise plans — speech practice, limb strengthening and daily-activity retraining — tracked week by week.',
    carePlan: [
      'Physiotherapy-coordinated exercise schedule',
      'Speech and swallowing practice support',
      'Assistance with daily-activity retraining',
      'Blood-pressure and medication monitoring',
      'Fall prevention and mobility aids guidance',
    ],
    successStory:
      'Six months after his stroke, Mr. Naidu regained independent walking and clear speech with our coordinated home program.',
  },
  {
    slug: 'palliative-care',
    name: 'Palliative Care',
    icon: 'HeartHandshake',
    color: 'success',
    image: '/images/specialties/palliative-care.svg',
    overview:
      'When cure is no longer the goal, comfort becomes everything. Palliative care focuses on relief from pain and emotional peace — for patients and families.',
    approach:
      'Our nurses and attendants provide gentle symptom management, pain-relief support and compassionate presence, coordinating with treating doctors and counselling families through difficult moments.',
    carePlan: [
      'Pain and symptom management support',
      'Comfort-focused nursing care',
      'Emotional and spiritual companionship',
      'Family counselling and respite care',
      '24/7 on-call support',
    ],
    successStory:
      'We helped a family keep their father comfortable and at home through his final months — surrounded by the people he loved.',
  },
  {
    slug: 'alzheimers-support',
    name: "Alzheimer's Support",
    icon: 'Puzzle',
    color: 'childcare',
    image: '/images/specialties/alzheimers-support.svg',
    overview:
      "Alzheimer's asks a lot of families. Specialised caregivers ease the load with structure, patience and genuine companionship.",
    approach:
      'Consistent caregivers build trust with the patient, follow memory-friendly routines and adapt as the condition progresses — from early reminders to full personal care.',
    carePlan: [
      'Stage-appropriate care planning',
      'Medication and appointment management',
      'Cognitive engagement activities',
      'Personal care as independence changes',
      'Caregiver continuity and family updates',
    ],
    successStory:
      'Three years and counting: the same Dhrishta caregiver still greets Mr. Sharma by name every morning — and he smiles back.',
  },
]

export const getSpecialtyBySlug = (slug) => specialties.find((s) => s.slug === slug)
