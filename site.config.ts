import { siteConfig } from './lib/site-config'

export default siteConfig({
  // the site's root Notion page (required)
  rootNotionPageId: '2bc5cb08cf2c8036a1e3cddcb2c61d97',

  // optional block ids for the special "Posts" toggle switcher
  // that lets you swap between Gallery and List views
  homePostsHeadingBlockId: '2bc5cb08cf2c8139a85ee9e88503d31d',
  homeGalleryBlockId: '2bc5cb08cf2c8171a909000cdc0067ca',
  homeListBlockIds: [
    '2bc5cb08cf2c817fa359c0f598dca6c3',
    '2bc5cb08cf2c81ad8323f21e6a64ec22',
    '2bc5cb08cf2c8126802dff95486eaaba',
    '2bc5cb08cf2c81d7b0edcf5beeb49783',
    '2bc5cb08cf2c810ea3a4d86a0c5a30b9',
    '2bc5cb08cf2c81ffa978c6d237f6b18d',
    '2bc5cb08cf2c8190b3a0f1b33c3c913f',
    '2bc5cb08cf2c812a9cf6db90ec304208',
  ],

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
  x: 'wustep',
  github: 'wustep',
  linkedin: 'wustep',
  // mastodon: '#', // optional mastodon profile URL, provides link verification
  // newsletter: '#', // optional newsletter URL
  // youtube: '#', // optional youtube channel name or `channel/UCGbXXXXXXXXXXXXXXXXXXXXXX`

  // default notion icon and cover images for site-wide consistency (optional)
  // page-specific values will override these site-wide defaults
  defaultPageIcon: 'https://wustep.me/wustep.png',
  defaultPageCover: null,
  defaultPageCoverPosition: 0.5,

  // whether or not to enable support for LQIP preview images (optional)
  isPreviewImageSupportEnabled: true,

  // whether or not redis is enabled for caching generated preview images (optional)
  // NOTE: if you enable redis, you need to set the `REDIS_HOST` and `REDIS_PASSWORD`
  // environment variables. see the readme for more info
  isRedisEnabled: false,

  // (2024-11-18) disable search for now because it is not working.
  isSearchEnabled: false,

  // Giscus comments configuration (optional)
  // giscus: {
  //   repo: 'wustep/me',
  //   repoId: 'R_kgDOId_ODg',
  //   category: 'Posts',
  //   categoryId: 'DIC_kwDOId_ODs4CUre0',
  //   mapping: 'pathname',
  //   strict: '1',
  //   reactionsEnabled: '0',
  //   emitMetadata: '0',
  //   inputPosition: 'top',
  //   lang: 'en',
  //   loading: 'lazy'
  // },

  // map of notion page IDs to URL paths (optional)
  // any pages defined here will override their default URL paths
  //
  pageUrlOverrides: {
    '/articles': 'e40efc6731ea4e1da2626d709950fbe4',
    '/notes': 'a9d2669020314160b70110639617e822',
    '/projects': '511994667bac45fda9fd8f9db136e476',
    '/essays': '8e54226891a6450a8192ea5f8611a214'
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
