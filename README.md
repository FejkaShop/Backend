# Backend Application for ZPSWI Project

- Author: Pavel Mikula (MIK0486)


## Instalation

Start database server

```bash
docker-compose up
```

Start express server

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

## API Examples
```json
{
  "limit": 10,
  "offset": 0,
  "totalEntries": 2,
  "hasMoreEntries": false,
  "entries": [
    {
      "id": 1,
      "name": "T-shirt",
      "description": "Comfortable cotton T-shirt",
      "price": 19.99,
      "stock": 100,
      "categoryId": 2,
      "images": [
        "tshirt1.jpg",
        "tshirt2.jpg"
      ],
      "createdAt": "2024-10-19T16:23:36.889Z",
      "updatedAt": "2024-10-19T16:23:36.889Z",
      "category": {
        "id": 2,
        "name": "Clothing",
        "description": "Apparel and accessories"
      }
    },
    ...
  ]
}
```