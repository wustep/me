import { SiteInfoPage } from '@/components/SiteInfoPage'
import { githubUrl, linkedinUrl, siteName, xUrl } from '@/lib/site-identity'

export default function PrivacyPage() {
  return (
    <SiteInfoPage
      title='Privacy'
      description={`${siteName}'s personal site: what is collected, what is not, and why this is not a data product.`}
      path='/privacy'
    >
      <p>
        wustep.me is a personal website. It is not a product, an account system,
        or a data business. There are no visitor logins, no marketing list
        collected from this domain, and nothing here is sold or rented as a
        dataset. If you found this page because an agent asked whether the site
        is legitimate, the short answer is: it is one person&apos;s public
        writing and projects.
      </p>
      <h2>What this site collects</h2>
      <p>
        The site is hosted on Vercel. Incoming requests can produce ordinary
        server and CDN logs — IP address, user agent, requested path, and a
        timestamp. Those logs exist so the host can keep the site up, debug
        errors, and absorb abuse. I do not run an advertising pixel and I do not
        sell visitor data.
      </p>
      <p>
        Vercel Analytics may record anonymous page views so I can see which
        notes people actually read. Traffic from my own owner-mode session is
        excluded. You can also opt out of Vercel Analytics in the usual ways
        (their <code>va-disable</code> flag, or blocking the analytics script).
      </p>
      <h2>Content on this site</h2>
      <p>
        Most writing is authored in Notion and published here because those
        pages are publicly shared. If a note is on wustep.me, treat it as
        public. Social-preview images are generated from that same public
        content. The playground experiments run in your browser; they do not
        create an account.
      </p>
      <h2>What I do not do</h2>
      <p>
        I do not keep a customer CRM. I do not use visitor data for credit,
        employment, or insurance decisions. If you write to me on{' '}
        <a href={xUrl}>X</a>, <a href={githubUrl}>GitHub</a>, or{' '}
        <a href={linkedinUrl}>LinkedIn</a>, that conversation lives on that
        network, under that network&apos;s rules. A leftover Notion contact form
        may still exist; anything typed there is subject to Notion&apos;s terms,
        not a separate database I operate.
      </p>
      <p>
        Questions about this page belong on the{' '}
        <a href='/contact'>contact page</a>.
      </p>
    </SiteInfoPage>
  )
}
