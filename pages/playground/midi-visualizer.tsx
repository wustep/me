import { MidiVisualizer } from '@/components/wustep/MidiVisualizer'
import { PlaygroundLayout } from '@/components/wustep/PlaygroundLayout'

export default function PlaygroundMidiVisualizerPage() {
  return (
    <PlaygroundLayout
      title='MIDI Visualizer'
      breadcrumbs={[{ label: 'MIDI Visualizer' }]}
      fullFrame
    >
      <MidiVisualizer className='flex-1' />
    </PlaygroundLayout>
  )
}
