@extends('layouts.app')

@section('title', 'Create account — QuoteIt')

@section('content')
<div class="mx-auto flex w-full max-w-6xl items-center justify-center px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
    <div class="w-full max-w-md">
        <div class="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl sm:p-8">
            <div class="text-center">
                <span class="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/25 bg-cyan-400/10 text-cyan-300">
                    <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM3 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 019.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                    </svg>
                </span>
                <p class="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-400">Join the community</p>
                <h1 class="mt-1 text-2xl font-bold tracking-tight text-white">Create your account</h1>
                <p class="mt-1.5 text-sm text-slate-400">Share your own cybersecurity quotes with the world.</p>
            </div>

            @if ($errors->any())
                <div class="mt-6">
                    <x-alert type="error">We could not create your account. Please review the highlighted fields.</x-alert>
                </div>
            @endif

            <form action="{{ route('signup') }}" method="POST" class="mt-6 space-y-5">
                @csrf

                <div>
                    <label for="name" class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">Full name</label>
                    <x-text-input type="text" name="name" id="name" placeholder="نورة الشهري" required autocomplete="name" dir="auto" />
                    <x-form-hint>2-50 characters.</x-form-hint>
                    <x-input-error name="name" />
                </div>

                <div>
                    <label for="email" class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">Email address</label>
                    <x-text-input type="email" name="email" id="email" placeholder="operator@quoteit.com" required autocomplete="email" />
                    <x-form-hint>Use a valid email address you can access.</x-form-hint>
                    <x-input-error name="email" />
                </div>

                <div>
                    <label for="password" class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">Password</label>
                    <x-text-input type="password" name="password" id="password" placeholder="••••••••" required autocomplete="new-password" />
                    <x-form-hint>At least 8 characters.</x-form-hint>
                    <x-input-error name="password" />
                </div>

                <div>
                    <label for="password_confirmation" class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">Confirm password</label>
                    <x-text-input type="password" name="password_confirmation" id="password_confirmation" placeholder="••••••••" required autocomplete="new-password" />
                    <x-form-hint>Repeat the password exactly.</x-form-hint>
                    <x-input-error name="password_confirmation" />
                </div>

                <x-button type="submit" class="w-full">
                    Create account
                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                </x-button>
            </form>

            <div class="mt-6 border-t border-white/5 pt-6 text-center">
                <p class="text-sm text-slate-400">
                    Already have an account?
                    <a href="{{ route('login') }}" class="font-semibold text-cyan-300 transition-colors hover:text-cyan-200">Log in</a>
                </p>
            </div>
        </div>
    </div>
</div>
@endsection
