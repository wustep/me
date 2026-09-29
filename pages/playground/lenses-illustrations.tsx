import { LensesIllustrationLab } from '@/components/wustep/lenses/LensesIllustrationLab'
import { PlaygroundLayout } from '@/components/wustep/PlaygroundLayout'

export default function PlaygroundLensesIllustrationsPage() {
  return (
    <PlaygroundLayout
      title='Lenses Illustration Lab'
      breadcrumbs={[
        { label: 'Lenses', href: '/playground/lenses' },
        { label: 'Illustrations' }
      ]}
      fullFrame
    >
      <LensesIllustrationLab />
    </PlaygroundLayout>
  )
}
