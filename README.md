# 🍲 Meal Pal (Meal Buddy)

A recipe-sharing web app where you can browse recipes, share your own, and leave reviews and ratings on the ones you try.

<img width="1440" height="773" alt="Screenshot 2026-09-04 at 7 21 47 PM" src="https://github.com/user-attachments/assets/91be03cd-132b-4753-b2b4-a1fa6bf002f1" />

<img width="1440" height="775" alt="Screenshot 2026-09-04 at 7 22 32 PM" src="https://github.com/user-attachments/assets/531b417f-cc90-4621-b8f0-0da3f5e7d155" />

## Features

- **Explore recipes** — browse a collection of recipes
- **Create recipes** — add your own recipes with ingredients and instructions

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 14](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| API | [Apollo Server](https://www.apollographql.com/docs/apollo-server/) (GraphQL) on Next.js route handlers |
| ORM | [Prisma](https://www.prisma.io/) |
| Database | PostgreSQL |
| Styling | Sass / SCSS Modules + Tailwind CSS |

## How It's Built

- **Frontend** (`app/(pages)`) — Next.js pages for the home, explore, and create-recipe screens, styled with SCSS Modules and Tailwind.
- **Backend** (`app/(api)`) — a GraphQL API powered by Apollo Server, exposed through a single Next.js route handler.
- **Data layer** — Prisma models (`Recipe`, `Review`) map directly onto a PostgreSQL database, with resolvers and services handling all reads/writes.

## Running It Locally

Want to try it out yourself?

**Prerequisites:** [Node.js](https://nodejs.org/en/download/current) and a local PostgreSQL database.

```bash
git clone https://github.com/rachelhlin/meal-pal.git
cd meal-pal
npm install
```

Create a `.env` file in the project root with your database connection string:

```
DATABASE_URL="postgresql://username:password@localhost:5432/db_name?schema=public"
```

Then set up the database and start the app:

```bash
npm run db:migrate
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

## License

Licensed under the [MIT License](./LICENSE).
