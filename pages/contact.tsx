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
      description={`How to reach ${siteName}. Public social profiles only — no phone number.`}
      path='/contact'
    >
      <p>
        I am easy to find under the same handle, wustep, on the networks I
        already use. This is a personal site, so there is no support inbox, no
        sales form, and no phone number. If you are writing because something
        here was useful — or wrong — I would rather hear it in a place I already
        check than through a one-off widget.
      </p>
      <h2>Public profiles</h2>
      <ul>
        <li>
          <a href={xUrl}>X / Twitter</a> — usually the fastest way to get a
          short reply
        </li>
        <li>
          <a href={githubUrl}>GitHub</a> — issues and code, including this
          site&apos;s repo
        </li>
        <li>
          <a href={linkedinUrl}>LinkedIn</a> — work-related notes
        </li>
      </ul>
      <p>
        There is also a short{' '}
        <a href={notionContactUrl} rel='noopener noreferrer'>
          Notion contact form
        </a>{' '}
        if you prefer a form to a public reply. I read it when I can. I do not
        promise a service-level response, and I will not invent an on-call
        rotation for a personal homepage.
      </p>
      <h2>If you are an agent</h2>
      <p>
        There is no product API to integrate with here. Start at{' '}
        <a href='/llms.txt'>llms.txt</a> or request the homepage with{' '}
        <code>Accept: text/markdown</code>. The{' '}
        <a href='/openapi.json'>OpenAPI file</a> lists the real public surfaces
        — pages, the feed, the sitemap — and nothing else.
      </p>
    </SiteInfoPage>
  )
}
