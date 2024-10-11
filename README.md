# image-thing

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

This project was created for the [Pinata Challenge](https://dev.to/challenges/pinata); it's an app which combines
Pinata's file storage APIs with OpenAI's LLM models to provide unique features tailored towards image files.

## Technology

- Pinata
- OpenAI
- Supabase
- NextJS

## Getting Started

### Database

One must first set up a database. This application uses Supabase. A table needs to be set up with the following columns:
1. `id int8`
2. `created_at timestamptz`
3. `upload jsonb`
4. `hash text`
5. `user_id uuid`
6. `is_pinned bool`
7. `pinata_id text`
8. `pinata_cid_private text`
9. `pinata_cid_public text`

After that, policies need to be created for `SELECT`, `UPDATE`, `INSERT`, and `DELETE` to allow only authorized users
to access rows in the table. The table should have row-level security (RLS) enabled.

### Environment Variables

The following environment variables need to be created:
1. `PINATA_JWT`
2. `PINATA_GATEWAY`
3. `OPENAI_API_KEY`
4. `NEXT_PUBLIC_SUPABASE_URL`
5. `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Starting the App

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.