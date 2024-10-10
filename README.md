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

One must first set up a database. This application uses Supabase.

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

## TODO

1. Document database setup (or write a script to do it automatically).
2. Document environment variables.
3. Document the technology.