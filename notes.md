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
10. Whenever you want to add a schema model - make a migration

**AUTH**

/src/lib/auth
1. Generate auth secret

- you can do that using a terminal command `openssl rand ~base-64 32`
  `Base64` is a way to represent binary data (like random bytes) as plain text using only letters, numbers, +, /, and =. This makes it safe to copy/paste and store in text files or environment variables.
- `32`:
  This is the number of random bytes to generate (not the length of the final string).
  32 bytes = 256 bits (good for cryptographic secrets).
  The resulting Base64 string will be longer than 32 characters, because encoding expands the data

2. Add secret to .env
3. `JSON Web Token` https://jwt.io

- A simple safe way to transfer some data between parties formatted as a long string with 3 parts

## HEADER

- that say's it is a JWT token and what algorithm is uses

## PAYLOAD

-- use info and all the data that we want to send

## SIGNATURE

- special security hash

**AUTH FLOW**

- log in with credentials
- server checks credentials
- store token in cookie
- send it with future requests
- server verifies token to make sure it is ok and hasn't been modified

to do that we will create some low-level functions

- signAuthToken - generates, encrypt and sign token with secret
- verifyAuthToken - decrypt and verify
- setAuthCookie
- getAuthCookie
- removeAuthCookie

high level functions

- register user / add user
- login user - authenticate user with credentials, add cookie
- logout - remove token, cookie etc
- getCurrUser - get logged user
