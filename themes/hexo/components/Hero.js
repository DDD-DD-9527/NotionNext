// import Image from 'next/image'
import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { loadExternalResource } from '@/lib/utils'
import { useEffect, useMemo, useRef } from 'react'
import CONFIG from '../config'
import NavButtonGroup from './NavButtonGroup'

let wrapperTop = 0

/**
 * 顶部全屏大图
 * @returns
 */
const Hero = props => {
  const typedRef = useRef(null)
  const { siteInfo } = props
  const { locale } = useGlobal()
  const scrollToWrapper = () => {
    window.scrollTo({ top: wrapperTop, behavior: 'smooth' })
  }

  const heroQuote = useMemo(() => {
    const longQuote = siteConfig('HERO_QUOTE', '')
    if (longQuote) {
      return longQuote.replace(/\\n/g, '\n').trim()
    }
    return (
      "That's here.\n" +
      "That's home.\n" +
      "That's us.\n\n" +
      'On it, everyone you love, everyone you know, everyone you ever heard of, every human being who ever was, lived out their lives.\n\n' +
      'The aggregate of our joy and suffering, thousands of confident religions, ideologies and economic doctrines,\n' +
      'every hunter and forager, every hero and coward, every creator and destroyer of civilization,\n' +
      'every king and peasant, every young couple in love, every mother and father, hopeful child,\n' +
      'inventor and explorer, every teacher of morals, every corrupt politician,\n' +
      'every superstar, every supreme leader, every saint and sinner in the history of our species,\n' +
      'lived there, on a mote of dust, suspended in a sunbeam.\n\n' +
      '— Carl Sagan, in Cosmos: A Spacetime Odyssey (S01E13) Unafraid of the Dark.'
    )
  }, [])

  useEffect(() => {
    updateHeaderHeight()
    window.addEventListener('resize', updateHeaderHeight)
    return () => {
      window.removeEventListener('resize', updateHeaderHeight)
    }
  }, [])

  useEffect(() => {
    const typedElement = document.getElementById('typed')
    if (!typedElement || !heroQuote) {
      return
    }

    typedElement.innerHTML = ''
    typedRef.current?.destroy()

    loadExternalResource('/js/typed.min.js', 'js').then(() => {
      if (window.Typed) {
        typedRef.current = new window.Typed('#typed', {
          strings: [heroQuote],
          typeSpeed: 45,
          startDelay: 300,
          showCursor: true,
          smartBackspace: false,
          backSpeed: 0,
          backDelay: 0,
          loop: false
        })
      }
    })

    return () => {
      typedRef.current?.destroy()
      typedRef.current = null
    }
  }, [heroQuote])

  function updateHeaderHeight() {
    requestAnimationFrame(() => {
      const wrapperElement = document.getElementById('wrapper')
      wrapperTop = wrapperElement?.offsetTop
    })
  }

  return (
    <header
      id='header'
      style={{ zIndex: 1 }}
      className='w-full h-screen relative bg-black'>
      <div className='text-white absolute inset-0 w-full'>
        <div className='absolute top-24 right-5 md:right-10 lg:right-16 w-[min(30rem,92vw)] max-w-xl'>
          <div className='rounded-2xl border border-white/15 bg-black/20 p-5 md:p-6 backdrop-blur-sm text-left shadow-text'>
            <div
              id='typed'
              className='min-h-[10rem] whitespace-pre-wrap break-words text-xs font-medium leading-6 md:text-sm'
            />
          </div>
        </div>

        <div className='absolute inset-0 flex flex-col h-full items-center justify-center w-full px-6 md:px-12 lg:px-20'>
          <div className='font-black text-4xl md:text-5xl shadow-text text-center'>
            {siteInfo?.title || siteConfig('TITLE')}
          </div>

          {siteConfig('HEXO_HOME_NAV_BUTTONS', null, CONFIG) && (
            <NavButtonGroup {...props} />
          )}
        </div>

        <div
          onClick={scrollToWrapper}
          className='z-10 cursor-pointer w-full text-center py-4 text-3xl absolute bottom-10 text-white'>
          <div className='opacity-70 animate-bounce text-xs'>
            {siteConfig('HEXO_SHOW_START_READING', null, CONFIG) &&
              locale.COMMON.START_READING}
          </div>
          <i className='opacity-70 animate-bounce fas fa-angle-down' />
        </div>
      </div>

      <LazyImage
        id='header-cover'
        alt={siteInfo?.title}
        src={siteInfo?.pageCover}
        className={`header-cover w-full h-screen object-cover object-center ${siteConfig('HEXO_HOME_NAV_BACKGROUND_IMG_FIXED', null, CONFIG) ? 'fixed' : ''}`}
      />
    </header>
  )
}

export default Hero
