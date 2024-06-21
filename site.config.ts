import { siteConfig } from './lib/site-config'

export default siteConfig({
  // the site's root Notion page (required)
  rootNotionPageId: '832654cbd40b4ee39ef92f6c5f268c70',

  // if you want to restrict pages to a single notion workspace (optional)
  // (this should be a Notion ID; see the docs for how to extract this)
  rootNotionSpaceId: '30725683-e071-41f1-988d-e6e6fa72abd8',

  // basic site info (required)
  name: 'Stephen Wu',
  domain: 'wustep.me',
  author: 'Stephen Wu',

  // open graph metadata (optional)
  description: 'Software Engineer, San Francisco, CA',

  // social usernames (optional)
  // twitter: 'transitive_bs',
  github: 'wustep',
  linkedin: 'wustep',
  // mastodon: '#', // optional mastodon profile URL, provides link verification
  // newsletter: '#', // optional newsletter URL
  // youtube: '#', // optional youtube channel name or `channel/UCGbXXXXXXXXXXXXXXXXXXXXXX`

  // default notion icon and cover images for site-wide consistency (optional)
  // page-specific values will override these site-wide defaults
  defaultPageIcon: null,
  defaultPageCover: null,
  defaultPageCoverPosition: 0.5,

  // whether or not to enable support for LQIP preview images (optional)
  isPreviewImageSupportEnabled: true,

  // whether or not redis is enabled for caching generated preview images (optional)
  // NOTE: if you enable redis, you need to set the `REDIS_HOST` and `REDIS_PASSWORD`
  // environment variables. see the readme for more info
  isRedisEnabled: false,

  // map of notion page IDs to URL paths (optional)
  // any pages defined here will override their default URL paths
  //
  pageUrlOverrides: {
    '/articles': 'e40efc67-31ea-4e1d-a262-6d709950fbe4',
    '/notes': 'a9d2669020314160b70110639617e822',
    '/projects': '511994667bac45fda9fd8f9db136e476',
    '/list': 'e597502d2cc241d98039291052e916fe'
  },

  // whether to use the default notion navigation style or a custom one with links to
  // important pages
  // navigationStyle: 'default'
  navigationStyle: 'custom',
  navigationLinks: [
    // {
    //   title: 'Articles',
    //   pageId: 'e40efc67-31ea-4e1d-a262-6d709950fbe4'
    // },
    // {
    //   title: 'Notes',
    //   pageId: 'a9d2669020314160b70110639617e822'
    // },
    // {
    //   title: 'Projects',
    //   pageId: '511994667bac45fda9fd8f9db136e476'
    // }
  ]
})
