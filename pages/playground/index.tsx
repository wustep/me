import Link from 'next/link'

import { PlaygroundLayout } from '@/components/wustep/PlaygroundLayout'

const projects = [
  {
    title: 'WebGL Shaders',
    url: '/playground/webgl-shaders',
    description: 'Interactive shader experiments with WebGL',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    title: 'Particle Systems',
    url: '/playground/particle-systems',
    description: 'Dynamic particle animations and physics',
    gradient: 'from-blue-500 to-cyan-500'
  }
]

export default function PlaygroundPage() {
  return (
    <PlaygroundLayout title='Playground'>
      <p className='text-muted-foreground mb-8'>
        A collection of interactive experiments, demos, and creative projects.
      </p>

      <div className='grid gap-6 md:grid-cols-2'>
        {projects.map((project) => (
          <Link
            key={project.url}
            href={project.url}
            className='group relative overflow-hidden rounded-lg border bg-card hover:shadow-lg transition-shadow'
          >
            <div
              className={`aspect-video bg-linear-to-br ${project.gradient}`}
            />
            <div className='p-4'>
              <h3 className='font-semibold mb-1'>{project.title}</h3>
              <p className='text-sm text-muted-foreground'>
                {project.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </PlaygroundLayout>
  )
}
