# 🌿 PayLeaf

Simple open source payroll. Free. For everyone.

**Try it live → [payleaf.vercel.app](https://payleaf.vercel.app)**

---

## What is this?

Most payroll tools are either too expensive or built for companies with HR teams. Small businesses, shops, startups — they end up doing it manually in Excel every month.

PayLeaf fixes that. Open source, free, works for any team size.

I'm a cybersecurity engineering student and I built this because it felt like something that should exist. Built with AI assistance — because that's just how you build things now. No monetization, no premium tier, no bullshit.

---

## What it does

- Add employees with their salary details
- Every month — open their profile, fill in attendance, check what applies (overtime, bonus, deductions) and it calculates the net salary instantly
- Generate a payslip PDF
- Mark as paid, keep a history

That's it. Nothing more in V1.

---

## Stack

- Next.js — frontend and backend
- Supabase — database and auth
- Tailwind CSS — styling
- React PDF — payslip generation
- Vercel — deployment

---

## Run it locally

You need Node.js 18+ and a free Supabase account.

```bash
git clone https://github.com/yourusername/payleaf.git
cd payleaf
npm install
cp .env.example .env.local
npm run dev
```

Then open `http://localhost:3000`

Add these to your `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

---

## Contributing

PRs are open. If you find a bug or want to add something useful, just open an issue or send a PR directly.

Things that would be great to have:

- Currency selector
- Dark mode
- Better payslip design
- CSV export
- More language support

---

## Self hosting

Fork it, deploy to Vercel, connect your own Supabase project, add env vars. Done.

---

## License

MIT. Do whatever you want with it.

---

Made by [@yourusername](https://github.com/scoder0011) — cybersecurity engineering student, building in public

Star it if it's useful ⭐