@props(['name'])

@error($name)
    <p class="mt-1.5 flex items-center gap-1 text-xs text-rose-400">
        <svg class="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v4m0 4h.01M12 3l9 16H3l9-16z" />
        </svg>
        {{ $message }}
    </p>
@enderror
