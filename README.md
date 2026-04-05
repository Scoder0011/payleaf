# 🌿 PayLeaf

Simple open source payroll. Free. For everyone.

**Try it live → [payleaf-phi.vercel.app](https://payleaf-phi.vercel.app)**

---

## What is this?

Payroll software is either too expensive, too complex, or built only for large enterprises. Every other business — shops, startups, agencies, freelancers managing contractors — ends up doing it manually in Excel every month.

PayLeaf fixes that. It works for any business, any size, anywhere. 2 employees or 2000, the experience is the same.

I'm a cybersecurity engineering student and I built this because it felt like something that should exist and be free. Built with AI assistance. No monetization, no premium tier, no bullshit.

---

## What it does

- Add employees with their salary details
- Every month — open their profile, fill in attendance, toggle what applies (overtime, HRA, allowances, bonuses, deductions) and net salary is calculated instantly
- All deduction rates are customizable per employee — PF, ESI, TDS, Professional Tax
- Generate a payslip PDF and mark as paid
- Full payment history per employee
- Dark and light mode
- Forgot password and reset password flow
- Settings page — edit business name, change password, toggle theme

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
git clone https://github.com/Scoder0011/payleaf.git
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
- Google OAuth
- Better payslip PDF design
- CSV export
- More language support
- Mobile app

---

## Self hosting

Fork it, deploy to Vercel, connect your own Supabase project, add env vars. Done.

---

## Roadmap

- [x] V1 — Core payroll calculator + payslip generation
- [x] Dark / light mode
- [x] Settings page
- [x] Forgot password flow
- [ ] V2 — Google OAuth, currency selector, edit employee
- [ ] V3 — Compliance helpers, CSV export
- [ ] V4 — Mobile app

---

## License

MIT. Do whatever you want with it.

---

Made by [@Scoder0011](https://github.com/Scoder0011) — cybersecurity engineering student, building in public

Follow for updates → [LinkedIn](https://www.linkedin.com/in/scoder0011/)

Star it if it's useful ⭐