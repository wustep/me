import { SiteInfoPage } from '@/components/SiteInfoPage'
import {
  githubUrl,
  linkedinUrl,
  notionContactUrl,
  siteName,
  xUrl
} from '@/lib/site-identity'

export default function ContactPage() {
  return (
    <SiteInfoPage
      title='Contact'
      description={`How to reach ${siteName}.`}
      path='/contact'
    >
      <p>
        I&apos;m easiest to find as wustep on <a href={xUrl}>X</a>,{' '}
        <a href={githubUrl}>GitHub</a>, or <a href={linkedinUrl}>LinkedIn</a>.
        There&apos;s also a{' '}
        <a href={notionContactUrl} rel='noopener noreferrer'>
          Notion contact form
        </a>{' '}
        if you&apos;d rather not reply in public.
      </p>
    </SiteInfoPage>
  )
}
