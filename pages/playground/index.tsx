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
            className='group notion-collection-card relative flex h-full flex-col overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background'
          >
            <div className='notion-collection-card-cover aspect-video w-full'>
              {project.image ? (
                <img
                  src={project.image}
                  alt={`${project.title} cover`}
                  loading='lazy'
                  className='h-full w-full object-cover transition-transform duration-500'
                />
              ) : (
                <div
                  className={`h-full w-full bg-linear-to-br ${
                    project.gradient ?? 'from-slate-700 to-slate-900'
                  }`}
                />
              )}
            </div>
            <div className='notion-collection-card-body p-4 flex-1'>
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
