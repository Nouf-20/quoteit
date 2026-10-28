# QuoteIt — Demo Video Script

Target length: 3–5 minutes. Record at 1280×720 or higher in a browser at
`http://127.0.0.1:8000`. Keep the database seeded (`php artisan migrate:fresh --seed`).

## Before recording

1. Start the server: `php artisan serve`.
2. Open the site in a private/incognito window (so you start as a guest).
3. Sign out of any existing session.

## Scene 1 — Guest view (0:00–0:35)

- Open the home page as a guest.
- Point out the header: `QuoteIt` brand, **LOG IN** and **SIGN UP** buttons.
- Scroll through the Quotes List and show that each card contains:
  quote text, author name, publication date, and like count.
- Mention that the quotes come from the database and are seeded with eight cybersecurity quotes.

## Scene 2 — Sign up (0:35–1:10)

- Click **SIGN UP**.
- Point out the hint under each field: name `2-50 characters`, valid email, password
  `At least 8 characters`, password confirmation.
- First submit invalid data (one-letter name, bad email, short password) to show inline errors.
- Then enter valid data and submit; the app logs the user in and redirects to the feed.

## Scene 3 — Share, edit, and delete a quote (1:10–2:00)

- In the share form, show the hint `3-155 characters`.
- Publish a short quote; show it at the top of the list with the author and today's date.
- Click **Edit**, change the text, and save; show the updated quote.
- Click **Delete** and confirm; show that the quote disappears.

## Scene 4 — Ownership protection (2:00–2:30)

- Log out.
- Log in as a second seeded account.
- Show that **Edit** and **Delete** appear only on that user's own quotes.
- (Optional) Open the edit URL of another user's quote to show the 403 response.

## Scene 5 — New feature: like / unlike (2:30–3:10)

- Click the heart on a quote; show the count increase and the filled heart.
- Reload the page to show the count persisted in the database.
- Click again to unlike; show the count decrease.
- Log out and show that guests see the like count but cannot toggle it.

## Scene 6 — Logout (3:10–3:25)

- Click **LOG OUT**; show the header returning to **LOG IN / SIGN UP**.

## Scene 7 — Documents and database (3:25–3:50)

- Show `docs/QuoteIt_SRS.pdf` (updated requirements, including Likes).
- Show `docs/QuoteIt_ERD.pdf` (users, quotes, quote_likes and relationships).
- (Optional) Open the SQLite database or run `php artisan db:show` to show the tables.

## Closing

- Mention that demo credentials are available on request.
- Upload the video to Google Drive, set sharing to “Anyone with the link”, and attach the link
  to the Pathy submission.
