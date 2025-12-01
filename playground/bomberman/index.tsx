export default function Bomberman() {
  return (
    <div className='relative w-full overflow-hidden rounded-2xl border border-border bg-black/40 shadow-lg shadow-black/30'>
      <iframe
        src='https://wustep-bomberman.vercel.app/'
        title='Bomberman iframe'
        className='h-[720px] w-full border-0'
        loading='lazy'
        allow='fullscreen *; gamepad *'
        allowFullScreen
      />
    </div>
  )
}
