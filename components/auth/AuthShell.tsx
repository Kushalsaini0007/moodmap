import Link from "next/link";

type AuthShellProps = {
  children: React.ReactNode;
  title: string;
  subtitle: string;
};

export function AuthShell({ children, title, subtitle }: AuthShellProps) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-gradient-to-b from-sky-50 via-indigo-50/50 to-violet-100/40 font-sans text-[15px] leading-relaxed text-slate-900 antialiased sm:text-base">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-sky-200/45 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-40 h-80 w-80 rounded-full bg-violet-200/40 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/2 h-72 w-[120%] -translate-x-1/2 bg-gradient-to-t from-indigo-100/40 to-transparent"
      />

      <header className="relative z-10 border-b border-white/50 bg-white/45 shadow-[0_1px_0_rgba(99,102,241,0.06)] backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-white/35">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5 md:px-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold tracking-tight text-slate-900 transition-all duration-300 ease-out hover:opacity-90 active:scale-[0.99]"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 via-indigo-500 to-violet-600 text-sm font-bold text-white shadow-md shadow-indigo-500/25">
              M
            </span>
            MoodMap AI
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-slate-600 transition-colors duration-300 hover:text-slate-900"
          >
            Back to home
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-16 md:px-8">
        <div className="w-full max-w-md rounded-3xl border border-indigo-100/80 bg-white/75 p-8 shadow-xl shadow-indigo-100/40 backdrop-blur-md md:p-10">
          <h1 className="text-center text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            {title}
          </h1>
          <p className="mt-2 text-center text-sm leading-relaxed text-slate-600 md:text-base">
            {subtitle}
          </p>
          <div className="mt-8">{children}</div>
        </div>
      </main>
    </div>
  );
}
