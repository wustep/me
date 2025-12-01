export default function WebGLShaders() {
  return (
    <div className='space-y-6'>
      <section>
        <h2 className='text-2xl font-semibold mb-4'>Overview</h2>
        <p className='text-muted-foreground'>
          Explore interactive shader experiments with WebGL. This experiment
          demonstrates real-time graphics programming using fragment shaders to
          create beautiful visual effects.
        </p>
      </section>

      <section>
        <h2 className='text-2xl font-semibold mb-4'>Demo</h2>
        <div className='aspect-video rounded-lg border bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center'>
          <p className='text-white text-lg'>WebGL Canvas Placeholder</p>
        </div>
      </section>

      <section>
        <h2 className='text-2xl font-semibold mb-4'>Technical Details</h2>
        <ul className='list-disc list-inside space-y-2 text-muted-foreground'>
          <li>Real-time fragment shader rendering</li>
          <li>Interactive mouse/touch controls</li>
          <li>Optimized for 60fps performance</li>
          <li>WebGL 2.0 compatible</li>
        </ul>
      </section>
    </div>
  )
}
