import dynamic from 'next/dynamic'

import { PlaygroundLayout } from '@/components/wustep/PlaygroundLayout'

const JevInbox = dynamic(
  () => import('@/components/wustep/jev-inbox').then((m) => m.JevInbox),
  { ssr: false }
)

export default function PlaygroundJevInboxPage() {
  return (
    <PlaygroundLayout
      title='Jev Inbox'
      breadcrumbs={[{ label: 'Jev Inbox' }]}
      fullFrame
    >
      <JevInbox />
    </PlaygroundLayout>
  )
}
