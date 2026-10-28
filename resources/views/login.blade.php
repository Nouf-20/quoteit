@extends('layouts.app')

@section('title', 'Log in — QuoteIt')

@section('content')
<div class="mx-auto flex w-full max-w-6xl items-center justify-center px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
    <div class="w-full max-w-md">
        <div class="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl sm:p-8">
            <div class="text-center">
                <span class="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/25 bg-cyan-400/10 text-cyan-300">
                    <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                </span>
                <p class="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-400">Welcome back</p>
                <h1 class="mt-1 text-2xl font-bold tracking-tight text-white">Log in to QuoteIt</h1>
                <p class="mt-1.5 text-sm text-slate-400">Enter your credentials to continue sharing.</p>
            </div>

            @if ($errors->any())
                <div class="mt-6">
                    <x-alert type="error">We could not sign you in. Please check the details below.</x-alert>
                </div>
            @endif

            <form action="{{ route('login') }}" method="POST" class="mt-6 space-y-5">
                @csrf

                <div>
                    <label for="email" class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">Email address</label>
                    <x-text-input type="email" name="email" id="email" placeholder="operator@quoteit.com" required autocomplete="email" />
                    <x-input-error name="email" />
                </div>

                <div>
                    <label for="password" class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">Password</label>
                    <x-text-input type="password" name="password" id="password" placeholder="••••••••" required autocomplete="current-password" />
                    <x-input-error name="password" />
                </div>

                <div class="flex items-center gap-2.5">
                    <input type="checkbox" id="remember" name="remember" class="h-4 w-4 rounded border-white/15 bg-slate-950 accent-cyan-500">
                    <label for="remember" class="text-sm text-slate-400">Remember me on this device</label>
                </div>

                <x-button type="submit" class="w-full">
                    Log in
                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                </x-button>
            </form>

            <div class="mt-6 border-t border-white/5 pt-6 text-center">
                <p class="text-sm text-slate-400">
                    New to QuoteIt?
                    <a href="{{ route('signup') }}" class="font-semibold text-cyan-300 transition-colors hover:text-cyan-200">Create an account</a>
                </p>
            </div>
        </div>

        <div class="mt-4 rounded-2xl border border-white/5 bg-slate-900/30 px-4 py-3 text-center">
            <p class="text-xs text-slate-400">
                Demo account:
                <span class="font-semibold text-slate-300">demo@quoteit.com</span>
                <span class="mx-1 text-slate-600">/</span>
                <span class="font-semibold text-slate-300">password123</span>
            </p>
        </div>
    </div>
</div>
@endsection
