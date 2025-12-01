import { PlaygroundLayout } from '@/components/wustep/PlaygroundLayout'

export default function ParticleSystemsPage() {
  return (
    <PlaygroundLayout
      title='Particle Systems'
      breadcrumbs={[{ label: 'Particle Systems' }]}
    >
      <div className='space-y-6'>
        <section>
          <h2 className='text-2xl font-semibold mb-4'>Overview</h2>
          <p className='text-muted-foreground'>
            Dynamic particle animations and physics simulations. This experiment
            showcases thousands of particles moving with realistic physics,
            including gravity, collision detection, and fluid dynamics.
          </p>
        </section>

        <section>
          <h2 className='text-2xl font-semibold mb-4'>Demo</h2>
          <div className='aspect-video rounded-lg border bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center'>
            <p className='text-white text-lg'>Canvas Placeholder</p>
          </div>
        </section>

        <section>
          <h2 className='text-2xl font-semibold mb-4'>Features</h2>
          <ul className='list-disc list-inside space-y-2 text-muted-foreground'>
            <li>10,000+ particles rendered simultaneously</li>
            <li>Physics-based motion (gravity, velocity, acceleration)</li>
            <li>Interactive controls for particle behavior</li>
            <li>Collision detection and response</li>
            <li>Color gradients and trails</li>
          </ul>
        </section>

        <section>
          <h2 className='text-2xl font-semibold mb-4'>Technologies</h2>
          <div className='flex flex-wrap gap-2'>
            {[
              'Canvas API',
              'JavaScript',
              'Verlet Integration',
              'Spatial Hashing'
            ].map((tech) => (
              <span
                key={tech}
                className='px-3 py-1 rounded-full bg-muted text-sm'
              >
                {tech}
              </span>
            ))}
          </div>
        </section>
      </div>
    </PlaygroundLayout>
  )
}

