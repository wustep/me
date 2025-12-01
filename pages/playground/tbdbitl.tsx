import { PlaygroundLayout } from '@/components/wustep/PlaygroundLayout'

export default function PlaygroundTbdbitlPage() {
  return (
    <PlaygroundLayout
      title='TBDBITL Infographic'
      breadcrumbs={[{ label: 'TBDBITL Infographic' }]}
    >
      <div className='space-y-6'>
        <p className='text-muted-foreground'>
          An interactive D3.js infographic celebrating The Ohio State University
          Marching Band (TBDBITL). Built in 2019 with Rui Lu and Lauren Haack,
          we walk through the marching band’s history, instrumentation,
          uniforms, and famous traditions.
        </p>
        <div className='border bg-card shadow-xl'>
          <iframe
            src='https://wustep.github.io/tbdbitl/'
            title='TBDBITL Infographic'
            className='h-[900px] w-full'
          />
        </div>
      </div>
    </PlaygroundLayout>
  )
}
