// HTML templates — a faithful port of the Laravel Blade views.

export type SessionUser = { id: number; name: string; email: string };

export type QuoteRow = {
  id: number;
  user_id: number;
  content: string;
  created_at: string;
  user_name: string;
  likes_count: number;
  liked: number;
};

export type FlashState = {
  status?: string;
  errors?: Record<string, string>;
  old?: Record<string, string>;
};

export const esc = (value: unknown): string =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const ARABIC = /[\u0600-\u06FF]/;
const isArabic = (value: string) => ARABIC.test(value);

const firstChar = (value: string) => {
  const chars = Array.from(value || "");
  return chars.length ? chars[0] : "";
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Carbon's `format('M j, Y')` in UTC (storage timezone). */
export const formatDate = (value: string): string => {
  const iso = value.includes("T") ? value : value.replace(" ", "T") + "Z";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return value;
  return `${MONTHS[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
};

export const toIso8601 = (value: string): string => {
  const iso = value.includes("T") ? value : value.replace(" ", "T") + "Z";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return value;
  return date.toISOString().replace(/\.\d{3}Z$/, "Z");
};

/* ------------------------------------------------------------------ */
/* components                                                          */
/* ------------------------------------------------------------------ */

const BRAND = `<span class="inline-flex items-center gap-2.5">
    <span class="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/10 text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.15)]">
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 3l7 3v5.5c0 4.2-2.8 7.4-7 9.5-4.2-2.1-7-5.3-7-9.5V6l7-3z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.5 11.5l1.8 1.8 3.4-3.6" />
        </svg>
    </span>
    <span class="text-lg font-bold tracking-tight text-white">Quote<span class="text-cyan-400">It.</span></span>
</span>`;

const BUTTON_BASE =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold tracking-wide transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60";

const VARIANTS: Record<string, string> = {
  primary:
    "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 hover:bg-cyan-400 hover:shadow-cyan-400/30 active:translate-y-px",
  secondary:
    "border border-white/10 bg-white/5 text-slate-100 hover:border-cyan-400/40 hover:bg-cyan-400/10 hover:text-white",
  ghost: "text-slate-300 hover:bg-white/5 hover:text-white",
  danger:
    "border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:border-rose-400/60 hover:bg-rose-500/20 hover:text-rose-200",
};

const SIZES: Record<string, string> = {
  sm: "px-3 py-2 text-xs",
  md: "px-5 py-3 text-sm",
};

type ButtonOptions = {
  href?: string;
  type?: string;
  variant?: string;
  size?: string;
  class?: string;
};

const button = (inner: string, opts: ButtonOptions = {}): string => {
  const classes = [
    BUTTON_BASE,
    VARIANTS[opts.variant ?? "primary"],
    SIZES[opts.size ?? "md"],
    opts.class ?? "",
  ]
    .filter(Boolean)
    .join(" ");
  if (opts.href) {
    return `<a href="${esc(opts.href)}" class="${classes}">${inner}</a>`;
  }
  return `<button type="${esc(opts.type ?? "button")}" class="${classes}">${inner}</button>`;
};

const ALERT_STYLES: Record<string, string> = {
  success: "border-cyan-400/30 bg-cyan-400/10 text-cyan-100",
  error: "border-rose-500/30 bg-rose-500/10 text-rose-100",
  info: "border-blue-400/30 bg-blue-400/10 text-blue-100",
};

const ALERT_ICONS: Record<string, string> = {
  success:
    '<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />',
  error:
    '<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m0 3.75h.008v.008H12v-.008zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />',
  info:
    '<path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />',
};

const alert = (type: string, slot: string): string =>
  `<div role="alert" class="flex items-start gap-3 rounded-2xl border px-4 py-3.5 text-sm shadow-lg ${
    ALERT_STYLES[type] ?? ALERT_STYLES.success
  }">
    <svg class="mt-0.5 h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
        ${ALERT_ICONS[type] ?? ALERT_ICONS.success}
    </svg>
    <div class="flex-1 leading-relaxed">${slot}</div>
</div>`;

const inputClasses = (hasError: boolean) =>
  "w-full rounded-xl border bg-slate-950/60 px-4 py-3 text-sm text-slate-100 outline-none transition-all duration-200 placeholder:text-slate-500 focus:ring-2 " +
  (hasError
    ? "border-rose-500/60 focus:border-rose-400 focus:ring-rose-400/20"
    : "border-white/10 focus:border-cyan-400/60 focus:ring-cyan-400/15");

type FieldOptions = {
  type?: string;
  name: string;
  id?: string;
  value?: string;
  required?: boolean;
  placeholder?: string;
  autocomplete?: string;
  dir?: string;
  error?: string;
};

const textInput = (opts: FieldOptions): string => {
  const attrs = [
    `type="${esc(opts.type ?? "text")}"`,
    `name="${esc(opts.name)}"`,
    `id="${esc(opts.id ?? opts.name)}"`,
    `value="${esc(opts.type === "password" ? "" : opts.value ?? "")}"`,
    opts.required ? "required" : "",
    opts.placeholder ? `placeholder="${esc(opts.placeholder)}"` : "",
    opts.autocomplete ? `autocomplete="${esc(opts.autocomplete)}"` : "",
    opts.dir ? `dir="${esc(opts.dir)}"` : "",
    `class="${inputClasses(Boolean(opts.error))}"`,
  ]
    .filter(Boolean)
    .join(" ");
  return `<input ${attrs}>`;
};

const textarea = (opts: FieldOptions & { rows?: number }): string => {
  const attrs = [
    `name="${esc(opts.name)}"`,
    `id="${esc(opts.id ?? opts.name)}"`,
    `rows="${opts.rows ?? 4}"`,
    'dir="auto"',
    opts.required ? "required" : "",
    opts.placeholder ? `placeholder="${esc(opts.placeholder)}"` : "",
    `class="${inputClasses(Boolean(opts.error))}"`,
  ]
    .filter(Boolean)
    .join(" ");
  return `<textarea ${attrs}>${esc(opts.value ?? "")}</textarea>`;
};

const inputError = (message?: string): string =>
  message
    ? `<p class="mt-1.5 flex items-center gap-1 text-xs text-rose-400">
        <svg class="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v4m0 4h.01M12 3l9 16H3l9-16z" />
        </svg>
        ${esc(message)}
    </p>`
    : "";

const hint = (text: string): string =>
  `<p class="mt-1.5 text-xs leading-relaxed text-slate-400">${text}</p>`;

const csrfField = (csrf: string): string =>
  `<input type="hidden" name="_token" value="${esc(csrf)}">`;

/* ------------------------------------------------------------------ */
/* layout                                                              */
/* ------------------------------------------------------------------ */

type LayoutOptions = {
  title: string;
  csrf: string;
  user: SessionUser | null;
  content: string;
};

const layout = ({ title, csrf, user, content }: LayoutOptions): string => {
  const avatar = user
    ? `<span class="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1 ps-1 pe-3 sm:inline-flex" dir="rtl">
                        <span class="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-400/15 text-[11px] font-bold text-cyan-300">
                            ${esc(firstChar(user.name))}
                        </span>
                        <span dir="auto" class="max-w-[9rem] truncate font-arabic text-xs font-medium text-slate-300">${esc(
                          user.name
                        )}</span>
                    </span>

                    <form action="/logout" method="POST">
                        ${csrfField(csrf)}
                        ${button("Log out", { type: "submit", variant: "secondary", size: "sm" })}
                    </form>`
    : `${button("Log in", { href: "/login", variant: "ghost", size: "sm" })}
                    ${button("Sign up", { href: "/signup", size: "sm" })}`;

  return `<!DOCTYPE html>
<html lang="en" class="h-full">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="${esc(csrf)}">
    <meta name="description" content="QuoteIt — a curated collection of Arabic cybersecurity quotes from the community.">
    <title>${esc(title)}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preload" as="style" href="/build/assets/app-CgEeV7CN.css" /><link rel="stylesheet" href="/build/assets/app-CgEeV7CN.css" />
</head>
<body class="flex min-h-screen flex-col font-sans text-slate-200 antialiased">
    <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-cyan-400 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-slate-950">
        Skip to content
    </a>

    <header class="sticky top-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
        <nav class="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-2 px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
            <a href="/" class="shrink-0 rounded-xl transition-opacity hover:opacity-85" aria-label="QuoteIt home">
                ${BRAND}
            </a>

            <div class="flex items-center gap-1.5 sm:gap-3">
                <a href="/" class="hidden rounded-lg px-3 py-2 text-xs font-semibold tracking-wide text-slate-400 transition-colors hover:text-cyan-300 sm:inline-flex">
                    Quotes
                </a>

                ${avatar}
            </div>
        </nav>
    </header>

    <main id="main-content" class="w-full flex-1">
        ${content}
    </main>

    <footer class="mt-16 border-t border-white/5 bg-slate-950/60">
        <div class="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-5 px-4 py-8 text-center sm:flex-row sm:text-left sm:px-6 lg:px-8">
            <div class="flex flex-col items-center gap-2 sm:items-start">
                ${BRAND}
                <p class="max-w-sm text-xs leading-relaxed text-slate-400">
                    A community space for sharing practical wisdom about security, privacy, and resilience.
                </p>
            </div>

            <div class="flex flex-col items-center gap-1.5 text-xs text-slate-400 sm:items-end">
                <p>&copy; ${new Date().getUTCFullYear()} QuoteIt. All rights reserved.</p>
                <p class="flex items-center gap-1.5">
                    <span class="h-1.5 w-1.5 rounded-full bg-cyan-400"></span>
                    Built with Laravel &amp; Tailwind CSS
                </p>
            </div>
        </div>
    </footer>

</body>
</html>`;
};

/* ------------------------------------------------------------------ */
/* quote card                                                          */
/* ------------------------------------------------------------------ */

const quoteCard = (quote: QuoteRow, user: SessionUser | null, csrf: string): string => {
  const liked = quote.liked === 1;
  const arabicQuote = isArabic(quote.content);
  const arabicAuthor = isArabic(quote.user_name);
  const owner = user !== null && user.id === quote.user_id;
  const url = `/quotes/${quote.id}`;

  const likeControl = user
    ? `<form action="${url}/like" method="POST">
                                        ${csrfField(csrf)}
                                        <button
                                            type="submit"
                                            aria-pressed="${liked ? "true" : "false"}"
                                            aria-label="${liked ? "Unlike this quote" : "Like this quote"}"
                                            title="${liked ? "Unlike this quote" : "Like this quote"}"
                                            class="inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs transition-all duration-200 ${
                                              liked
                                                ? "border-rose-400/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20"
                                                : "border-white/10 bg-white/5 text-slate-400 hover:border-rose-400/30 hover:text-rose-300"
                                            }"
                                        >
                                            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="${
                                              liked ? "currentColor" : "none"
                                            }" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                            </svg>
                                            <span class="font-semibold">${quote.likes_count}</span>
                                        </button>
                                    </form>`
    : `<span class="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-slate-400" title="Log in to like quotes">
                                        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                        </svg>
                                        <span class="font-semibold">${quote.likes_count}</span>
                                    </span>`;

  const ownerControls = owner
    ? `<a href="${url}/edit" aria-label="Edit this quote" title="Edit quote" class="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-slate-400 transition-all duration-200 hover:border-cyan-400/30 hover:text-cyan-300">
                                        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.651-1.651a2.121 2.121 0 113 3l-1.65 1.65m-3 3L7.5 21H3v-4.5l9.862-9.863m3 3L9.75 16.5" />
                                        </svg>
                                        <span class="hidden lg:inline">Edit</span>
                                    </a>

                                    <form action="${url}" method="POST" onsubmit="return confirm('Delete this quote?')">
                                        ${csrfField(csrf)}
                                        <input type="hidden" name="_method" value="DELETE">
                                        <button type="submit" aria-label="Delete this quote" title="Delete quote" class="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-slate-400 transition-all duration-200 hover:border-rose-400/30 hover:bg-rose-500/10 hover:text-rose-300">
                                            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                            </svg>
                                            <span class="hidden lg:inline">Delete</span>
                                        </button>
                                    </form>`
    : "";

  return `<article class="group flex flex-col rounded-2xl border border-white/5 bg-slate-900/50 p-5 transition-all duration-200 hover:-translate-y-1 hover:border-cyan-400/25 hover:bg-slate-900/80 hover:shadow-[0_18px_40px_-20px_rgba(8,145,178,0.45)] motion-reduce:transform-none">
                        <div class="flex items-center justify-between gap-3">
                            <span class="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-400/15 bg-cyan-400/10 text-cyan-400">
                                <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                    <path d="M7.17 6A5.17 5.17 0 002 11.17V18h6.83v-6.83H5.5A2.5 2.5 0 018 8.67V6H7.17zm10 0A5.17 5.17 0 0012 11.17V18h6.83v-6.83H15.5a2.5 2.5 0 012.5-2.5V6h-.83z" />
                                </svg>
                            </span>
                            <time datetime="${esc(toIso8601(quote.created_at))}" class="text-[11px] font-medium text-slate-400">
                                ${esc(formatDate(quote.created_at))}
                            </time>
                        </div>

                        <blockquote
                            ${arabicQuote ? 'dir="rtl" lang="ar"' : ""}
                            class="mt-4 min-h-20 flex-1 text-base leading-loose text-slate-100 ${
                              arabicQuote ? "text-right font-arabic" : ""
                            }"
                        >
                            ${esc(quote.content)}
                        </blockquote>

                        <div class="mt-5 flex items-center justify-between gap-3 border-t border-white/5 pt-4">
                            <div class="flex min-w-0 items-center gap-2.5">
                                <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-bold text-cyan-300">
                                    ${esc(firstChar(quote.user_name))}
                                </span>
                                <div class="min-w-0">
                                    <p
                                        ${arabicAuthor ? 'dir="rtl" lang="ar"' : ""}
                                        class="truncate text-xs font-semibold text-slate-200 ${
                                          arabicAuthor ? "text-right font-arabic" : ""
                                        }"
                                    >
                                        ${esc(quote.user_name)}
                                    </p>
                                    <p class="mt-0.5 text-[10px] uppercase tracking-wider text-slate-400 ${
                                      arabicAuthor ? "text-right" : ""
                                    }">
                                        ${owner ? "Your quote" : "Community member"}
                                    </p>
                                </div>
                            </div>

                            <div class="flex shrink-0 items-center gap-1.5">
                                ${likeControl}
                                ${ownerControls}
                            </div>
                        </div>
                    </article>`;
};

/* ------------------------------------------------------------------ */
/* pages                                                               */
/* ------------------------------------------------------------------ */

type PageOptions = {
  user: SessionUser | null;
  csrf: string;
  flash: FlashState;
};

export const homePage = (quotes: QuoteRow[], { user, csrf, flash }: PageOptions): string => {
  const status = flash.status
    ? `<div class="pt-6">
            ${alert("success", esc(flash.status))}
        </div>`
    : "";
  const hasErrors = Boolean(flash.errors && Object.keys(flash.errors).length);
  const errorsBanner = hasErrors
    ? `<div class="pt-6">
            ${alert(
              "error",
              "Your quote could not be published. Please fix the highlighted field and try again."
            )}
        </div>`
    : "";

  const contentError = flash.errors?.content;
  const oldContent = flash.old?.content ?? "";

  const composer = user
    ? `<div class="grid gap-4 lg:grid-cols-3">
                <div class="rounded-3xl border border-cyan-400/20 bg-slate-900/60 p-6 shadow-[0_0_40px_rgba(8,145,178,0.08)] backdrop-blur sm:p-8 lg:col-span-2">
                    <div class="flex items-start justify-between gap-4">
                        <div>
                            <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-400">Contribute</p>
                            <h2 class="mt-1 text-xl font-bold tracking-tight text-white">Share a quote</h2>
                            <p class="mt-1.5 text-sm text-slate-400">Publish a lesson the community can learn from.</p>
                        </div>
                        <span class="hidden shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1 ps-1 pe-3 sm:inline-flex" dir="rtl">
                            <span class="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-400/15 text-[11px] font-bold text-cyan-300">
                                ${esc(firstChar(user.name))}
                            </span>
                            <span dir="auto" class="max-w-[9rem] truncate font-arabic text-xs font-medium text-slate-300">${esc(
                              user.name
                            )}</span>
                        </span>
                    </div>

                    <form action="/quotes" method="POST" class="mt-6 space-y-4">
                        ${csrfField(csrf)}

                        <div>
                            <label for="content" class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                                Your quote
                            </label>
                            ${textarea({
                              name: "content",
                              id: "content",
                              rows: 4,
                              placeholder: "اكتب اقتباسك هنا...",
                              required: true,
                              value: oldContent,
                              error: contentError,
                            })}
                            ${hint("Arabic or English — 3-155 characters.")}
                            ${inputError(contentError)}
                        </div>

                        <div class="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
                            <p class="text-xs text-slate-400">
                                Posting publicly as
                                <span dir="auto" class="font-arabic font-semibold text-slate-300">${esc(user.name)}</span>
                            </p>
                            ${button(
                              `<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                                Share a quote`,
                              { type: "submit" }
                            )}
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
            </div>`
    : `<div class="relative overflow-hidden rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/10 via-slate-900/70 to-slate-900/80 p-6 backdrop-blur sm:p-10">
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
                        ${button("Log in", { href: "/login" })}
                        ${button("Create account", { href: "/signup", variant: "secondary" })}
                    </div>
                </div>
            </div>`;

  const voices = new Set(quotes.map((q) => q.user_id)).size;
  const likes = quotes.reduce((sum, q) => sum + q.likes_count, 0);

  const list = quotes.length
    ? `<div class="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                ${quotes.map((quote) => quoteCard(quote, user, csrf)).join("\n")}
            </div>`
    : `<div class="mt-6 rounded-3xl border border-dashed border-white/10 bg-slate-900/40 px-6 py-14 text-center">
                <span class="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-400">
                    <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3.75h6M6.75 20.25h10.5a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6v12a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                </span>
                <p class="mt-4 text-sm font-semibold text-slate-300">No quotes yet</p>
                <p class="mt-1 text-sm text-slate-400">Be the first to share a lesson with the community.</p>
            </div>`;

  const page = `<div class="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
    ${status}

    ${errorsBanner}

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
                ${button(
                  `Browse quotes
                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>`,
                  { href: "#quotes", variant: "secondary" }
                )}

                ${
                  user
                    ? button(
                        `Share a quote
                        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                        </svg>`,
                        { href: "#share" }
                      )
                    : button("Join the community", { href: "/signup" })
                }
            </div>

            <dl class="mt-10 grid max-w-lg grid-cols-3 gap-3">
                <div class="rounded-2xl border border-white/5 bg-slate-900/50 px-4 py-3 backdrop-blur">
                    <dt class="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Quotes</dt>
                    <dd class="mt-1 text-xl font-bold text-white">${quotes.length}</dd>
                </div>
                <div class="rounded-2xl border border-white/5 bg-slate-900/50 px-4 py-3 backdrop-blur">
                    <dt class="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Voices</dt>
                    <dd class="mt-1 text-xl font-bold text-white">${voices}</dd>
                </div>
                <div class="rounded-2xl border border-white/5 bg-slate-900/50 px-4 py-3 backdrop-blur">
                    <dt class="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Likes</dt>
                    <dd class="mt-1 text-xl font-bold text-white">${likes}</dd>
                </div>
            </dl>
        </div>
    </section>

    <section id="share" class="scroll-mt-24">
        ${composer}
    </section>

    <section id="quotes" aria-labelledby="quotes-heading" class="mt-14 scroll-mt-24 sm:mt-20">
        <div class="flex flex-wrap items-end justify-between gap-3">
            <div>
                <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-400">The collection</p>
                <h2 id="quotes-heading" class="mt-1 text-2xl font-bold tracking-tight text-white">Quotes list</h2>
            </div>
            <span class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-400">
                ${quotes.length} ${quotes.length === 1 ? "quote" : "quotes"}
            </span>
        </div>

        ${list}
    </section>
</div>`;

  return layout({ title: "QuoteIt — Cybersecurity Quotes", csrf, user, content: page });
};

export const loginPage = ({ user, csrf, flash }: PageOptions): string => {
  const errors = flash.errors ?? {};
  const old = flash.old ?? {};
  const hasErrors = Boolean(Object.keys(errors).length);

  const content = `<div class="mx-auto flex w-full max-w-6xl items-center justify-center px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
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

            ${
              hasErrors
                ? `<div class="mt-6">
                    ${alert("error", "We could not sign you in. Please check the details below.")}
                </div>`
                : ""
            }

            <form action="/login" method="POST" class="mt-6 space-y-5">
                ${csrfField(csrf)}

                <div>
                    <label for="email" class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">Email address</label>
                    ${textInput({
                      type: "email",
                      name: "email",
                      id: "email",
                      placeholder: "operator@quoteit.com",
                      required: true,
                      autocomplete: "email",
                      value: old.email ?? "",
                      error: errors.email,
                    })}
                    ${inputError(errors.email)}
                </div>

                <div>
                    <label for="password" class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">Password</label>
                    ${textInput({
                      type: "password",
                      name: "password",
                      id: "password",
                      placeholder: "••••••••",
                      required: true,
                      autocomplete: "current-password",
                      error: errors.password,
                    })}
                    ${inputError(errors.password)}
                </div>

                <div class="flex items-center gap-2.5">
                    <input type="checkbox" id="remember" name="remember" class="h-4 w-4 rounded border-white/15 bg-slate-950 accent-cyan-500">
                    <label for="remember" class="text-sm text-slate-400">Remember me on this device</label>
                </div>

                ${button(
                  `Log in
                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>`,
                  { type: "submit", class: "w-full" }
                )}
            </form>

            <div class="mt-6 border-t border-white/5 pt-6 text-center">
                <p class="text-sm text-slate-400">
                    New to QuoteIt?
                    <a href="/signup" class="font-semibold text-cyan-300 transition-colors hover:text-cyan-200">Create an account</a>
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
</div>`;

  return layout({ title: "Log in — QuoteIt", csrf, user, content });
};

export const signupPage = ({ user, csrf, flash }: PageOptions): string => {
  const errors = flash.errors ?? {};
  const old = flash.old ?? {};
  const hasErrors = Boolean(Object.keys(errors).length);

  const content = `<div class="mx-auto flex w-full max-w-6xl items-center justify-center px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
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

            ${
              hasErrors
                ? `<div class="mt-6">
                    ${alert("error", "We could not create your account. Please review the highlighted fields.")}
                </div>`
                : ""
            }

            <form action="/signup" method="POST" class="mt-6 space-y-5">
                ${csrfField(csrf)}

                <div>
                    <label for="name" class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">Full name</label>
                    ${textInput({
                      type: "text",
                      name: "name",
                      id: "name",
                      placeholder: "نورة الشهري",
                      required: true,
                      autocomplete: "name",
                      dir: "auto",
                      value: old.name ?? "",
                      error: errors.name,
                    })}
                    ${hint("2-50 characters.")}
                    ${inputError(errors.name)}
                </div>

                <div>
                    <label for="email" class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">Email address</label>
                    ${textInput({
                      type: "email",
                      name: "email",
                      id: "email",
                      placeholder: "operator@quoteit.com",
                      required: true,
                      autocomplete: "email",
                      value: old.email ?? "",
                      error: errors.email,
                    })}
                    ${hint("Use a valid email address you can access.")}
                    ${inputError(errors.email)}
                </div>

                <div>
                    <label for="password" class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">Password</label>
                    ${textInput({
                      type: "password",
                      name: "password",
                      id: "password",
                      placeholder: "••••••••",
                      required: true,
                      autocomplete: "new-password",
                      error: errors.password,
                    })}
                    ${hint("At least 8 characters.")}
                    ${inputError(errors.password)}
                </div>

                <div>
                    <label for="password_confirmation" class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">Confirm password</label>
                    ${textInput({
                      type: "password",
                      name: "password_confirmation",
                      id: "password_confirmation",
                      placeholder: "••••••••",
                      required: true,
                      autocomplete: "new-password",
                      error: errors.password_confirmation,
                    })}
                    ${hint("Repeat the password exactly.")}
                    ${inputError(errors.password_confirmation)}
                </div>

                ${button(
                  `Create account
                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>`,
                  { type: "submit", class: "w-full" }
                )}
            </form>

            <div class="mt-6 border-t border-white/5 pt-6 text-center">
                <p class="text-sm text-slate-400">
                    Already have an account?
                    <a href="/login" class="font-semibold text-cyan-300 transition-colors hover:text-cyan-200">Log in</a>
                </p>
            </div>
        </div>
    </div>
</div>`;

  return layout({ title: "Create account — QuoteIt", csrf, user, content });
};

export const editPage = (
  quote: { id: number; content: string },
  { user, csrf, flash }: PageOptions
): string => {
  const errors = flash.errors ?? {};
  const value = flash.old?.content ?? quote.content;
  const hasErrors = Boolean(Object.keys(errors).length);

  const content = `<div class="mx-auto flex w-full max-w-6xl items-center justify-center px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
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

            ${
              hasErrors
                ? `<div class="mt-6">
                    ${alert("error", "Your changes could not be saved. Please fix the highlighted field.")}
                </div>`
                : ""
            }

            <form action="/quotes/${quote.id}" method="POST" class="mt-6 space-y-5">
                ${csrfField(csrf)}
                <input type="hidden" name="_method" value="PUT">

                <div>
                    <label for="content" class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">Quote</label>
                    ${textarea({
                      name: "content",
                      id: "content",
                      rows: 5,
                      required: true,
                      value,
                      error: errors.content,
                    })}
                    ${hint("3-155 characters.")}
                    ${inputError(errors.content)}
                </div>

                <div class="flex flex-col gap-3 sm:flex-row">
                    ${button("Save changes", { type: "submit", class: "flex-1" })}
                    ${button("Cancel", { href: "/", variant: "secondary", class: "flex-1" })}
                </div>
            </form>

            <div class="mt-6 border-t border-white/5 pt-5 text-center">
                <p class="text-xs leading-relaxed text-slate-400">
                    Only you can edit or delete this quote.
                </p>
            </div>
        </div>
    </div>
</div>`;

  return layout({ title: "Edit quote — QuoteIt", csrf, user, content });
};

export const errorPage = (
  code: number,
  title: string,
  message: string,
  { user, csrf }: { user: SessionUser | null; csrf: string }
): string => {
  const content = `<div class="mx-auto flex w-full max-w-6xl items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
    <div class="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/60 p-8 text-center shadow-2xl shadow-cyan-950/30 backdrop-blur-xl">
        <p class="text-5xl font-bold tracking-tight text-cyan-400">${code}</p>
        <h1 class="mt-3 text-xl font-bold tracking-tight text-white">${esc(title)}</h1>
        <p class="mt-2 text-sm leading-relaxed text-slate-400">${esc(message)}</p>
        <div class="mt-6">
            ${button("Back to quotes", { href: "/" })}
        </div>
    </div>
</div>`;

  return layout({ title: `${code} — QuoteIt`, csrf, user, content });
};
