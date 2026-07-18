import { GraduationCap } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

/** Profile card: photo, name, designation, specialization, qualifications, experience, languages. */
export default function TeamMemberCard({ member }) {
  return (
    <Card className="group flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover">
      <div className="relative overflow-hidden bg-surface">
        <img
          src={member.photo}
          alt={member.name}
          loading="lazy"
          className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <Badge variant="secondary" className="absolute right-3 top-3 bg-white/90 shadow-sm">
          {member.experience}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-heading text-lg font-bold text-primary">{member.name}</h3>
        <p className="text-sm font-semibold text-secondary">{member.designation}</p>
        <p className="mt-2 text-sm text-ink-light">{member.specialization}</p>
        <p className="mt-2 flex items-start gap-1.5 text-xs text-ink-light">
          <GraduationCap className="mt-0.5 h-3.5 w-3.5 shrink-0 text-secondary" aria-hidden="true" />
          {member.qualifications}
        </p>

        <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
          {member.languages.map((language) => (
            <span
              key={language}
              className="rounded-full bg-surface px-2.5 py-1 text-xs font-medium text-ink-light"
            >
              {language}
            </span>
          ))}
        </div>
      </div>
    </Card>
  )
}
