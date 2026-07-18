import { Card, CardContent } from '@/components/ui/card'
import { useBooking } from '@/hooks/useBooking'
import StepIndicator from './StepIndicator'
import ServiceSelection from './ServiceSelection'
import PatientDetails from './PatientDetails'
import ContactInfo from './ContactInfo'
import Schedule from './Schedule'
import StaffPreference from './StaffPreference'
import ReviewConfirm from './ReviewConfirm'
import Payment from './Payment'
import BookingSuccess from './BookingSuccess'

const STEP_COMPONENTS = {
  1: ServiceSelection,
  2: PatientDetails,
  3: ContactInfo,
  4: Schedule,
  5: StaffPreference,
  6: ReviewConfirm,
  7: Payment,
}

/** Orchestrates the 7-step booking flow (architecture doc §11). */
export default function BookingForm() {
  const { step, confirmation } = useBooking()
  const StepComponent = STEP_COMPONENTS[step] || ServiceSelection

  return (
    <Card className="mx-auto w-full max-w-3xl">
      <CardContent className="p-6 md:p-8">
        {confirmation ? (
          <BookingSuccess />
        ) : (
          <>
            <StepIndicator />
            <StepComponent />
          </>
        )}
      </CardContent>
    </Card>
  )
}
