@props(['type' => 'success'])

@php
    $styles = [
        'success' => 'border-cyan-400/30 bg-cyan-400/10 text-cyan-100',
        'error' => 'border-rose-500/30 bg-rose-500/10 text-rose-100',
        'info' => 'border-blue-400/30 bg-blue-400/10 text-blue-100',
    ];

    $icons = [
        'success' => '<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />',
        'error' => '<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m0 3.75h.008v.008H12v-.008zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />',
        'info' => '<path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />',
    ];
@endphp

<div role="alert" {{ $attributes->merge(['class' => 'flex items-start gap-3 rounded-2xl border px-4 py-3.5 text-sm shadow-lg '.$styles[$type]]) }}>
    <svg class="mt-0.5 h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
        {!! $icons[$type] !!}
    </svg>
    <div class="flex-1 leading-relaxed">{{ $slot }}</div>
</div>
