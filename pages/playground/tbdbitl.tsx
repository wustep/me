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
        <div className='rounded-3xl border bg-card shadow-lg'>
          <iframe
            src='/playground/tbdbitl/index.html'
            title='TBDBITL Infographic'
            className='h-[900px] w-full rounded-3xl'
          />
        </div>
      </div>
    </PlaygroundLayout>
  )
}
