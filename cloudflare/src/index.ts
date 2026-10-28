// QuoteIt — Cloudflare Worker port of the Laravel application.
import {
  editPage,
  errorPage,
  esc,
  homePage,
  loginPage,
  signupPage,
  type FlashState,
  type QuoteRow,
  type SessionUser,
} from "./templates";

export interface Env {
  DB: D1Database;
  SESSION_SECRET: string;
  ASSETS: Fetcher;
}

type Session = {
  uid: number;
  csrf: string;
  exp: number;
  remember?: boolean;
};

const SESSION_COOKIE = "quoteit_session";
const FLASH_COOKIE = "quoteit_flash";
const SESSION_TTL = 60 * 60 * 2; // 2 hours
const REMEMBER_TTL = 60 * 60 * 24 * 30; // 30 days
const FLASH_TTL = 120;

const encoder = new TextEncoder();

/* ------------------------------------------------------------------ */
/* encoding helpers                                                    */
/* ------------------------------------------------------------------ */

const b64url = (bytes: Uint8Array): string => {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

const fromB64url = (value: string): Uint8Array => {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((value.length + 3) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
};

const randomToken = (size = 32): string => {
  const bytes = new Uint8Array(size);
  crypto.getRandomValues(bytes);
  return b64url(bytes);
};

const hmac = async (secret: string, data: string): Promise<Uint8Array> => {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(data)));
};

const constantTimeEqual = (a: string, b: string): boolean => {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
};

const signed = async (payload: unknown, secret: string): Promise<string> => {
  const body = b64url(encoder.encode(JSON.stringify(payload)));
  const signature = b64url(await hmac(secret, body));
  return `${body}.${signature}`;
};

const unsign = async <T>(value: string | null, secret: string): Promise<T | null> => {
  if (!value) return null;
  const index = value.lastIndexOf(".");
  if (index < 1) return null;
  const body = value.slice(0, index);
  const signature = value.slice(index + 1);
  const expected = b64url(await hmac(secret, body));
  if (!constantTimeEqual(signature, expected)) return null;
  try {
    return JSON.parse(new TextDecoder().decode(fromB64url(body))) as T;
  } catch {
    return null;
  }
};

/* ------------------------------------------------------------------ */
/* cookies                                                             */
/* ------------------------------------------------------------------ */

const cookieValue = (request: Request, name: string): string | null => {
  const header = request.headers.get("Cookie");
  if (!header) return null;
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return rest.join("=");
  }
  return null;
};

const cookie = (name: string, value: string, maxAge?: number): string =>
  `${name}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax${
    maxAge === undefined ? "" : `; Max-Age=${maxAge}`
  }`;

const clearCookie = (name: string): string => `${name}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;

/* ------------------------------------------------------------------ */
/* password hashing (PBKDF2-SHA256, 10 000 iterations)                 */
/* ------------------------------------------------------------------ */

const PBKDF2_ITERATIONS = 10000;

const hashPassword = async (password: string): Promise<string> => {
  const salt = new Uint8Array(16);
  crypto.getRandomValues(salt);
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, [
    "deriveBits",
  ]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
    key,
    256
  );
  return `pbkdf2$${PBKDF2_ITERATIONS}$${b64url(salt)}$${b64url(new Uint8Array(bits))}`;
};

const verifyPassword = async (password: string, stored: string): Promise<boolean> => {
  const parts = stored.split("$");
  if (parts.length !== 4 || parts[0] !== "pbkdf2") return false;
  const iterations = Number(parts[1]);
  if (!Number.isInteger(iterations) || iterations < 1) return false;
  const salt = fromB64url(parts[2]);
  const expected = parts[3];
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, [
    "deriveBits",
  ]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations, hash: "SHA-256" },
    key,
    256
  );
  return constantTimeEqual(b64url(new Uint8Array(bits)), expected);
};

/* ------------------------------------------------------------------ */
/* validation                                                          */
/* ------------------------------------------------------------------ */

const chars = (value: string): number => Array.from(value).length;

const validEmail = (value: string): boolean =>
  /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(value) && value.length <= 255;

type Validation = { values: Record<string, string>; errors: Record<string, string> };

const validateQuote = (form: URLSearchParams): Validation => {
  const values = { content: (form.get("content") ?? "").trim() };
  const errors: Record<string, string> = {};
  const length = chars(values.content);
  if (!values.content) errors.content = "The content field is required.";
  else if (length < 3) errors.content = "The content field must be at least 3 characters.";
  else if (length > 155) errors.content = "The content field must not be greater than 155 characters.";
  return { values, errors };
};

/* ------------------------------------------------------------------ */
/* request context                                                     */
/* ------------------------------------------------------------------ */

type Context = {
  request: Request;
  env: Env;
  url: URL;
  session: Session;
  setCookies: string[];
  flash: FlashState;
  flashDirty: boolean;
};

const loadContext = async (request: Request, env: Env): Promise<Context> => {
  const url = new URL(request.url);
  const setCookies: string[] = [];

  let session = await unsign<Session>(cookieValue(request, SESSION_COOKIE), env.SESSION_SECRET);
  const now = Math.floor(Date.now() / 1000);

  if (!session || !session.exp || session.exp < now || typeof session.uid !== "number") {
    session = { uid: 0, csrf: randomToken(), exp: now + SESSION_TTL };
    setCookies.push(cookie(SESSION_COOKIE, await signed(session, env.SESSION_SECRET)));
  } else if (session.exp - now < SESSION_TTL / 2) {
    session = { ...session, exp: now + (session.remember ? REMEMBER_TTL : SESSION_TTL) };
    setCookies.push(
      cookie(
        SESSION_COOKIE,
        await signed(session, env.SESSION_SECRET),
        session.remember ? REMEMBER_TTL : undefined
      )
    );
  }
  if (!session.csrf) session.csrf = randomToken();

  const flash = (await unsign<FlashState>(cookieValue(request, FLASH_COOKIE), env.SESSION_SECRET)) ?? {};
  const flashDirty = Boolean(cookieValue(request, FLASH_COOKIE));

  return { request, env, url, session, setCookies, flash, flashDirty };
};

const currentUser = async (ctx: Context): Promise<SessionUser | null> => {
  if (!ctx.session.uid) return null;
  const row = await ctx.env.DB.prepare("SELECT id, name, email FROM users WHERE id = ?")
    .bind(ctx.session.uid)
    .first<SessionUser>();
  if (!row) {
    ctx.session.uid = 0;
    return null;
  }
  return row;
};

const respond = async (
  ctx: Context,
  body: string,
  init: { status?: number; flash?: FlashState; session?: Session; headers?: HeadersInit } = {}
): Promise<Response> => {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "text/html; charset=UTF-8");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  for (const value of ctx.setCookies) headers.append("Set-Cookie", value);

  if (init.flash) {
    headers.append(
      "Set-Cookie",
      cookie(FLASH_COOKIE, await signed(init.flash, ctx.env.SESSION_SECRET), FLASH_TTL)
    );
  } else if (ctx.flashDirty) {
    headers.append("Set-Cookie", clearCookie(FLASH_COOKIE));
  }

  if (init.session) {
    headers.append(
      "Set-Cookie",
      cookie(
        SESSION_COOKIE,
        await signed(init.session, ctx.env.SESSION_SECRET),
        init.session.remember ? REMEMBER_TTL : undefined
      )
    );
  }

  return new Response(body, { status: init.status ?? 200, headers });
};

const redirect = async (
  ctx: Context,
  location: string,
  options: { flash?: FlashState; session?: Session } = {}
): Promise<Response> => {
  const headers = new Headers({ Location: location });
  for (const value of ctx.setCookies) headers.append("Set-Cookie", value);

  if (options.flash) {
    headers.append(
      "Set-Cookie",
      cookie(FLASH_COOKIE, await signed(options.flash, ctx.env.SESSION_SECRET), FLASH_TTL)
    );
  } else if (ctx.flashDirty) {
    headers.append("Set-Cookie", clearCookie(FLASH_COOKIE));
  }

  if (options.session) {
    headers.append(
      "Set-Cookie",
      cookie(
        SESSION_COOKIE,
        await signed(options.session, ctx.env.SESSION_SECRET),
        options.session.remember ? REMEMBER_TTL : undefined
      )
    );
  }

  return new Response(null, { status: 302, headers });
};

const errorResponse = async (
  ctx: Context,
  user: SessionUser | null,
  code: number,
  title: string,
  message: string
): Promise<Response> => {
  ctx.flashDirty = false;
  return respond(ctx, errorPage(code, title, message, { user, csrf: ctx.session.csrf }), {
    status: code,
  });
};

const freshSession = (uid: number, remember: boolean): Session => ({
  uid,
  csrf: randomToken(),
  exp: Math.floor(Date.now() / 1000) + (remember ? REMEMBER_TTL : SESSION_TTL),
  remember,
});

const backTo = (request: Request, fallback = "/"): string => {
  const referer = request.headers.get("Referer");
  if (!referer) return fallback;
  try {
    const url = new URL(referer);
    const origin = new URL(request.url).origin;
    if (url.origin !== origin) return fallback;
    const target = `${url.pathname}${url.search}${url.hash}`;
    return target || fallback;
  } catch {
    return fallback;
  }
};

/* ------------------------------------------------------------------ */
/* data access                                                         */
/* ------------------------------------------------------------------ */

const listQuotes = async (db: D1Database, userId: number): Promise<QuoteRow[]> => {
  const { results } = await db
    .prepare(
      `SELECT q.id,
              q.user_id,
              q.content,
              q.created_at,
              u.name AS user_name,
              (SELECT COUNT(*) FROM quote_likes l WHERE l.quote_id = q.id) AS likes_count,
              EXISTS(SELECT 1 FROM quote_likes ml WHERE ml.quote_id = q.id AND ml.user_id = ?) AS liked
         FROM quotes q
         JOIN users u ON u.id = q.user_id
        ORDER BY q.created_at DESC`
    )
    .bind(userId)
    .all<QuoteRow>();
  return results ?? [];
};

const findQuote = (db: D1Database, id: number) =>
  db.prepare("SELECT id, user_id, content FROM quotes WHERE id = ?").bind(id).first<{
    id: number;
    user_id: number;
    content: string;
  }>();

/* ------------------------------------------------------------------ */
/* handlers                                                            */
/* ------------------------------------------------------------------ */

const handleHome = async (ctx: Context): Promise<Response> => {
  const user = await currentUser(ctx);
  const quotes = await listQuotes(ctx.env.DB, user?.id ?? 0);
  const body = homePage(quotes, { user, csrf: ctx.session.csrf, flash: ctx.flash });
  return respond(ctx, body);
};

const handleLoginPage = async (ctx: Context): Promise<Response> => {
  const user = await currentUser(ctx);
  const body = loginPage({ user, csrf: ctx.session.csrf, flash: ctx.flash });
  return respond(ctx, body);
};

const handleSignupPage = async (ctx: Context): Promise<Response> => {
  const user = await currentUser(ctx);
  const body = signupPage({ user, csrf: ctx.session.csrf, flash: ctx.flash });
  return respond(ctx, body);
};

const handleLogin = async (ctx: Context): Promise<Response> => {
  const form = new URLSearchParams(await ctx.request.text());
  const email = (form.get("email") ?? "").trim();
  const password = form.get("password") ?? "";
  const remember = form.get("remember") !== null;

  const errors: Record<string, string> = {};
  if (!email) errors.email = "The email field is required.";
  else if (!validEmail(email)) errors.email = "The email field must be a valid email address.";
  if (!password) errors.password = "The password field is required.";

  if (Object.keys(errors).length) {
    return redirect(ctx, "/login", { flash: { errors, old: { email } } });
  }

  const user = await ctx.env.DB.prepare("SELECT id, name, email, password_hash FROM users WHERE email = ?")
    .bind(email)
    .first<{ id: number; name: string; email: string; password_hash: string }>();

  const ok = user ? await verifyPassword(password, user.password_hash) : false;
  if (!user || !ok) {
    return redirect(ctx, "/login", {
      flash: { errors: { email: "The provided credentials do not match our records." }, old: { email } },
    });
  }

  return redirect(ctx, "/", { session: freshSession(user.id, remember) });
};

const handleSignup = async (ctx: Context): Promise<Response> => {
  const form = new URLSearchParams(await ctx.request.text());
  const name = (form.get("name") ?? "").trim();
  const email = (form.get("email") ?? "").trim();
  const password = form.get("password") ?? "";
  const confirmation = form.get("password_confirmation") ?? "";

  const errors: Record<string, string> = {};
  const nameLength = chars(name);
  if (!name) errors.name = "The name field is required.";
  else if (nameLength < 2) errors.name = "The name field must be at least 2 characters.";
  else if (nameLength > 50) errors.name = "The name field must not be greater than 50 characters.";

  if (!email) errors.email = "The email field is required.";
  else if (!validEmail(email)) errors.email = "The email field must be a valid email address.";
  else {
    const existing = await ctx.env.DB.prepare("SELECT id FROM users WHERE email = ?")
      .bind(email)
      .first<{ id: number }>();
    if (existing) errors.email = "The email has already been taken.";
  }

  if (!password) errors.password = "The password field is required.";
  else if (chars(password) < 8) errors.password = "The password field must be at least 8 characters.";
  else if (password !== confirmation) {
    errors.password = "The password field confirmation does not match.";
  }

  if (Object.keys(errors).length) {
    return redirect(ctx, "/signup", { flash: { errors, old: { name, email } } });
  }

  const passwordHash = await hashPassword(password);
  const inserted = await ctx.env.DB.prepare(
    "INSERT INTO users (name, email, password_hash, created_at, updated_at) VALUES (?, ?, ?, datetime('now'), datetime('now'))"
  )
    .bind(name, email, passwordHash)
    .run();

  const id = Number(inserted.meta.last_row_id ?? 0);
  return redirect(ctx, "/", { session: freshSession(id, false) });
};

const handleLogout = async (ctx: Context): Promise<Response> => {
  const response = await redirect(ctx, "/", { session: freshSession(0, false) });
  response.headers.append("Set-Cookie", clearCookie(SESSION_COOKIE));
  return response;
};

const handleStoreQuote = async (ctx: Context): Promise<Response> => {
  const user = await currentUser(ctx);
  if (!user) return redirect(ctx, "/login");

  const form = new URLSearchParams(await ctx.request.text());
  const { values, errors } = validateQuote(form);

  if (Object.keys(errors).length) {
    return redirect(ctx, "/", { flash: { errors, old: { content: values.content } } });
  }

  await ctx.env.DB.prepare(
    "INSERT INTO quotes (user_id, content, created_at, updated_at) VALUES (?, ?, datetime('now'), datetime('now'))"
  )
    .bind(user.id, values.content)
    .run();

  return redirect(ctx, "/", { flash: { status: "Quote shared successfully." } });
};

const handleEditPage = async (ctx: Context, id: number): Promise<Response> => {
  const user = await currentUser(ctx);
  if (!user) return redirect(ctx, "/login");

  const quote = await findQuote(ctx.env.DB, id);
  if (!quote) return errorResponse(ctx, user, 404, "Page not found", "The page you are looking for could not be found.");
  if (quote.user_id !== user.id) {
    return errorResponse(ctx, user, 403, "Forbidden", "You are not allowed to edit this quote.");
  }

  return respond(ctx, editPage(quote, { user, csrf: ctx.session.csrf, flash: ctx.flash }));
};

const handleUpdateQuote = async (ctx: Context, id: number): Promise<Response> => {
  const user = await currentUser(ctx);
  if (!user) return redirect(ctx, "/login");

  const quote = await findQuote(ctx.env.DB, id);
  if (!quote) return errorResponse(ctx, user, 404, "Page not found", "The page you are looking for could not be found.");
  if (quote.user_id !== user.id) {
    return errorResponse(ctx, user, 403, "Forbidden", "You are not allowed to update this quote.");
  }

  const form = new URLSearchParams(await ctx.request.text());
  const { values, errors } = validateQuote(form);

  if (Object.keys(errors).length) {
    return redirect(ctx, `/quotes/${id}/edit`, { flash: { errors, old: { content: values.content } } });
  }

  await ctx.env.DB.prepare("UPDATE quotes SET content = ?, updated_at = datetime('now') WHERE id = ?")
    .bind(values.content, id)
    .run();

  return redirect(ctx, "/", { flash: { status: "Quote updated successfully." } });
};

const handleDestroyQuote = async (ctx: Context, id: number): Promise<Response> => {
  const user = await currentUser(ctx);
  if (!user) return redirect(ctx, "/login");

  const quote = await findQuote(ctx.env.DB, id);
  if (!quote) return errorResponse(ctx, user, 404, "Page not found", "The page you are looking for could not be found.");
  if (quote.user_id !== user.id) {
    return errorResponse(ctx, user, 403, "Forbidden", "You are not allowed to delete this quote.");
  }

  await ctx.env.DB.batch([
    ctx.env.DB.prepare("DELETE FROM quote_likes WHERE quote_id = ?").bind(id),
    ctx.env.DB.prepare("DELETE FROM quotes WHERE id = ?").bind(id),
  ]);

  return redirect(ctx, "/", { flash: { status: "Quote deleted successfully." } });
};

const handleLikeQuote = async (ctx: Context, id: number): Promise<Response> => {
  const user = await currentUser(ctx);
  if (!user) return redirect(ctx, "/login");

  const quote = await findQuote(ctx.env.DB, id);
  if (!quote) return errorResponse(ctx, user, 404, "Page not found", "The page you are looking for could not be found.");

  const existing = await ctx.env.DB.prepare(
    "SELECT id FROM quote_likes WHERE quote_id = ? AND user_id = ?"
  )
    .bind(id, user.id)
    .first<{ id: number }>();

  if (existing) {
    await ctx.env.DB.prepare("DELETE FROM quote_likes WHERE id = ?").bind(existing.id).run();
  } else {
    await ctx.env.DB.prepare(
      "INSERT INTO quote_likes (quote_id, user_id, created_at) VALUES (?, ?, datetime('now'))"
    )
      .bind(id, user.id)
      .run();
  }

  return redirect(ctx, backTo(ctx.request, "/#quotes"));
};

/* ------------------------------------------------------------------ */
/* router                                                              */
/* ------------------------------------------------------------------ */

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const ctx = await loadContext(request, env);
    const { pathname } = ctx.url;
    const method = request.method.toUpperCase();

    if (method === "POST") {
      const form = new URLSearchParams(await request.clone().text());
      const token = form.get("_token") ?? request.headers.get("X-CSRF-TOKEN") ?? "";
      if (!constantTimeEqual(token, ctx.session.csrf)) {
        const user = await currentUser(ctx);
        return errorResponse(
          ctx,
          user,
          419,
          "Page expired",
          "Your session has expired. Please go back, refresh the page, and try again."
        );
      }
      const override = (form.get("_method") ?? "").toUpperCase();
      if (override) {
        return route(ctx, override, pathname, form);
      }
      return route(ctx, method, pathname, form);
    }

    return route(ctx, method, pathname, null);
  },
};

const route = async (
  ctx: Context,
  method: string,
  pathname: string,
  _form: URLSearchParams | null
): Promise<Response> => {
  const quoteMatch = pathname.match(/^\/quotes\/(\d+)(\/edit|\/like)?\/?$/);

  if (pathname === "/" || pathname === "/index.php") {
    if (method === "GET") return handleHome(ctx);
  }

  if (pathname === "/login" || pathname === "/login/") {
    if (method === "GET") return handleLoginPage(ctx);
    if (method === "POST") return handleLogin(ctx);
  }

  if (pathname === "/signup" || pathname === "/signup/") {
    if (method === "GET") return handleSignupPage(ctx);
    if (method === "POST") return handleSignup(ctx);
  }

  if (pathname === "/logout") {
    if (method === "POST") return handleLogout(ctx);
  }

  if (pathname === "/quotes" && method === "POST") {
    return handleStoreQuote(ctx);
  }

  if (quoteMatch) {
    const id = Number(quoteMatch[1]);
    const suffix = quoteMatch[2] ?? "";
    if (suffix === "/edit" && method === "GET") return handleEditPage(ctx, id);
    if (suffix === "/like" && method === "POST") return handleLikeQuote(ctx, id);
    if (suffix === "" && method === "PUT") return handleUpdateQuote(ctx, id);
    if (suffix === "" && method === "DELETE") return handleDestroyQuote(ctx, id);
  }

  const user = await currentUser(ctx);
  return errorResponse(
    ctx,
    user,
    404,
    "Page not found",
    "The page you are looking for could not be found."
  );
};

/* re-exported for potential reuse */
export { esc };
