import { useEffect, useId, useState } from 'react'
import styles from './snapdex-showcase.module.css'

type Shot = { src: string; alt: string }
type Caption = { lead: string; rest: string }

const SHOTS: Shot[] = [
  {
    src: '/snapdex-dex.jpg',
    alt: 'Snapdex species entry: a Moose (Alces alces) field-guide card with photo, description, region, and discovery date',
  },
  {
    src: '/snapdex-grid.jpg',
    alt: 'Snapdex dex grid: a gallery of identified species cards — birds and mammals with photo, name, and Latin name',
  },
  {
    src: '/snapdex-profile.jpg',
    alt: 'Snapdex player profile: level 8 Wild-Walker, XP bar, catalog stats, and a row of AI-named badges',
  },
  {
    src: '/snapdex-badge.jpg',
    alt: 'Snapdex badge detail: Trash Panda Supreme, earned for documenting a raccoon',
  },
]

const CAPS: Caption[] = [
  { lead: 'Capture → identify.', rest: 'Snap an animal; the AI names the species and writes its field-guide entry.' },
  { lead: 'Your dex fills up.', rest: 'Every catch becomes a card — birds and mammals, ID’d and catalogued.' },
  { lead: 'Level up & collect.', rest: 'XP, catalog stats, and AI-named badges for every find.' },
  { lead: 'Every badge is AI-written', rest: '— “a masked felon raiding a garbage can at 3am. The audacity.”' },
]

const AUTOPLAY_MS = 5000

/** Snapdex dex-scanner brand mark: a red dex device with a scanner-eye, status lights, and a lit screen. */
function DexScannerLogo({ className, idPrefix }: { className?: string; idPrefix: string }) {
  const bodyId = `${idPrefix}-body`
  const lensId = `${idPrefix}-lens`
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="15 15 90 90" role="img" aria-label="Snapdex" className={className}>
      <defs>
        <linearGradient id={bodyId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f0484d" />
          <stop offset="1" stopColor="#a8181e" />
        </linearGradient>
        <radialGradient id={lensId} cx="0.34" cy="0.30" r="0.85">
          <stop offset="0" stopColor="#d3f0ff" />
          <stop offset="0.4" stopColor="#3aa0e0" />
          <stop offset="1" stopColor="#123f66" />
        </radialGradient>
      </defs>
      <rect x="26" y="20" width="68" height="80" rx="14" fill={`url(#${bodyId})`} stroke="#14110f" strokeWidth="5.5" strokeLinejoin="round" />
      <circle cx="45" cy="41" r="9.5" fill={`url(#${lensId})`} />
      <circle cx="45" cy="41" r="9.5" fill="none" stroke="#14110f" strokeWidth="4" />
      <circle cx="41.5" cy="37.5" r="2.6" fill="#ffffff" />
      <circle cx="66" cy="38" r="3.3" fill="#54c06a" stroke="#14110f" strokeWidth="1.4" />
      <circle cx="77" cy="38" r="3.3" fill="#f0b93a" stroke="#14110f" strokeWidth="1.4" />
      <rect x="38" y="60" width="44" height="30" rx="6" fill="#12212b" />
      <rect x="38" y="60" width="44" height="30" rx="6" fill="none" stroke="#14110f" strokeWidth="5.5" strokeLinejoin="round" />
      <line x1="45" y1="72" x2="75" y2="72" stroke="#bfe9ff" strokeWidth="3.4" strokeLinecap="round" />
      <line x1="45" y1="82" x2="68" y2="82" stroke="#bfe9ff" strokeWidth="3.4" strokeLinecap="round" />
    </svg>
  )
}

export function SnapdexShowcase() {
  const [index, setIndex] = useState(0)
  const uid = useId()

  // Autoplay: advance one slide every 5s. Restarts whenever `index` changes —
  // including manual prev/next/dot navigation — so a manual interaction gets
  // a fresh 5s window before the next auto-advance, matching the mockup's
  // reset()-on-interaction behavior. Off entirely under reduced-motion.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % SHOTS.length)
    }, AUTOPLAY_MS)
    return () => clearInterval(timer)
  }, [index])

  const go = (next: number) => setIndex((next + SHOTS.length) % SHOTS.length)
  const caption = CAPS[index]

  return (
    <div className={styles.snap}>
      <p className={styles.eyebrow}>My Work · 03</p>
      <h2 className={styles.heading}>
        <DexScannerLogo className={styles.logo} idPrefix={`${uid}-heading`} />
        <span>
          <span className={styles.name}>Snapdex</span> — a Pokédex for the real world
        </span>
      </h2>
      <p className={styles.lede}>
        Snap a photo of any wild animal and an AI identifies the species, writes its field-guide entry, and drops it
        in your dex. Level up, track your catalog, and collect witty AI-named badges for everything you find.
      </p>

      <div className={styles.claim}>
        <div className={styles.claimBig}>
          Built <b className={styles.claimHi}>entirely by the Falcon Dev Team</b> — every feature, specced, coded,
          reviewed, and shipped by the autonomous agents.
        </div>
      </div>

      <div className={styles.carousel}>
        <div className={styles.frame}>
          <div className={styles.bar} aria-hidden="true">
            <i />
            <i />
            <i />
            <span className={styles.url}>snapdex.ai</span>
            <span className={styles.built}>shipped by falcon</span>
          </div>
          <div className={styles.stage}>
            <button
              type="button"
              className={`${styles.nav} ${styles.navPrev}`}
              aria-label="Previous screenshot"
              onClick={() => go(index - 1)}
            >
              ‹
            </button>
            <button
              type="button"
              className={`${styles.nav} ${styles.navNext}`}
              aria-label="Next screenshot"
              onClick={() => go(index + 1)}
            >
              ›
            </button>
            <div className={styles.slides} style={{ transform: `translateX(-${index * 100}%)` }}>
              {SHOTS.map((shot) => (
                <div className={styles.slide} key={shot.src}>
                  <img src={shot.src} alt={shot.alt} loading="lazy" className={styles.slideImage} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.cap}>
          <div className={styles.caption}>
            <b className={styles.captionLead}>{caption.lead}</b> {caption.rest}
          </div>
          <div className={styles.dots}>
            {SHOTS.map((shot, i) => (
              <button
                key={shot.src}
                type="button"
                className={styles.dot}
                aria-label={`Screenshot ${i + 1}`}
                aria-current={i === index}
                onClick={() => go(i)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className={styles.ctaRow}>
        <a className={styles.cta} href="https://snapdex.ai" target="_blank" rel="noopener">
          <DexScannerLogo className={styles.ctaIcon} idPrefix={`${uid}-cta`} />
          Visit snapdex.ai →
        </a>
      </div>
    </div>
  )
}
