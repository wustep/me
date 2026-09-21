import type { InboxItem } from './types'
import { item } from './gmail'

/**
 * Fictional inbox. Schema is Gmail `users.messages`; people, brands, and
 * bodies are made up. ~18 notes spanning promotions, pledges, recruiting,
 * citations, newsletters, receipts, security, and real-person mail.
 */
export const INBOX_SEED: InboxItem[] = [
  item(
    {
      id: '18f0a1b2c3d4e5f6',
      from: 'Deals <noreply@shop.example>',
      subject: 'Your weekend flash sale starts now',
      date: '2026-09-21T17:00:00Z',
      labels: ['INBOX', 'UNREAD', 'CATEGORY_PROMOTIONS'],
      extraHeaders: [
        {
          name: 'List-Unsubscribe',
          value: '<mailto:unsub@shop.example>, <https://shop.example/unsub>'
        },
        { name: 'List-Id', value: 'deals.shop.example' }
      ],
      body: `Flash sale — 40% off everything this weekend only. Shop now before the cart expires.

Use code WEEKEND40 at checkout. This message was sent to you@example.com because you bought socks once in 2023.`
    },
    { promotional: 0.96, newsletter: 0.22, spam: 0.08, someday: 0.12 }
  ),
  item(
    {
      id: '18f0b7c8d9e0a1b2',
      from: 'KeepPromise <bot@keeppromise.example>',
      subject: 'You pledged 200 words today',
      date: '2026-09-21T14:05:00Z',
      labels: ['INBOX', 'UNREAD', 'IMPORTANT', 'CATEGORY_UPDATES'],
      extraHeaders: [{ name: 'X-KeepPromise-Goal', value: 'write-daily' }],
      body: `Hey. You told us you'd write 200 words by 5pm, and the pledge is still at 0.

Reply DONE if you already did it. Reply SKIP and we take $5. The graph is getting a little sarcastic.`
    },
    { reminder: 0.94, person: 0.08, someday: 0.1 }
  ),
  item(
    {
      id: '18f0c3d4e5f6a7b8',
      from: 'Jordan Vale <jordan.vale@northwind.example>',
      subject: 'Founding engineer role at Northwind',
      date: '2026-09-20T19:41:00Z',
      labels: ['INBOX', 'UNREAD', 'CATEGORY_PERSONAL'],
      body: `Hi — I lead product at Northwind (12 people, Oakland). We're hiring a founding-ish engineer to own the workflow engine.

I read the StageBench writeup and thought you'd have opinions about evals. 20 minutes this week? Completely fine if not.`
    },
    { recruiting: 0.92, person: 0.55, someday: 0.18 }
  ),
  item(
    {
      id: '18f0d5e6f7a8b9c0',
      from: 'Harbor City Citations <citations@harborcity.example>',
      subject: 'Notice of parking citation #48219',
      date: '2026-09-20T16:12:00Z',
      labels: ['INBOX', 'UNREAD', 'CATEGORY_UPDATES'],
      extraHeaders: [{ name: 'X-Citation-Id', value: '48219' }],
      body: `A citation was issued to plate 8JEV101 at 14:04 near 14th & Broadway.

Amount due: $78. Pay by Oct 4 to avoid a late fee. This is not a real ticket — Harbor City does not exist — but the shape is the usual one.`
    },
    { receipt: 0.7, reminder: 0.62, person: 0.04 }
  ),
  item(
    {
      id: '18f0e7f8a9b0c1d2',
      from: 'The Weekly Widget <editor@widgetweekly.example>',
      subject: 'Widgets #241: the case for fewer dashboards',
      date: '2026-09-20T13:00:00Z',
      labels: ['INBOX', 'CATEGORY_PROMOTIONS', 'UNREAD'],
      extraHeaders: [
        {
          name: 'List-Unsubscribe',
          value: '<mailto:unsub@widgetweekly.example>'
        },
        { name: 'List-Id', value: 'weekly.widgetweekly.example' }
      ],
      body: `This week: why your third dashboard is a cry for help, a short interview with someone who deleted Notion, and four links.

You're getting this because you subscribed in 2021 and have never opened issue 180 through 240. We noticed. We're not mad.`
    },
    { newsletter: 0.93, promotional: 0.28, someday: 0.4 }
  ),
  item(
    {
      id: '18f0f9a0b1c2d3e4',
      from: 'Priya Raman <priya.raman@mailbox.example>',
      subject: 'this dumpling place is 40% off tonight',
      date: '2026-09-21T01:18:00Z',
      labels: ['INBOX', 'UNREAD', 'IMPORTANT', 'CATEGORY_PERSONAL'],
      extraHeaders: [
        {
          name: 'X-Forwarded-For-Subject',
          value: 'Your weekend flash sale starts now'
        }
      ],
      body: `ok I know this is a promo email but the pork-chive ones are actually good and they're doing the flash-sale thing until 9.

I'm around 7:30 if you want to just go. No agenda. If you're buried, ignore me — I'll eat them all.`
    },
    { person: 0.88, promotional: 0.62, reminder: 0.22 }
  ),
  item(
    {
      id: '18f101a2b3c4d5e6',
      from: 'Accounts <no-reply@accounts.example>',
      subject: 'New sign-in on Chrome · Oakland, CA',
      date: '2026-09-21T09:04:00Z',
      labels: ['INBOX', 'UNREAD', 'IMPORTANT', 'CATEGORY_UPDATES'],
      extraHeaders: [{ name: 'X-Account-Alert', value: 'new-signin' }],
      body: `We noticed a new sign-in to your account.

Device: Chrome on macOS
Location: Oakland, CA (approx.)
Time: Sep 21, 2026, 2:04 AM PT

If this was you, you can ignore this. If it wasn't, reset the password from the account page. We will never ask you to wire money.`
    },
    { security: 0.97, reminder: 0.18, person: 0.02 }
  ),
  item(
    {
      id: '18f112b3c4d5e6f7',
      from: 'Rides <receipts@ridehail.example>',
      subject: 'Your trip Sunday morning',
      date: '2026-09-20T18:22:00Z',
      labels: ['INBOX', 'CATEGORY_UPDATES'],
      extraHeaders: [{ name: 'X-Receipt-Id', value: 'rid_9f3a' }],
      body: `Thanks for riding.

Sunday 11:14 AM
West Oakland → Temescal
$18.40 · Visa 4242

This is your receipt. Reply to this email and a confused bot will apologize.`
    },
    { receipt: 0.95, promotional: 0.06, someday: 0.15 }
  ),
  item(
    {
      id: '18f123c4d5e6f7a8',
      from: 'LoopedIn <notify@looped-in.example>',
      subject: 'You appeared in 12 searches this week',
      date: '2026-09-19T16:00:00Z',
      labels: ['INBOX', 'UNREAD', 'CATEGORY_SOCIAL'],
      extraHeaders: [
        {
          name: 'List-Unsubscribe',
          value: '<https://looped-in.example/unsub>'
        },
        { name: 'List-Id', value: 'notify.looped-in.example' }
      ],
      body: `People are looking at your profile. 12 searches, 3 profile views, 1 recruiter who will not rest.

Add a headline so the next twelve have something to misquote. Or don't. This email will return next Monday either way.`
    },
    { promotional: 0.7, newsletter: 0.45, recruiting: 0.25, someday: 0.2 }
  ),
  item(
    {
      id: '18f134d5e6f7a8b9',
      from: 'Forge <noreply@forge.example>',
      subject: '[acme/widgets] 3 Dependabot alerts',
      date: '2026-09-21T11:47:00Z',
      labels: ['INBOX', 'UNREAD', 'CATEGORY_UPDATES'],
      extraHeaders: [{ name: 'X-Forge-Repo', value: 'acme/widgets' }],
      body: `Dependabot found 3 new alerts on acme/widgets.

1. lodash (moderate) — prototype pollution in a path you don't call
2. next (low) — image optimizer
3. left-pad (critical) — it's 2016 again

Review in the security tab. This is not a real repo.`
    },
    { reminder: 0.48, security: 0.42, receipt: 0.18, someday: 0.22 }
  ),
  item(
    {
      id: '18f145e6f7a8b9c0',
      from: 'Calendar <calendar@mail.example>',
      subject: 'Reminder: dentist tomorrow 9:00 AM',
      date: '2026-09-21T15:00:00Z',
      labels: ['INBOX', 'UNREAD', 'IMPORTANT', 'CATEGORY_UPDATES'],
      extraHeaders: [
        {
          name: 'Content-Class',
          value: 'urn:content-classes:calendarmessage'
        }
      ],
      body: `Tomorrow · 9:00–9:40 AM
Dr. Ellen Park — cleaning
1919 Telegraph, suite 210

Reply with a note if you need to move it. Bring the night guard you keep meaning to.`
    },
    { reminder: 0.96, receipt: 0.12, person: 0.06 }
  ),
  item(
    {
      id: '18f156f7a8b9c0d1',
      from: 'Trail Kit <hello@trailkit.example>',
      subject: 'We miss you — 20% off your next kit',
      date: '2026-09-18T17:30:00Z',
      labels: ['INBOX', 'CATEGORY_PROMOTIONS'],
      extraHeaders: [
        {
          name: 'List-Unsubscribe',
          value: '<https://trailkit.example/unsub>'
        },
        { name: 'List-Id', value: 'hello.trailkit.example' }
      ],
      body: `It's been 211 days since your last order. The merino socks forgive you. The merino socks also expire from the warehouse in a metaphorical sense.

Code COMEBACK20. Expires Sunday. If you already have socks, this email is not for you, and yet here it is.`
    },
    { promotional: 0.94, newsletter: 0.18, someday: 0.14, spam: 0.05 }
  ),
  item(
    {
      id: '18f167a8b9c0d1e2',
      from: 'Leaf Reader <digest@leafreader.example>',
      subject: 'Your highlights this month (12)',
      date: '2026-09-19T12:00:00Z',
      labels: ['INBOX', 'CATEGORY_UPDATES'],
      extraHeaders: [
        { name: 'List-Unsubscribe', value: '<mailto:unsub@leafreader.example>' }
      ],
      body: `Twelve passages you marked in September, including three from the same chapter of the same book, which is a kind of honesty.

1. "The trick is to leave the inbox alone."
2. "Calibrated uncertainty is still uncertainty."
3. "Buy fewer jackets."

Might be nice to reread on a train. Might also be a list you never open.`
    },
    { someday: 0.86, newsletter: 0.48, promotional: 0.1 }
  ),
  item(
    {
      id: '18f178b9c0d1e2f3',
      from: 'Samel Ortega <samel.ortega@mailbox.example>',
      subject: 'notes from the hike',
      date: '2026-09-20T03:11:00Z',
      labels: ['INBOX', 'UNREAD', 'CATEGORY_PERSONAL', 'IMPORTANT'],
      body: `made it back, knees only slightly theatrical.

the fire road past the second gate is closed so we took the creek trail. I put the photos in the shared album — the one of the fog sitting in the valley like it pays rent is the keeper.

thursday still good for dumplings or did Priya already claim you?`
    },
    { person: 0.97, reminder: 0.18, promotional: 0.02 }
  ),
  item(
    {
      id: '18f189c0d1e2f3a4',
      from: 'Amina Sol <amina@lumenlabs.example>',
      subject: 'quick chat about a founding engineer seat?',
      date: '2026-09-19T21:05:00Z',
      labels: ['INBOX', 'UNREAD', 'CATEGORY_PERSONAL'],
      body: `Hi — I'm Amina, cofounder at Lumen Labs (we do on-device eval, very early).

We're looking for someone who cares about the boring parts of judgment: calibration, not chat. No deck attached on purpose. Coffee in Temescal, 25 minutes, you can leave after ten.`
    },
    { recruiting: 0.9, person: 0.68, someday: 0.2 }
  ),
  item(
    {
      id: '18f19ad1e2f3a4b5',
      from: 'Prize Bureau <winner@prize-alert.example>',
      subject: 'URGENT: confirm wire to release your award',
      date: '2026-09-21T06:33:00Z',
      labels: ['INBOX', 'UNREAD', 'SPAM', 'CATEGORY_PROMOTIONS'],
      extraHeaders: [
        { name: 'X-Spam-Flag', value: 'YES' },
        { name: 'X-Spam-Score', value: '9.4' }
      ],
      body: `CONGRATULATION you have been selected as a WINNER of the 2026 Harbor Grant.

To release $48,000 kindly confirm by wiring a processing fee of $790 to the bureau account below. Reply with your full SSN and a photo of a utility bill.

This is not how grants work.`
    },
    { spam: 0.99, promotional: 0.35, security: 0.22, person: 0 }
  ),
  item(
    {
      id: '18f1abe2f3a4b5c6',
      from: 'Harbor Power <billing@harborpower.example>',
      subject: 'Your September bill is ready',
      date: '2026-09-18T20:00:00Z',
      labels: ['INBOX', 'CATEGORY_UPDATES'],
      extraHeaders: [{ name: 'X-Account-Number', value: 'HP-44019' }],
      body: `September statement for 14th St.

Amount due: $64.18 by Oct 12
Usage: 186 kWh (you opened a window, apparently)

Pay at harborpower.example/pay. Paperless is already on. This is a fictional utility.`
    },
    { receipt: 0.93, reminder: 0.4, promotional: 0.05 }
  ),
  item(
    {
      id: '18f1bcf3a4b5c6d7',
      from: 'Batch Notes <hello@batchnotes.example>',
      subject: 'Batch Notes #88 — small models, large opinions',
      date: '2026-09-17T15:20:00Z',
      labels: ['INBOX', 'CATEGORY_PROMOTIONS'],
      extraHeaders: [
        {
          name: 'List-Unsubscribe',
          value: '<mailto:unsub@batchnotes.example>'
        },
        { name: 'List-Id', value: 'hello.batchnotes.example' }
      ],
      body: `Issue 88: System One models that return probabilities instead of paragraphs, a link dump, and a cartoon of a very confident raccoon.

You're on the free list. We will not be offended if you leave it there, unread, as a personality trait.`
    },
    { newsletter: 0.9, someday: 0.55, promotional: 0.22 }
  )
]

export function cloneInbox(items: InboxItem[] = INBOX_SEED): InboxItem[] {
  return items.map((entry) => ({
    message: entry.message,
    reasons: { ...entry.reasons }
  }))
}
