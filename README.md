# ImpactRise

ImpactRise is a Next.js 14 crowdfunding platform for campaigns, seminars, and workshops. It now uses PostgreSQL through Prisma for users, initiatives, and donations.

## Stack

- Next.js 14
- React 18
- Tailwind CSS
- Prisma ORM
- PostgreSQL

## Main Features

- Public campaign, seminar, and workshop pages
- Registration and login
- Organizer dashboard for initiative management
- User dashboard with donation history
- Donation recording through API routes

## Important Files

- `prisma/schema.prisma`
- `prisma/seed.js`
- `src/lib/prisma.js`
- `src/lib/db.js`
- `src/app/api`
- `src/app/dashboard`

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env`:

```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/impactrise?schema=public"
```

3. Generate Prisma client:

```bash
npm run db:generate
```

4. Run migrations:

```bash
npm run db:migrate -- --name init
```

5. Seed sample data:

```bash
npm run db:seed
```

6. Start development server:

```bash
npm run dev
```

## Useful Commands

- `npm run dev`
- `npm run build`
- `npm start`
- `npm run db:generate`
- `npm run db:migrate -- --name init`
- `npm run db:push`
- `npm run db:seed`
- `npm run db:studio`

## Default Seeded Accounts

- `admin@impactrise.org` / `admin123`
- `organizer1@gmail.com` / `123456`
- `donor1@gmail.com` / `123456`

## Notes

- Passwords are still stored as plain text and should be hashed before production.
