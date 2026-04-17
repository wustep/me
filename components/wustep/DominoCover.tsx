export function DominoCover() {
  return (
    <div
      className='relative flex h-full w-full items-center justify-center overflow-hidden bg-[#0d0d0d]'
    >
      <div
        className='pointer-events-none absolute inset-0'
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(255,255,255,0.08) 0%, transparent 60%)'
        }}
      />
      <div
        className='relative flex items-center justify-center gap-1 font-bold tracking-[-0.03em] text-white'
        style={{
          fontSize: '2.4rem',
          fontFamily: 'var(--font-serif)'
        }}
      >
        <span>DOM</span>
        <span
          className='inline-flex rotate-[2deg] items-center justify-center rounded-[6px] bg-white text-[#0d0d0d] transition-transform duration-[250ms] ease-out group-hover:rotate-[-3deg] group-hover:-translate-y-0.5'
          style={{ padding: '4px 10px' }}
        >
          ino
        </span>
      </div>
    </div>
  )
}
