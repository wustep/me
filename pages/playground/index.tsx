import Link from 'next/link'

import { PlaygroundLayout } from '@/components/wustep/PlaygroundLayout'
import { playgroundEntries } from '@/playground/registry'

const projects = playgroundEntries.filter((project) => !project.disabled)

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
            <div className='aspect-video w-full overflow-hidden'>
              {project.image ? (
                <div
                  className='h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105'
                  style={{ backgroundImage: `url(${project.image})` }}
                />
              ) : (
                <div
                  className={`h-full w-full bg-linear-to-br ${
                    project.gradient ?? 'from-slate-700 to-slate-900'
                  }`}
                />
              )}
            </div>
            <div className='p-4'>
              <h3 className='font-semibold mb-1'>{project.title}</h3>
              <p className='text-sm text-muted-foreground'>
                {project.summary ?? project.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </PlaygroundLayout>
  )
}
