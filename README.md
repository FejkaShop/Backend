# Backend Application for ZPSWI Project
- Author: Pavel Mikula (MIK0486)

## Instalation
Using docker-compose // TODO: Implement
```bash
docker-compose up
```
Using npm
```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run start
```
```bash
npx prisma studio -- Use to start database browsing
npx prisma migrate reset -- Use only to reset database
```