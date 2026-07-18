import { createContext, useCallback, useMemo, useState } from 'react'
import { BOOKING_STEPS } from '@/utils/constants'

export const BookingContext = createContext(null)

const initialData = {
  // Step 1 — service selection
  serviceSlug: '',
  packageType: '',
  specialtySlug: '',
  // Step 2 — patient details
  patient: { name: '', age: '', gender: '', medicalCondition: '', specialRequirements: '' },
  // Step 3 — contact info
  contact: { name: '', relationship: '', phone: '', email: '', address: '', pincode: '' },
  // Step 4 — schedule
  schedule: { startDate: '', timeSlot: '', duration: '', urgency: 'normal' },
  // Step 5 — staff preference (optional)
  staffPreference: { gender: '', language: '', experienceLevel: '' },
  // Step 7 — payment
  payment: { mode: 'pay_later', advanceAmount: 0 },
  termsAccepted: false,
}

/** Multi-step booking form state (architecture doc §11). */
export function BookingProvider({ children }) {
  const [step, setStep] = useState(1)
  const [data, setData] = useState(initialData)
  const [confirmation, setConfirmation] = useState(null)

  const updateData = useCallback((patch) => {
    setData((prev) => ({ ...prev, ...patch }))
  }, [])

  const updateSection = useCallback((section, patch) => {
    setData((prev) => ({ ...prev, [section]: { ...prev[section], ...patch } }))
  }, [])

  const nextStep = useCallback(
    () => setStep((s) => Math.min(s + 1, BOOKING_STEPS.length)),
    []
  )
  const prevStep = useCallback(() => setStep((s) => Math.max(s - 1, 1)), [])
  const goToStep = useCallback((s) => setStep(s), [])

  const reset = useCallback(() => {
    setStep(1)
    setData(initialData)
    setConfirmation(null)
  }, [])

  const value = useMemo(
    () => ({
      step,
      steps: BOOKING_STEPS,
      data,
      confirmation,
      setConfirmation,
      updateData,
      updateSection,
      nextStep,
      prevStep,
      goToStep,
      reset,
    }),
    [step, data, confirmation, updateData, updateSection, nextStep, prevStep, goToStep, reset]
  )

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
}
