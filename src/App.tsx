import { useEffect, useRef, useState, type ReactNode } from 'react'

/* ============================================================================
   SIGNAL STUDIO - designer and developer portfolio
   Sections: nav, hero, projects, capabilities, about, writing, contact, footer
   Six content sections, so the micro-label budget is ceil(6 / 3) = 2.
   ========================================================================= */

/* Scroll reveal. IntersectionObserver only, disconnects after firing, and
   collapses to visible under prefers-reduced-motion. */
function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible')
          io.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

/* Each word gets its own mask and its own transition-delay, so the name
   arrives letter by letter instead of all at once. */
function KineticName({
  words,
  className = '',
}: {
  words: string[]
  className?: string
}) {
  return (
    <h1 className={`hero-name ${className}`}>
      <span className="block">
        {words.map((w, i) => (
          <span className="kw" key={`${w}-${i}`}>
            <span style={{ ['--kd' as string]: `${140 + i * 105}ms` }}>{w}</span>
          </span>
        ))}
      </span>
    </h1>
  )
}

/* Headings stack vertically. Never a split header. */
function SectionHead({
  kicker,
  title,
  body,
}: {
  kicker?: string
  title: string
  body?: string
}) {
  return (
    <div className="max-w-2xl">
      {kicker ? <p className="micro mb-5">{kicker}</p> : null}
      <h2 className="display display-md">{title}</h2>
      {body ? <p className="lede mt-6">{body}</p> : null}
    </div>
  )
}

/* Asymmetric grid: one wide 7-col tile, then a 5-col stack of two smaller
   tiles. Tile sizes differ on purpose, no equal thirds anywhere. */
const PROJECTS = [
  {
    client: 'Tolvmark',
    year: '2025',
    scope: 'Identity and booking flow for a six-site ceramics workshop',
    outcome: 'Course bookings moved to a two-step form. Off-season waitlist dropped from 214 to 38.',
    seed: 'signal-studio-craft-workbench-materials',
    w: 1400,
    h: 1050,
    alt: 'A stoneware mug steaming beside an open notebook in morning light',
    span: 'lg:col-span-7',
    ratio: 'aspect-4/3',
    size: '',
  },
  {
    client: 'Orbital Records',
    year: '2025',
    scope: 'Release system, archive, and player-side art direction',
    outcome: 'Back catalogue finally searchable. Median search-to-listen fell from 4m10s to 48s.',
    seed: 'signal-studio-studio-notebook-sketch-desk',
    w: 1200,
    h: 825,
    alt: 'An iMac, keyboard and tablet showing a calendar on a dark desk',
    span: 'lg:col-span-5',
    ratio: 'aspect-16/11',
    size: 'lg:mt-20',
  },
  {
    client: 'Marrow Coffee',
    year: '2024',
    scope: 'Storefront site and a wholesale order form for cafes',
    outcome: 'Cafes stopped phoning to reorder. Thirty-one accounts onboarded themselves in a quarter.',
    seed: 'signal-studio-window-seat-interior',
    w: 1800,
    h: 760,
    alt: 'A cup of filter coffee photographed from above on a cafe counter',
    span: 'lg:col-span-12',
    ratio: 'aspect-21/9',
    size: '',
  },
]

const CAPABILITIES = [
  {
    n: '01',
    title: 'Interface design',
    body: 'Screens designed in the browser at real sizes. I hand over files that already work, not frames that still need arguing about.',
  },
  {
    n: '02',
    title: 'Front-end build',
    body: 'React and TypeScript, shipped from my own repo to yours. Semantic markup, keyboard paths, and passes on an axe audit.',
  },
  {
    n: '03',
    title: 'Identity systems',
    body: 'Marks, type scales and a grid, with the print and screen rules written down so a new hire can extend it.',
  },
  {
    n: '04',
    title: 'Motion',
    body: 'Entrance and hover transitions with reduced-motion fallbacks. Every animation here has a state it degrades to.',
  },
  {
    n: '05',
    title: 'Performance passes',
    body: 'Core Web Vitals on real mid-range phones, measured in the field rather than on my laptop.',
  },
  {
    n: '06',
    title: 'Design systems',
    body: 'Tokens, primitives and documented states. Your team can ship the next feature without booking a call.',
  },
]

const WRITING = [
  {
    title: 'Your design system has no owner',
    where: 'Increment',
    read: '9 min',
    year: '2025',
  },
  {
    title: 'The 60fps trap and why I stopped chasing it',
    where: 'Self-published',
    read: '6 min',
    year: '2025',
  },
  {
    title: 'Interviewing users who already like your product',
    where: 'UX Weekly',
    read: '11 min',
    year: '2024',
  },
  {
    title: 'Pairing on your codebase, day rate, no handover',
    where: 'Self-published',
    read: '4 min',
    year: '2024',
  },
]

export default function App() {
  const [navOpen, setNavOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [brief, setBrief] = useState('')
  const [sent, setSent] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [briefError, setBriefError] = useState('')

  const links = [
    { label: 'Work', href: '#work' },
    { label: 'Capabilities', href: '#capabilities' },
    { label: 'About', href: '#about' },
    { label: 'Writing', href: '#writing' },
    { label: 'Contact', href: '#contact' },
  ]

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const cleanEmail = email.trim()
    const cleanBrief = brief.trim()
    const okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(cleanEmail)
    const okBrief = cleanBrief.length >= 12

    setEmailError(okEmail ? '' : 'Enter an email I can reply to.')
    setBriefError(okBrief ? '' : 'A sentence or two, so I know whether to reply.')
    if (!okEmail || !okBrief) return

    setSent(true)
    setEmail('')
    setBrief('')
  }

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-[var(--color-accent)] focus:px-4 focus:py-2 focus:text-[var(--color-canvas)]"
      >
        Skip to content
      </a>

      {/* ---------------------------------------------------------------- */}
      {/* NAV - one line at desktop, 68px                                  */}
      {/* ---------------------------------------------------------------- */}
      <header className="sticky top-0 z-40 border-b border-[var(--color-hairline)] bg-[var(--color-canvas)]/90 backdrop-blur-md">
        <div className="shell flex h-[68px] items-center justify-between">
          <a
            href="#top"
            className="font-display text-[1.0625rem] font-bold tracking-[-0.03em] text-[var(--color-ink)]"
          >
            Signal Studio
          </a>

          <nav className="hidden items-center gap-8 lg:flex">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-[0.875rem] font-medium text-[var(--color-body)] transition-colors hover:text-[var(--color-ink)]"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <a href="#contact" className="btn btn-primary hidden lg:inline-flex">
            Book a call
          </a>

          <button
            type="button"
            aria-label={navOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={navOpen}
            aria-controls="mobile-nav"
            onClick={() => setNavOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-[var(--radius-control)] border border-[var(--color-hairline)] text-[var(--color-ink)] lg:hidden"
          >
            <span className="flex w-4 flex-col gap-[4px]">
              <span
                className={`h-px w-full bg-[var(--color-ink)] transition-transform duration-200 ${
                  navOpen ? 'translate-y-[2.5px] rotate-45' : ''
                }`}
              />
              <span
                className={`h-px w-full bg-[var(--color-ink)] transition-transform duration-200 ${
                  navOpen ? '-translate-y-[2.5px] -rotate-45' : ''
                }`}
              />
            </span>
          </button>
        </div>

        {navOpen ? (
          <div id="mobile-nav" className="border-t border-[var(--color-hairline)] lg:hidden">
            <nav className="shell flex flex-col py-4">
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setNavOpen(false)}
                  className="border-b border-[var(--color-hairline)] py-3.5 text-[1rem] font-medium text-[var(--color-ink)] last:border-b-0"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setNavOpen(false)}
                className="btn btn-primary mt-5 w-full"
              >
                Book a call
              </a>
            </nav>
          </div>
        ) : null}
      </header>

      <main id="main">
        {/* -------------------------------------------------------------- */}
        {/* HERO - kinetic type, the name is the image. Max 4 text elements. */}
        {/* -------------------------------------------------------------- */}
        <section id="top" className="shell pt-16 pb-20 md:pt-24 md:pb-28">
          <p className="micro rise" style={{ ['--rd' as string]: '40ms' }}>
            Designer and developer, independent since 2022
          </p>

          <div className="mt-8 md:mt-10">
            <KineticName words={['Marian', 'Vance']} />
            <div className="rule-draw mt-6 h-[3px] w-full origin-left bg-[var(--color-accent)] md:mt-8" />
          </div>

          <p
            className="lede rise mt-8 max-w-[46ch]"
            style={{ ['--rd' as string]: '520ms' }}
          >
            I design and build sites for small teams with real deadlines. One
            person, from first sketch to shipped code.
          </p>

          <div
            className="rise mt-9 flex flex-wrap items-center gap-3"
            style={{ ['--rd' as string]: '640ms' }}
          >
            <a href="#work" className="btn btn-primary">
              See the work
            </a>
            <a href="#contact" className="btn btn-ghost">
              Start a project
            </a>
          </div>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* PROJECTS - asymmetric grid, mixed tile sizes, real imagery      */}
        {/* -------------------------------------------------------------- */}
        <section id="work" className="shell py-20 md:py-28">
          <Reveal>
            <SectionHead
              title="Recent projects"
              body="Three builds from 2024 and 2025, with the number each one moved."
            />
          </Reveal>

          <div className="mt-14 grid gap-6 lg:grid-cols-12 lg:gap-7">
            {PROJECTS.map((p, i) => (
              <Reveal key={p.client} delay={i * 90} className={`${p.span} ${p.size}`}>
                <article className="tile">
                  <div
                    className={
                      p.span === 'lg:col-span-12'
                        ? 'grid items-end gap-6 lg:grid-cols-12 lg:gap-8'
                        : ''
                    }
                  >
                    <div
                      className={`frame ${p.ratio} w-full ${
                        p.span === 'lg:col-span-12' ? 'lg:col-span-7' : ''
                      }`}
                    >
                      <img
                        src={`https://picsum.photos/seed/${p.seed}/${p.w}/${p.h}`}
                        alt={p.alt}
                        loading="lazy"
                        width={p.w}
                        height={p.h}
                      />
                    </div>

                    <div
                      className={
                        p.span === 'lg:col-span-12'
                          ? 'lg:col-span-5 lg:pb-1'
                          : 'mt-5'
                      }
                    >
                      <div className="flex items-baseline justify-between gap-5">
                        <h3 className="font-display text-[1.25rem] font-bold tracking-[-0.025em] text-[var(--color-ink)]">
                          {p.client}
                        </h3>
                        <span className="meta shrink-0">{p.year}</span>
                      </div>
                      <p className="mt-2 text-[0.9375rem] text-[var(--color-body)]">
                        {p.scope}
                      </p>
                      <p className="mt-3 max-w-[54ch] border-l-2 border-[var(--color-accent-deep)] pl-3.5 text-[0.9375rem] leading-relaxed text-[var(--color-ink)]">
                        {p.outcome}
                      </p>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* CAPABILITIES - horizontal scroll-snap pills                      */}
        {/* -------------------------------------------------------------- */}
        <section
          id="capabilities"
          className="border-y border-[var(--color-hairline)] py-20 md:py-28"
        >
          <div className="shell">
            <Reveal>
              <SectionHead
                kicker="Capabilities"
                title="Six things I take on"
                body="Six are listed here because they are all things I have done this year. Most projects need two or three."
              />
            </Reveal>
          </div>

          <Reveal className="mt-12">
            <div
              className="caps-track shell"
              tabIndex={0}
              role="group"
              aria-label="Capabilities, scroll sideways"
            >
              {CAPABILITIES.map((c) => (
                <article className="caps-pill group" key={c.n}>
                  <p className="font-mono text-[0.6875rem] tracking-[0.08em] text-[var(--color-accent)]">
                    {c.n}
                  </p>
                  <h3 className="font-display text-[1.3125rem] font-bold tracking-[-0.025em] text-[var(--color-ink)]">
                    {c.title}
                  </h3>
                  <p className="text-[0.9375rem] leading-relaxed text-[var(--color-body)]">
                    {c.body}
                  </p>
                  <span className="mt-auto h-[2px] w-10 bg-[var(--color-hairline)] transition-all duration-300 group-hover:w-16" />
                </article>
              ))}
            </div>
          </Reveal>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* ABOUT - portrait split, one of only two image-plus-text splits   */}
        {/* -------------------------------------------------------------- */}
        <section id="about" className="shell py-20 md:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-5">
              <div className="frame aspect-4/5 w-full">
                <img
                  src="https://picsum.photos/seed/signal-studio-person-soft-light/1100/1375"
                  alt="Marian Vance photographed through a rain-streaked studio window"
                  loading="lazy"
                  width={1100}
                  height={1375}
                />
              </div>
            </Reveal>

            <Reveal className="lg:col-span-7" delay={100}>
              <h2 className="display display-lg">
                Eight years in, still
                <br />
                the only pair of hands.
              </h2>
              <p className="lede mt-7">
                I started in editorial design, moved into product in 2020, and have
                been freelance since. That means no handoff, no account manager, and
                no week where the thing you approved is not the thing that ships.
              </p>
              <p className="lede mt-5">
                Before going solo I shipped checkout and search at Trolley. I still keep
                the browser matrix from that job on my wall, because most of the bugs I
                get sent started as somebody testing on one laptop.
              </p>

              <dl className="mt-10 grid gap-x-10 gap-y-7 sm:grid-cols-3">
                <div>
                  <dt className="meta">Based</dt>
                  <dd className="mt-2 font-display text-[1.0625rem] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">
                    Bristol, UK
                  </dd>
                </div>
                <div>
                  <dt className="meta">Available</dt>
                  <dd className="mt-2 font-display text-[1.0625rem] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">
                    Two slots, Q3
                  </dd>
                </div>
                <div>
                  <dt className="meta">Day rate</dt>
                  <dd className="mt-2 font-display text-[1.0625rem] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">
                    &pound;640, ex VAT
                  </dd>
                </div>
              </dl>
            </Reveal>
          </div>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* WRITING - list rows, four items, no rules on every single one   */}
        {/* -------------------------------------------------------------- */}
        <section id="writing" className="border-t border-[var(--color-hairline)] py-20 md:py-28">
          <div className="shell">
            <Reveal>
              <SectionHead
                title="Selected writing"
                body="Four pieces. The rest go out when they are finished."
              />
            </Reveal>

            <ul className="mt-12">
              {WRITING.map((w, i) => (
                <Reveal key={w.title} delay={i * 70}>
                  <li className="border-b border-[var(--color-hairline)] first:border-t">
                    <a
                      href="#writing"
                      className="writing-row group flex items-baseline gap-5 py-6 md:gap-8 md:py-7"
                    >
                      <span className="meta w-16 shrink-0 pt-1.5">{w.year}</span>
                      <span className="flex-1">
                        <span className="row-title block font-display text-[1.125rem] font-semibold tracking-[-0.025em] text-[var(--color-ink)] md:text-[1.25rem]">
                          {w.title}
                        </span>
                        <span className="mt-2 block text-[0.875rem] text-[var(--color-body)]">
                          {w.where}
                        </span>
                      </span>
                      <span className="meta shrink-0 pt-1.5">{w.read}</span>
                      <span className="shrink-0 pt-2 text-[var(--color-mute)]" aria-hidden="true">
                        <span className="chev" />
                      </span>
                    </a>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* CONTACT - label above input, inline errors, composed sent state */}
        {/* -------------------------------------------------------------- */}
        <section id="contact" className="shell py-20 md:py-28">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-5">
              <h2 className="display display-lg">
                Tell me what
                <br />
                is not working.
              </h2>
              <p className="lede mt-7">
                Send the problem rather than the brief. I read every message and reply
                within two working days, including when the answer is that you do not
                need me.
              </p>

              <dl className="mt-10 space-y-6">
                <div>
                  <dt className="meta">Email</dt>
                  <dd className="mt-2 text-[0.9375rem] text-[var(--color-ink)]">
                    hello@signalstudio.co.uk
                  </dd>
                </div>
                <div>
                  <dt className="meta">Calls</dt>
                  <dd className="mt-2 text-[0.9375rem] text-[var(--color-ink)]">
                    30 minutes, no slide deck, bring the broken page.
                  </dd>
                </div>
              </dl>
            </Reveal>

            <Reveal className="lg:col-span-7" delay={90}>
              {sent ? (
                <div className="border border-[var(--color-hairline)] bg-[var(--color-surface)] p-8 md:p-10">
                  <h3 className="font-display text-[1.5rem] font-bold tracking-[-0.03em] text-[var(--color-ink)]">
                    That came through.
                  </h3>
                  <p className="mt-4 max-w-[46ch] text-[0.9375rem] leading-relaxed text-[var(--color-body)]">
                    I reply within two working days. If it is urgent, the email above
                    reaches me faster than the form.
                  </p>
                  <button
                    type="button"
                    className="btn btn-ghost mt-7"
                    onClick={() => setSent(false)}
                  >
                    Send another
                  </button>
                </div>
              ) : (
                <form className="grid gap-6" onSubmit={onSubmit} noValidate>
                  <div className="grid gap-2">
                    <label
                      htmlFor="name"
                      className="text-[0.8125rem] font-semibold text-[var(--color-ink)]"
                    >
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      aria-describedby="name-hint"
                      className="field"
                    />
                    <p id="name-hint" className="text-[0.8125rem] text-[var(--color-mute)]">
                      Who to reply to.
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <label
                      htmlFor="email"
                      className="text-[0.8125rem] font-semibold text-[var(--color-ink)]"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      aria-describedby={emailError ? 'email-hint email-err' : 'email-hint'}
                      aria-invalid={emailError ? true : undefined}
                      className={`field ${emailError ? 'field-error' : ''}`}
                    />
                    {emailError ? (
                      <p id="email-err" className="text-[0.8125rem] text-[var(--color-accent)]">
                        {emailError}
                      </p>
                    ) : null}
                    <p id="email-hint" className="text-[0.8125rem] text-[var(--color-mute)]">
                      Only used to answer you.
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <label
                      htmlFor="brief"
                      className="text-[0.8125rem] font-semibold text-[var(--color-ink)]"
                    >
                      What are you making
                    </label>
                    <textarea
                      id="brief"
                      name="brief"
                      rows={5}
                      value={brief}
                      onChange={(e) => setBrief(e.target.value)}
                      aria-describedby={briefError ? 'brief-hint brief-err' : 'brief-hint'}
                      aria-invalid={briefError ? true : undefined}
                      className={`field resize-y ${briefError ? 'field-error' : ''}`}
                    />
                    {briefError ? (
                      <p id="brief-err" className="text-[0.8125rem] text-[var(--color-accent)]">
                        {briefError}
                      </p>
                    ) : null}
                    <p id="brief-hint" className="text-[0.8125rem] text-[var(--color-mute)]">
                      A few sentences is plenty. Deadlines and constraints help.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 pt-1">
                    <button type="submit" className="btn btn-primary">
                      Send brief
                    </button>
                    <p className="text-[0.8125rem] text-[var(--color-mute)]">
                      Replies within two working days.
                    </p>
                  </div>
                </form>
              )}
            </Reveal>
          </div>
        </section>
      </main>

      {/* ---------------------------------------------------------------- */}
      {/* FOOTER                                                          */}
      {/* ---------------------------------------------------------------- */}
      <footer className="border-t border-[var(--color-hairline)] py-10">
        <div className="shell flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <p className="text-[0.875rem] text-[var(--color-mute)]">
            Signal Studio, Bristol. Marian Vance, sole trader.
          </p>
          <nav className="flex flex-wrap gap-x-7 gap-y-2">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-[0.875rem] text-[var(--color-mute)] transition-colors hover:text-[var(--color-ink)]"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    </>
  )
}