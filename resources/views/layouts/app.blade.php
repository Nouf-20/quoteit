<!DOCTYPE html>
<html lang="en" class="h-full">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="description" content="QuoteIt — a curated collection of Arabic cybersecurity quotes from the community.">
    <title>@yield('title', 'QuoteIt — Cybersecurity Quotes')</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="flex min-h-screen flex-col font-sans text-slate-200 antialiased">
    <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-cyan-400 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-slate-950">
        Skip to content
    </a>

    <header class="sticky top-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
        <nav class="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-2 px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
            <a href="{{ route('home') }}" class="shrink-0 rounded-xl transition-opacity hover:opacity-85" aria-label="QuoteIt home">
                <x-brand />
            </a>

            <div class="flex items-center gap-1.5 sm:gap-3">
                <a href="{{ route('home') }}" class="hidden rounded-lg px-3 py-2 text-xs font-semibold tracking-wide text-slate-400 transition-colors hover:text-cyan-300 sm:inline-flex">
                    Quotes
                </a>

                @auth
                    <span class="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1 ps-1 pe-3 sm:inline-flex" dir="rtl">
                        <span class="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-400/15 text-[11px] font-bold text-cyan-300">
                            {{ mb_substr(auth()->user()->name, 0, 1) }}
                        </span>
                        <span dir="auto" class="max-w-[9rem] truncate font-arabic text-xs font-medium text-slate-300">{{ auth()->user()->name }}</span>
                    </span>

                    <form action="{{ route('logout') }}" method="POST">
                        @csrf
                        <x-button type="submit" variant="secondary" size="sm">Log out</x-button>
                    </form>
                @else
                    <x-button :href="route('login')" variant="ghost" size="sm">Log in</x-button>
                    <x-button :href="route('signup')" size="sm">Sign up</x-button>
                @endauth
            </div>
        </nav>
    </header>

    <main id="main-content" class="w-full flex-1">
        @yield('content')
    </main>

    <footer class="mt-16 border-t border-white/5 bg-slate-950/60">
        <div class="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-5 px-4 py-8 text-center sm:flex-row sm:text-left sm:px-6 lg:px-8">
            <div class="flex flex-col items-center gap-2 sm:items-start">
                <x-brand />
                <p class="max-w-sm text-xs leading-relaxed text-slate-400">
                    A community space for sharing practical wisdom about security, privacy, and resilience.
                </p>
            </div>

            <div class="flex flex-col items-center gap-1.5 text-xs text-slate-400 sm:items-end">
                <p>&copy; {{ date('Y') }} QuoteIt. All rights reserved.</p>
                <p class="flex items-center gap-1.5">
                    <span class="h-1.5 w-1.5 rounded-full bg-cyan-400"></span>
                    Built with Laravel &amp; Tailwind CSS
                </p>
            </div>
        </div>
    </footer>

    @stack('scripts')
</body>
</html>
