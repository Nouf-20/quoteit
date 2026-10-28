@props(['type' => 'text', 'name', 'id' => null, 'value' => null, 'required' => false, 'placeholder' => null])

@php
    $hasError = $errors->has($name);

    $classes = 'w-full rounded-xl border bg-slate-950/60 px-4 py-3 text-sm text-slate-100 outline-none transition-all duration-200 placeholder:text-slate-500 focus:ring-2 '
        .($hasError
            ? 'border-rose-500/60 focus:border-rose-400 focus:ring-rose-400/20'
            : 'border-white/10 focus:border-cyan-400/60 focus:ring-cyan-400/15');
@endphp

<input
    type="{{ $type }}"
    name="{{ $name }}"
    id="{{ $id ?? $name }}"
    value="{{ $type === 'password' ? '' : old($name, $value) }}"
    @if ($required) required @endif
    @if ($placeholder) placeholder="{{ $placeholder }}" @endif
    {{ $attributes->merge(['class' => $classes]) }}
>
