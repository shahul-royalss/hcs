import { useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { useBooking } from '@/hooks/useBooking'

const GENDERS = ['Female', 'Male']
const LANGUAGES = ['Telugu', 'English', 'Hindi', 'Tamil', 'Urdu']
const EXPERIENCE_LEVELS = ['2+ years', '5+ years', '10+ years']

/** Step 5 (optional) — caregiver preferences; fully skippable. */
export default function StaffPreference() {
  const { data, updateSection, nextStep, prevStep } = useBooking()
  const [values, setValues] = useState(data.staffPreference)

  const set = (key) => (e) => setValues((prev) => ({ ...prev, [key]: e.target.value }))

  const saveAndContinue = () => {
    updateSection('staffPreference', values)
    nextStep()
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-heading text-xl font-bold text-primary">Any caregiver preferences?</h2>
        <p className="mt-1 text-sm text-ink-light">
          This step is optional — skip it if you have no preference and we&rsquo;ll match the best
          available caregiver.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="pref-gender">Gender preference</Label>
          <Select id="pref-gender" value={values.gender} onChange={set('gender')}>
            <option value="">No preference</option>
            {GENDERS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="pref-language">Language</Label>
          <Select id="pref-language" value={values.language} onChange={set('language')}>
            <option value="">No preference</option>
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="pref-experience">Experience level</Label>
          <Select id="pref-experience" value={values.experienceLevel} onChange={set('experienceLevel')}>
            <option value="">No preference</option>
            {EXPERIENCE_LEVELS.map((exp) => (
              <option key={exp} value={exp}>
                {exp}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ivory-300 pt-5">
        <Button type="button" variant="ghost" onClick={prevStep}>
          <ArrowLeft aria-hidden="true" /> Back
        </Button>
        <div className="flex items-center gap-2">
          <Button type="button" variant="ghost" onClick={nextStep}>
            Skip this step
          </Button>
          <Button type="button" onClick={saveAndContinue}>
            Continue <ArrowRight aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  )
}
