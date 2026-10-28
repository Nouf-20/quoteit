@props([
    'variant' => 'primary',
    'type' => 'button',
    'href' => null,
    'size' => 'md',
])

@php
    $base = 'inline-flex items-center justify-center gap-2 rounded-xl font-semibold tracking-wide transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60';

    $variants = [
        'primary' => 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 hover:bg-cyan-400 hover:shadow-cyan-400/30 active:translate-y-px',
        'secondary' => 'border border-white/10 bg-white/5 text-slate-100 hover:border-cyan-400/40 hover:bg-cyan-400/10 hover:text-white',
        'ghost' => 'text-slate-300 hover:bg-white/5 hover:text-white',
        'danger' => 'border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:border-rose-400/60 hover:bg-rose-500/20 hover:text-rose-200',
    ];

    $sizes = [
        'sm' => 'px-3 py-2 text-xs',
        'md' => 'px-5 py-3 text-sm',
    ];

    $classes = $base.' '.$variants[$variant].' '.$sizes[$size];
@endphp

@if ($href)
    <a href="{{ $href }}" {{ $attributes->merge(['class' => $classes]) }}>{{ $slot }}</a>
@else
    <button type="{{ $type }}" {{ $attributes->merge(['class' => $classes]) }}>{{ $slot }}</button>
@endif
