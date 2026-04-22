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

    const greetingWords = siteConfig('GREETING_WORDS', '')
    return greetingWords
      .split(',')
      .map(word => word.trim())
      .filter(Boolean)
      .join('\n')
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
      <div className='text-white absolute inset-0 flex items-center justify-center w-full px-6 md:px-12 lg:px-20'>
        <div className='w-full max-w-7xl grid items-center gap-8 lg:gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]'>
          <div className='flex flex-col items-center text-center lg:items-start lg:text-left'>
            {/* 站点标题 */}
            <div className='font-black text-4xl md:text-5xl shadow-text'>
              {siteInfo?.title || siteConfig('TITLE')}
            </div>

            {/* 首页导航大按钮 */}
            {siteConfig('HEXO_HOME_NAV_BUTTONS', null, CONFIG) && (
              <NavButtonGroup {...props} />
            )}
          </div>

          {/* 站点欢迎语 */}
          <div className='w-full lg:flex lg:justify-end'>
            <div className='w-full max-w-2xl rounded-2xl border border-white/20 bg-black/20 p-6 md:p-8 backdrop-blur-sm text-left shadow-text'>
              <div className='mb-3 text-sm uppercase tracking-[0.35em] text-white/70'>
                Welcome
              </div>
              <div
                id='typed'
                className='min-h-[10rem] whitespace-pre-wrap break-words text-base font-medium leading-8 md:text-lg'
              />
            </div>
          </div>
        </div>

        {/* 滚动按钮 */}
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
