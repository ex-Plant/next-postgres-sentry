**USING PRISMA **

1.  npx prisma init
    Your Prisma schema was created at prisma/schema.prisma
2.  Add DATABES_URL to .env
3.  ADD your first model:
    `model Ticket {
id Int @id @default(autoincrement())
subject String
description String
priority String
status String @default("Open")
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
}`
4.  Create a migration with a name init
    `npx prisma migrate dev __name init_`

5.  run npx prisma generate to generate PRISMA CLIENT code that creates a special file in node_modules?
    @prisma/client that lets you interact with database using auto-complete, type safety and so on
    `npx generate` should be triggered always after changing anything in schema.prisma file, doing migration etc
6.  You always have to run a migration whenever you do any changes to your db schema like removing or adding a model
    (table), fields (columns)m changing filed types or constraints etc.
7.  Add `"postinstall": "prisma generate"` that will run whenever you run npm install including during deployment
    on platforms like vercel. This makes sure you are always using up to date schema and your database is in sync
    with the code
8.  You can run `npx prisma studio` to see changes instantly and easily locally play with your db
9.  Create a special file for Prisma Client when using server side rendering and serverless to avoid issues - we
    don't want a case where multiple prisma instances are created - we just need one and if there isn't one only then
    we want to create it. We do that in `db/prisma.ts`
