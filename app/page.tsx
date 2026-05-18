import Link from "next/link";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-gradient-to-b from-sky-50 via-white to-blue-50/60 font-sans text-[15px] leading-relaxed text-slate-900 antialiased sm:text-base md:text-[1.0625rem]">
      {/* Ambient accents */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-sky-200/40 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-40 h-80 w-80 rounded-full bg-blue-200/35 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/2 h-64 w-[120%] -translate-x-1/2 bg-gradient-to-t from-sky-100/50 to-transparent"
      />

      <header className="sticky top-0 z-50 border-b border-white/40 bg-white/50 shadow-[0_1px_0_rgba(14,116,144,0.06)] backdrop-blur-xl backdrop-saturate-150 transition-[background-color,box-shadow] duration-300 supports-[backdrop-filter]:bg-white/35">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5 md:px-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold tracking-tight text-slate-900 transition-all duration-300 ease-out hover:opacity-90 active:scale-[0.99]"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-sm font-bold text-white shadow-md shadow-sky-500/25">
              M
            </span>
            MoodMap AI
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium text-slate-600">
            <a
              href="#features"
              className="rounded-md px-1 py-0.5 transition-colors duration-300 ease-out hover:bg-sky-50/80 hover:text-slate-900"
            >
              Features
            </a>
            <a
              href="#how"
              className="rounded-md px-1 py-0.5 transition-colors duration-300 ease-out hover:bg-sky-50/80 hover:text-slate-900"
            >
              How it works
            </a>
            <Link
              href="/login"
              className="hidden rounded-md px-1 py-0.5 text-slate-600 transition-colors duration-300 ease-out hover:bg-sky-50/80 hover:text-slate-900 sm:inline"
            >
              Sign in
            </Link>
          </nav>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col items-center px-6 pb-24 pt-10 text-center md:px-8 md:pt-16">
        <div className="w-full">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-200/80 bg-white/80 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-sky-700 shadow-sm backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Now in early access
          </p>

          <h1 className="max-w-4xl text-balance text-4xl font-bold leading-[1.06] tracking-[-0.02em] text-slate-900 sm:text-5xl sm:leading-[1.05] md:text-6xl md:leading-[1.04] lg:text-7xl lg:leading-[1.03]">
            Understand Your Mind with MoodMap AI
          </h1>

          <p className="mt-7 max-w-2xl text-pretty text-lg font-normal leading-relaxed text-slate-600 sm:text-xl sm:leading-relaxed md:mt-8 md:text-2xl md:leading-[1.55]">
            The AI journal that tracks your mood and prevents burnout.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:gap-5">
            <Link
              href="/signup"
              className="inline-flex min-w-[200px] items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-blue-600 px-10 py-4 text-base font-semibold text-white shadow-xl shadow-blue-500/30 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:from-sky-600 hover:to-blue-700 hover:shadow-2xl hover:shadow-blue-500/35 active:translate-y-0 active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:text-lg"
            >
              Get Started
            </Link>
            <a
              href="#features"
              className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 underline-offset-4 transition-all duration-300 ease-out hover:bg-sky-50/90 hover:text-slate-900 hover:underline"
            >
              See what&apos;s inside
            </a>
          </div>

          <div className="mt-14 grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
            {[
              { label: "Mood insights", stat: "Daily" },
              { label: "Burnout signals", stat: "Early" },
              { label: "Private by design", stat: "Secure" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-sky-100/80 bg-white/70 px-5 py-4 text-left shadow-sm shadow-sky-100/50 backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-sky-200/90 hover:shadow-md"
              >
                <p className="text-2xl font-bold tracking-tight text-slate-900">
                  {item.stat}
                </p>
                <p className="mt-1 text-sm text-slate-600">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <section
          id="features"
          className="w-full max-w-6xl scroll-mt-28 py-24 text-left md:scroll-mt-32"
        >
          <h2 className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-sky-700 sm:text-sm sm:tracking-widest">
            Why MoodMap
          </h2>
          <ul className="mt-10 grid grid-cols-1 items-stretch gap-5 lg:mt-12 lg:grid-cols-3 lg:gap-6">
            {[
              "Reflect in seconds with AI-guided prompts tuned to how you feel.",
              "Spot patterns across weeks so you can act before stress stacks up.",
              "A calm, minimal space that feels safe—not another noisy feed.",
            ].map((text) => (
              <li
                key={text}
                className="flex h-full min-h-0 gap-3 rounded-2xl border border-slate-100 bg-white/80 p-5 shadow-sm shadow-slate-200/40 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-slate-200/90 hover:shadow-md"
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-700">
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
                <span className="text-sm leading-relaxed text-slate-600 md:text-[0.9375rem] md:leading-relaxed lg:text-base">
                  {text}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section
          id="how"
          className="w-full scroll-mt-28 py-24 md:scroll-mt-32"
        >
          <div className="mx-auto max-w-2xl rounded-3xl border border-sky-100 bg-gradient-to-br from-white to-sky-50/80 p-8 shadow-lg shadow-sky-100/40 md:p-10">
            <h2 className="text-lg font-semibold tracking-tight text-slate-900 md:text-xl">
              How it works
            </h2>
            <ol className="mt-6 space-y-4 text-left text-sm leading-relaxed text-slate-600 md:text-base md:leading-relaxed">
              <li className="flex gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white transition-transform duration-300 ease-out">
                  1
                </span>
                Check in with a short journal entry whenever you want—no streak
                pressure.
              </li>
              <li className="flex gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white transition-transform duration-300 ease-out">
                  2
                </span>
                MoodMap reads tone and themes (never judgment—just clarity).
              </li>
              <li className="flex gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white transition-transform duration-300 ease-out">
                  3
                </span>
                Receive gentle nudges when your patterns suggest you need rest.
              </li>
            </ol>
          </div>
        </section>
      </main>

      <footer className="relative z-10 mt-auto border-t border-sky-100/60 bg-white/40 py-10 text-center text-slate-500 backdrop-blur-md">
        <p className="text-sm text-slate-600">Built with ❤️ for mental health</p>
        <p className="mt-2 text-xs text-slate-500 sm:text-sm">© 2026 MoodMap AI</p>
      </footer>
    </div>
  );
}
