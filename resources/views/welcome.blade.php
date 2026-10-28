@extends('layouts.app')

@section('title', 'QuoteIt — Cybersecurity Quotes')

@section('content')
<div class="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
    @if (session('status'))
        <div class="pt-6">
            <x-alert type="success">{{ session('status') }}</x-alert>
        </div>
    @endif

    @if ($errors->any())
        <div class="pt-6">
            <x-alert type="error">Your quote could not be published. Please fix the highlighted field and try again.</x-alert>
        </div>
    @endif

    <section class="relative overflow-hidden pb-12 pt-12 sm:pb-16 sm:pt-16">
        <div class="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl"></div>
        <div class="pointer-events-none absolute -left-24 top-24 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl"></div>

        <div class="relative max-w-3xl">
            <span class="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
                <span class="h-1.5 w-1.5 rounded-full bg-cyan-400"></span>
                Community quote vault
            </span>

            <h1 class="mt-5 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                Wisdom for the
                <span class="bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-400 bg-clip-text text-transparent">cybersecurity</span>
                community.
            </h1>

            <p class="mt-5 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
                A shared collection of short, practical lessons about security, privacy, and resilience —
                written by the people who defend systems every day.
            </p>

            <div class="mt-8 flex flex-wrap items-center gap-3">
                <x-button href="#quotes" variant="secondary">
                    Browse quotes
                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </x-button>

                @auth
                    <x-button href="#share">
                        Share a quote
                        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                    </x-button>
                @else
                    <x-button :href="route('signup')">Join the community</x-button>
                @endauth
            </div>

            <dl class="mt-10 grid max-w-lg grid-cols-3 gap-3">
                <div class="rounded-2xl border border-white/5 bg-slate-900/50 px-4 py-3 backdrop-blur">
                    <dt class="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Quotes</dt>
                    <dd class="mt-1 text-xl font-bold text-white">{{ $quotes->count() }}</dd>
                </div>
                <div class="rounded-2xl border border-white/5 bg-slate-900/50 px-4 py-3 backdrop-blur">
                    <dt class="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Voices</dt>
                    <dd class="mt-1 text-xl font-bold text-white">{{ $quotes->pluck('user_id')->unique()->count() }}</dd>
                </div>
                <div class="rounded-2xl border border-white/5 bg-slate-900/50 px-4 py-3 backdrop-blur">
                    <dt class="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Likes</dt>
                    <dd class="mt-1 text-xl font-bold text-white">{{ $quotes->sum('likes_count') }}</dd>
                </div>
            </dl>
        </div>
    </section>

    <section id="share" class="scroll-mt-24">
        @auth
            <div class="grid gap-4 lg:grid-cols-3">
                <div class="rounded-3xl border border-cyan-400/20 bg-slate-900/60 p-6 shadow-[0_0_40px_rgba(8,145,178,0.08)] backdrop-blur sm:p-8 lg:col-span-2">
                    <div class="flex items-start justify-between gap-4">
                        <div>
                            <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-400">Contribute</p>
                            <h2 class="mt-1 text-xl font-bold tracking-tight text-white">Share a quote</h2>
                            <p class="mt-1.5 text-sm text-slate-400">Publish a lesson the community can learn from.</p>
                        </div>
                        <span class="hidden shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1 ps-1 pe-3 sm:inline-flex" dir="rtl">
                            <span class="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-400/15 text-[11px] font-bold text-cyan-300">
                                {{ mb_substr(auth()->user()->name, 0, 1) }}
                            </span>
                            <span dir="auto" class="max-w-[9rem] truncate font-arabic text-xs font-medium text-slate-300">{{ auth()->user()->name }}</span>
                        </span>
                    </div>

                    <form action="{{ route('quotes.store') }}" method="POST" class="mt-6 space-y-4">
                        @csrf

                        <div>
                            <label for="content" class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                                Your quote
                            </label>
                            <x-textarea name="content" id="content" rows="4" placeholder="اكتب اقتباسك هنا..." required />
                            <x-form-hint>Arabic or English — 3-155 characters.</x-form-hint>
                            <x-input-error name="content" />
                        </div>

                        <div class="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
                            <p class="text-xs text-slate-400">
                                Posting publicly as
                                <span dir="auto" class="font-arabic font-semibold text-slate-300">{{ auth()->user()->name }}</span>
                            </p>
                            <x-button type="submit">
                                <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                                Share a quote
                            </x-button>
                        </div>
                    </form>
                </div>

                <aside class="rounded-3xl border border-white/5 bg-slate-900/40 p-6 backdrop-blur sm:p-8">
                    <h3 class="text-sm font-bold text-white">Before you post</h3>
                    <ul class="mt-4 space-y-3.5 text-sm text-slate-400">
                        <li class="flex items-start gap-3">
                            <span class="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-400/10 text-cyan-300">
                                <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                            </span>
                            Keep it concise — between 3 and 155 characters.
                        </li>
                        <li class="flex items-start gap-3">
                            <span class="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-400/10 text-cyan-300">
                                <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                            </span>
                            Write in Arabic or English — both are welcome.
                        </li>
                        <li class="flex items-start gap-3">
                            <span class="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-400/10 text-cyan-300">
                                <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                            </span>
                            Credit the original author if you are quoting someone.
                        </li>
                    </ul>
                </aside>
            </div>
        @else
            <div class="relative overflow-hidden rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/10 via-slate-900/70 to-slate-900/80 p-6 backdrop-blur sm:p-10">
                <div class="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl"></div>

                <div class="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div class="flex items-start gap-4">
                        <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/25 bg-cyan-400/10 text-cyan-300">
                            <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                            </svg>
                        </span>
                        <div>
                            <h2 class="text-xl font-bold tracking-tight text-white">Want to share your own quote?</h2>
                            <p class="mt-1.5 max-w-xl text-sm leading-relaxed text-slate-400">
                                Log in to publish a quote under your name. Your posts appear instantly in the list, and you can edit or delete them at any time.
                            </p>
                        </div>
                    </div>

                    <div class="flex shrink-0 flex-col gap-2 sm:flex-row">
                        <x-button :href="route('login')">Log in</x-button>
                        <x-button :href="route('signup')" variant="secondary">Create account</x-button>
                    </div>
                </div>
            </div>
        @endauth
    </section>

    <section id="quotes" aria-labelledby="quotes-heading" class="mt-14 scroll-mt-24 sm:mt-20">
        <div class="flex flex-wrap items-end justify-between gap-3">
            <div>
                <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-400">The collection</p>
                <h2 id="quotes-heading" class="mt-1 text-2xl font-bold tracking-tight text-white">Quotes list</h2>
            </div>
            <span class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-400">
                {{ $quotes->count() }} {{ $quotes->count() === 1 ? 'quote' : 'quotes' }}
            </span>
        </div>

        @if ($quotes->isEmpty())
            <div class="mt-6 rounded-3xl border border-dashed border-white/10 bg-slate-900/40 px-6 py-14 text-center">
                <span class="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-400">
                    <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3.75h6M6.75 20.25h10.5a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6v12a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                </span>
                <p class="mt-4 text-sm font-semibold text-slate-300">No quotes yet</p>
                <p class="mt-1 text-sm text-slate-400">Be the first to share a lesson with the community.</p>
            </div>
        @else
            <div class="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                @foreach ($quotes as $quote)
                    @php
                        $liked = auth()->check() && $quote->likes->contains('id', auth()->id());
                        $isArabicQuote = preg_match('/\p{Arabic}/u', $quote->content) === 1;
                        $isArabicAuthor = preg_match('/\p{Arabic}/u', $quote->user->name) === 1;
                    @endphp

                    <article class="group flex flex-col rounded-2xl border border-white/5 bg-slate-900/50 p-5 transition-all duration-200 hover:-translate-y-1 hover:border-cyan-400/25 hover:bg-slate-900/80 hover:shadow-[0_18px_40px_-20px_rgba(8,145,178,0.45)] motion-reduce:transform-none">
                        <div class="flex items-center justify-between gap-3">
                            <span class="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-400/15 bg-cyan-400/10 text-cyan-400">
                                <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                    <path d="M7.17 6A5.17 5.17 0 002 11.17V18h6.83v-6.83H5.5A2.5 2.5 0 018 8.67V6H7.17zm10 0A5.17 5.17 0 0012 11.17V18h6.83v-6.83H15.5a2.5 2.5 0 012.5-2.5V6h-.83z" />
                                </svg>
                            </span>
                            <time datetime="{{ $quote->created_at->toIso8601String() }}" class="text-[11px] font-medium text-slate-400">
                                {{ $quote->created_at->format('M j, Y') }}
                            </time>
                        </div>

                        <blockquote
                            @if ($isArabicQuote) dir="rtl" lang="ar" @endif
                            class="mt-4 min-h-20 flex-1 text-base leading-loose text-slate-100 {{ $isArabicQuote ? 'text-right font-arabic' : '' }}"
                        >
                            {{ $quote->content }}
                        </blockquote>

                        <div class="mt-5 flex items-center justify-between gap-3 border-t border-white/5 pt-4">
                            <div class="flex min-w-0 items-center gap-2.5">
                                <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-bold text-cyan-300">
                                    {{ mb_substr($quote->user->name, 0, 1) }}
                                </span>
                                <div class="min-w-0">
                                    <p
                                        @if ($isArabicAuthor) dir="rtl" lang="ar" @endif
                                        class="truncate text-xs font-semibold text-slate-200 {{ $isArabicAuthor ? 'text-right font-arabic' : '' }}"
                                    >
                                        {{ $quote->user->name }}
                                    </p>
                                    <p class="mt-0.5 text-[10px] uppercase tracking-wider text-slate-400 {{ $isArabicAuthor ? 'text-right' : '' }}">
                                        {{ auth()->id() === $quote->user_id ? 'Your quote' : 'Community member' }}
                                    </p>
                                </div>
                            </div>

                            <div class="flex shrink-0 items-center gap-1.5">
                                @auth
                                    <form action="{{ route('quotes.like', $quote) }}" method="POST">
                                        @csrf
                                        <button
                                            type="submit"
                                            aria-pressed="{{ $liked ? 'true' : 'false' }}"
                                            aria-label="{{ $liked ? 'Unlike this quote' : 'Like this quote' }}"
                                            title="{{ $liked ? 'Unlike this quote' : 'Like this quote' }}"
                                            class="inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs transition-all duration-200 {{ $liked ? 'border-rose-400/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20' : 'border-white/10 bg-white/5 text-slate-400 hover:border-rose-400/30 hover:text-rose-300' }}"
                                        >
                                            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="{{ $liked ? 'currentColor' : 'none' }}" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                            </svg>
                                            <span class="font-semibold">{{ $quote->likes_count }}</span>
                                        </button>
                                    </form>
                                @else
                                    <span class="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-slate-400" title="Log in to like quotes">
                                        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                        </svg>
                                        <span class="font-semibold">{{ $quote->likes_count }}</span>
                                    </span>
                                @endauth

                                @if (auth()->id() === $quote->user_id)
                                    <a href="{{ route('quotes.edit', $quote) }}" aria-label="Edit this quote" title="Edit quote" class="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-slate-400 transition-all duration-200 hover:border-cyan-400/30 hover:text-cyan-300">
                                        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.651-1.651a2.121 2.121 0 113 3l-1.65 1.65m-3 3L7.5 21H3v-4.5l9.862-9.863m3 3L9.75 16.5" />
                                        </svg>
                                        <span class="hidden lg:inline">Edit</span>
                                    </a>

                                    <form action="{{ route('quotes.destroy', $quote) }}" method="POST" onsubmit="return confirm('Delete this quote?')">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" aria-label="Delete this quote" title="Delete quote" class="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-slate-400 transition-all duration-200 hover:border-rose-400/30 hover:bg-rose-500/10 hover:text-rose-300">
                                            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                            </svg>
                                            <span class="hidden lg:inline">Delete</span>
                                        </button>
                                    </form>
                                @endif
                            </div>
                        </div>
                    </article>
                @endforeach
            </div>
        @endif
    </section>
</div>
@endsection
