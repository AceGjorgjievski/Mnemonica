# Mnemonica Trainer

A small mobile-friendly web app to practice the **Mnemonica** stack (Juan Tamariz's 52-card memorized deck order).

Two practice modes:

- **Number → Card** — you're shown a position (1–52); recall the card, then reveal to check.
- **Card → Number** — you're shown a card; recall its position, then reveal to check.

Tap **Got it** / **Missed it** to track a running score, or **Skip** to move on.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Deploy to Vercel

Push this repo to GitHub and import it at [vercel.com/new](https://vercel.com/new). No configuration needed — Vercel auto-detects Next.js.

## Stack order

The stack lives in [`lib/stack.ts`](lib/stack.ts) if you want to verify or swap it (e.g. for Aronson instead of Mnemonica).
