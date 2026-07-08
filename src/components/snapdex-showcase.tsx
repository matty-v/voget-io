import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const TAGS = ['React', 'TypeScript', 'AI vision', 'Firebase']

const SHOTS = [
  { src: '/snapdex-dex.jpg', alt: 'A Snapdex species entry for a Moose, with an AI-written field-guide description, region, and discovery date' },
  { src: '/snapdex-profile.jpg', alt: 'A Snapdex profile showing level, XP, capture stats, and AI-named achievement badges' },
]

export function SnapdexShowcase() {
  return (
    <div className="snap">
      <div className="snap-copy">
        <p className="snap-lede">
          A Pok&eacute;dex for the real world. Snap a photo of any animal and Snapdex identifies the species, writes it
          a field-guide entry, and adds it to your collection &mdash; with levels, regions, and a wry AI-written
          chronicle of your naturalist career. Every feature was designed, built, reviewed, and shipped end-to-end by
          the Falcon Dev Team.
        </p>
        <div className="snap-tags">
          {TAGS.map((t) => (
            <span key={t} className="tech-badge px-2 py-1 rounded-md text-xs">
              {t}
            </span>
          ))}
        </div>
        <Button
          asChild
          className="bg-[var(--accent-purple)] hover:bg-[var(--accent-purple)]/80 text-black font-medium mt-2"
        >
          <a href="mailto:matt.voget@gmail.com?subject=Snapdex%20invite%20request">
            Request a Snapdex invite
            <ArrowRight className="h-4 w-4" />
          </a>
        </Button>
      </div>

      <div className="snap-shots">
        {SHOTS.map((s) => (
          <figure key={s.src} className="snap-frame">
            <div className="snap-frame-bar" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
            <img src={s.src} alt={s.alt} loading="lazy" className="snap-img" />
          </figure>
        ))}
      </div>
    </div>
  )
}
