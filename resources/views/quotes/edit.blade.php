@extends('layouts.app')

@section('title', 'Edit quote — QuoteIt')

@section('content')
<div class="mx-auto flex w-full max-w-6xl items-center justify-center px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
    <div class="w-full max-w-xl">
        <div class="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl sm:p-8">
            <div class="text-center">
                <span class="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/25 bg-cyan-400/10 text-cyan-300">
                    <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.651-1.651a2.121 2.121 0 113 3l-1.65 1.65m-3 3L7.5 21H3v-4.5l9.862-9.863m3 3L9.75 16.5" />
                    </svg>
                </span>
                <p class="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-400">Owner controls</p>
                <h1 class="mt-1 text-2xl font-bold tracking-tight text-white">Edit quote</h1>
                <p class="mt-1.5 text-sm text-slate-400">Update the wording and save your changes.</p>
            </div>

            @if ($errors->any())
                <div class="mt-6">
                    <x-alert type="error">Your changes could not be saved. Please fix the highlighted field.</x-alert>
                </div>
            @endif

            <form action="{{ route('quotes.update', $quote) }}" method="POST" class="mt-6 space-y-5">
                @csrf
                @method('PUT')

                <div>
                    <label for="content" class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">Quote</label>
                    <x-textarea name="content" id="content" rows="5" :value="$quote->content" required />
                    <x-form-hint>3-155 characters.</x-form-hint>
                    <x-input-error name="content" />
                </div>

                <div class="flex flex-col gap-3 sm:flex-row">
                    <x-button type="submit" class="flex-1">Save changes</x-button>
                    <x-button :href="route('home')" variant="secondary" class="flex-1">Cancel</x-button>
                </div>
            </form>

            <div class="mt-6 border-t border-white/5 pt-5 text-center">
                <p class="text-xs leading-relaxed text-slate-400">
                    Only you can edit or delete this quote.
                </p>
            </div>
        </div>
    </div>
</div>
@endsection
