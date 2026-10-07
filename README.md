# 🍲 Meal Pal (Meal Buddy)

A recipe-sharing web app where you can browse recipes, share your own, and leave reviews and ratings on the ones you try.

<img width="1440" height="773" alt="Screenshot 2026-09-04 at 7 21 47 PM" src="https://github.com/user-attachments/assets/91be03cd-132b-4753-b2b4-a1fa6bf002f1" />

<img width="1440" height="775" alt="Screenshot 2026-09-04 at 7 22 32 PM" src="https://github.com/user-attachments/assets/531b417f-cc90-4621-b8f0-0da3f5e7d155" />

## Features

- **Browse & search** recipes, with average star ratings and review counts
- **Sign in with GitHub** (Better Auth); anyone can browse, signing in is needed to post
- **Create, edit and delete** your own recipes (ownership enforced on the server)
- **Rate and review** recipes (one review per user per recipe) and delete your own reviews
- Ingredients and instructions render as real lists and numbered steps

## Tech Stack

| Layer     | Technology                                                                                             |
| --------- | ------------------------------------------------------------------------------------------------------ |
| Framework | [Next.js 14](https://nextjs.org/) (App Router, server components + server actions)                     |
| Language  | TypeScript                                                                                             |
| API       | [Apollo Server](https://www.apollographql.com/docs/apollo-server/) (GraphQL) on Next.js route handlers |
| Auth      | [Better Auth](https://better-auth.com/) with GitHub OAuth, database-backed sessions                    |
| ORM       | [Prisma](https://www.prisma.io/)                                                                       |
| Database  | PostgreSQL (Supabase)                                                                                  |
| Styling   | Sass / SCSS Modules                                                                                    |

## How It's Built

- **Pages** (`app/(pages)`) are server components that fetch data through GraphQL; forms use server actions with inline validation errors.
- **API** (`app/(api)`) is a GraphQL schema with resolvers → services → Prisma. Inputs are validated server-side (lengths, 1-5 ratings, valid ids).
- **Auth**: the GraphQL context reads the session cookie, so a user's identity comes from the server and can't be spoofed by a client. Mutations that create content require sign-in, and update/delete check that the caller owns the record.
- **Data**: Prisma models for `Recipe`, `Review`, and Better Auth's `User`/`Session`/`Account`/`Verification`.

## Running It Locally

**Prerequisites:** Node.js, a PostgreSQL database (e.g. a free [Supabase](https://supabase.com) project, using its *Session pooler* connection string), and a GitHub OAuth app.

1. Clone and install:

   ```
   git clone https://github.com/rachelhlin/meal-pal.git
   cd meal-pal
   npm install
   ```

2. Create a GitHub OAuth app at <https://github.com/settings/developers> with homepage `http://localhost:3000` and callback URL `http://localhost:3000/api/auth/callback/github`.

3. Copy `.env.example` to `.env` and fill in the values (database URL, a secret from `openssl rand -base64 32`, and the GitHub client id/secret).

4. Set up the database and start the app:

   ```
   npm run db:migrate
   npm run dev
   ```

Visit <http://localhost:3000>.

## License

Licensed under the [MIT License](LICENSE).
