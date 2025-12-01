import dynamic from 'next/dynamic'

import { PlaygroundLayout } from '@/components/wustep/PlaygroundLayout'

const WebGLShaders = dynamic(() => import('@/playground/webgl-shaders'), {
  ssr: false
})

export default function WebGLShadersPage() {
  return (
    <PlaygroundLayout
      title='WebGL Shaders'
      breadcrumbs={[{ label: 'WebGL Shaders' }]}
    >
      <WebGLShaders />
    </PlaygroundLayout>
  )
}
