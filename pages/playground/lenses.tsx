import { PlaygroundLayout } from '@/components/wustep/PlaygroundLayout'
import { LensesPage } from '@/components/wustep/LensesPage'

export default function PlaygroundLensesPage() {
  return (
    <PlaygroundLayout
      title='Lenses'
      breadcrumbs={[{ label: 'Lenses' }]}
      fullFrame
    >
      <LensesPage embedded />
    </PlaygroundLayout>
  )
}
