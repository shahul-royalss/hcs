import AnimatedSection from '@/components/common/AnimatedSection'
import TeamMemberCard from '@/components/team/TeamMemberCard'
import { cn } from '@/utils/cn'

/** Responsive grid of TeamMemberCard. */
export default function TeamGrid({ members = [], className }) {
  if (!members.length) {
    return <p className="py-10 text-center text-ink-light">No team members found in this category.</p>
  }

  return (
    <div className={cn('grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4', className)}>
      {members.map((member, i) => (
        <AnimatedSection key={member.id} delay={Math.min(i * 0.05, 0.3)} className="h-full">
          <TeamMemberCard member={member} />
        </AnimatedSection>
      ))}
    </div>
  )
}
