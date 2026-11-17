import { SiteInfoPage } from '@/components/SiteInfoPage'
import { SanFranciscoTime } from '@/components/wustep/SanFranciscoTime'
import {
  githubUrl,
  linkedinUrl,
  notionContactUrl,
  xUrl
} from '@/lib/site-identity'

export default function ContactPage() {
  return (
    <SiteInfoPage
      title='Contact'
      description='You can find me as @wustep on X, LinkedIn, or GitHub, or reach out to me via this contact form.'
      path='/contact'
    >
      <p>
        You can find me as @wustep on <a href={xUrl}>X</a>
        {', '}
        <a href={linkedinUrl}>LinkedIn</a>
        {', or '}
        <a href={githubUrl}>GitHub</a>
        {', or reach out to me via '}
        <a href={notionContactUrl} rel='noopener noreferrer'>
          this contact form
        </a>
        {'.'}
      </p>
      <SanFranciscoTime />
    </SiteInfoPage>
  )
}
