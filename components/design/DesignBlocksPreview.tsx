import type { ExtendedRecordMap } from 'notion-types'
import dynamic from 'next/dynamic'
import { NotionRenderer } from 'react-notion-x'

const Code = dynamic(() =>
  import('react-notion-x/build/third-party/code').then((module) => module.Code)
)
const Equation = dynamic(() =>
  import('react-notion-x/build/third-party/equation').then(
    (module) => module.Equation
  )
)

interface DesignBlocksPreviewProps {
  darkMode: boolean
  recordMap: ExtendedRecordMap
  rootPageId: string
}

export default function DesignBlocksPreview({
  darkMode,
  recordMap,
  rootPageId
}: DesignBlocksPreviewProps) {
  return (
    <NotionRenderer
      recordMap={recordMap}
      rootPageId={rootPageId}
      rootDomain='localhost'
      fullPage
      disableHeader
      darkMode={darkMode}
      showTableOfContents={false}
      isImageZoomable={false}
      components={{ Code, Equation }}
      mapPageUrl={() => '/design'}
      mapImageUrl={(url) => url}
    />
  )
}
