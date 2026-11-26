import { SiteInfoPage } from '@/components/SiteInfoPage'

export default function PrivacyPage() {
  return (
    <SiteInfoPage
      title='Privacy'
      description="This is a personal site. There are no accounts, no cookies beyond hosting defaults, and I don't sell data."
      path='/privacy'
    >
      <p>
        This is a personal site. There are no accounts, no cookies beyond
        hosting defaults, and I don&rsquo;t sell data.
      </p>
      <p>
        It&rsquo;s hosted on Vercel, which keeps normal server logs (IP, path,
        timestamp). I may use Vercel Analytics for anonymous page-view counts.
        You can block that with their <code>va-disable</code> flag.
      </p>
      <p>
        Writing comes from public Notion pages. If it&rsquo;s on wustep.me,
        it&rsquo;s public. Playground experiments run in your browser.
      </p>
      <p>
        Questions? See <a href='/contact'>contact</a>.
      </p>
    </SiteInfoPage>
  )
}
