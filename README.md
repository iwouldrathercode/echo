# echo

## Deployment

### /backend - AdonisJS V6 API application

This is the boilerplate for creating an API server in AdonisJs, it comes pre-configured with.

1. Bodyparser
2. Authentication - To be replaced with [@adonisjs/ally](https://docs.adonisjs.com/guides/authentication/social-authentication)
3. CORS
4. Lucid ORM
5. Migrations and seeds

## Setup

Use the adonis command to setup and run api

#### Install deps.
```bash
cd backend
npm install
cp .env.example .env
node ace generate:key
```

> Update the `.env` file with database connection details

### Create db tables - migration
```
node ace migration:run
```

### Seed the database with dummy content
```
node ace db:seed
npm run dev
```

### /frontend - Landing page for the site for customers

To get started with this template, first install the npm dependencies:

```bash
npm install
```

Next, run the development server:

```bash
npm run dev
```

### /mobile - Placeholder for react-native project
