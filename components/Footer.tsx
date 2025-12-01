import * as React from 'react'

import * as config from '@/lib/config'

import {
  GithubIcon,
  LinkedinIcon,
  MastodonIcon,
  NewsletterIcon,
  XIcon,
  YoutubeIcon,
  ZhihuIcon
} from '../icons/SocialIcons'
import styles from './styles.module.css'

// TODO: merge the data and icons from PageSocial with the social links in Footer

export function FooterImpl() {
  const currentYear = new Date().getFullYear()

  // @wustep: Remove dark mode button.
  // const [hasMounted, setHasMounted] = React.useState(false)
  // const { isDarkMode, toggleDarkMode } = useDarkMode()
  // const onToggleDarkMode = React.useCallback(
  //   (e: any) => {
  //     e.preventDefault()
  //     toggleDarkMode()
  //   },
  //   [toggleDarkMode]
  // )
  // React.useEffect(() => {
  //   setHasMounted(true)
  // }, [])

  return (
    <footer className={styles.footer}>
      <div className={styles.copyright}>
        Copyright {currentYear} {config.author}
      </div>
      {/* 
      <div className={styles.settings}>
        {hasMounted && (
          <a
            className={styles.toggleDarkMode}
            href='#'
            role='button'
            onClick={onToggleDarkMode}
            title='Toggle dark mode'
          >
            {isDarkMode ? <IoMoonSharp /> : <IoSunnyOutline />}
          </a>
        )}
      </div> */}

      <div className={styles.social}>
        {config.x && (
          <a
            className={styles.twitter}
            href={`https://x.com/${config.x}`}
            title={`X @${config.x}`}
            target='_blank'
            rel='noopener noreferrer'
          >
            <XIcon />
          </a>
        )}

        {config.mastodon && (
          <a
            className={styles.mastodon}
            href={config.mastodon}
            title={`Mastodon ${config.getMastodonHandle()}`}
            rel='me'
          >
            <MastodonIcon />
          </a>
        )}

        {config.zhihu && (
          <a
            className={styles.zhihu}
            href={`https://zhihu.com/people/${config.zhihu}`}
            title={`Zhihu @${config.zhihu}`}
            target='_blank'
            rel='noopener noreferrer'
          >
            <ZhihuIcon />
          </a>
        )}

        {config.github && (
          <a
            className={styles.github}
            href={`https://github.com/${config.github}`}
            title={`GitHub @${config.github}`}
            target='_blank'
            rel='noopener noreferrer'
          >
            <GithubIcon />
          </a>
        )}

        {config.linkedin && (
          <a
            className={styles.linkedin}
            href={`https://www.linkedin.com/in/${config.linkedin}`}
            title={`LinkedIn ${config.author}`}
            target='_blank'
            rel='noopener noreferrer'
          >
            <LinkedinIcon />
          </a>
        )}

        {config.newsletter && (
          <a
            className={styles.newsletter}
            href={`${config.newsletter}`}
            title={`Newsletter ${config.author}`}
            target='_blank'
            rel='noopener noreferrer'
          >
            <NewsletterIcon />
          </a>
        )}

        {config.youtube && (
          <a
            className={styles.youtube}
            href={`https://www.youtube.com/${config.youtube}`}
            title={`YouTube ${config.author}`}
            target='_blank'
            rel='noopener noreferrer'
          >
            <YoutubeIcon />
          </a>
        )}
      </div>
    </footer>
  )
}

export const Footer = React.memo(FooterImpl)
