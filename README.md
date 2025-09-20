# 📦 Product Service API

A REST API built with [NestJS](https://nestjs.com/) and [Prisma](https://www.prisma.io/) for product management.  
It integrates with **Contentful** for product synchronization, uses **JWT** for authentication, and supports **soft deletion**, **pagination**, and **filtering**.

---

## ✨ Features
- 🔍 **Query products** with filters (brand, category, price range, etc.)
- 📄 **Pagination** with `skip` and `take` parameters (max 5 items per page).
- 🗑️ **Soft delete**: products are excluded from queries by default if `deletedAt` is set.
- 🔑 **JWT authentication** (simple, no roles yet).
- 📚 **Swagger documentation** available at `/api/docs`.
- 🔄 **Manual synchronization** of products from Contentful (`POST /api/v1/products/sync`).
- ✅ **Testing with Jest** + coverage reports.

---

## Considerations
- I used prisma as ORM for simplicity and type safety, is the main ORM I use in my projects nowadays and i think is a great fit for this kind of project.
- Soft deletion is implemented by adding a `deletedAt` timestamp column to the `Product` model. When a product is "deleted", this field is set to the current timestamp. By default, all queries filter out products where `deletedAt` is not null.
- The includeDeleted query parameter allows clients to include soft-deleted products in their queries if needed.
- I didn't implement user management or roles for simplicity, but the JWT authentication can be easily extended to include user roles and permissions.
- I didn't implement create/update endpoints for products since the main focus is on querying, deletion, and synchronization from Contentful.
- Error handling is basic but can be extended with more specific exceptions and logging as needed.


## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) >= 18
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)  
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)

### Installation & Run
```bash
# Clone the repository
git clone <repo-url>
cd product-service

# Create the .env file
cp .env.example .env

# Start the app and PostgreSQL
docker-compose up -d --build

# View logs
docker-compose logs -f app

# Stop services
docker-compose down

# Stop services and remove volumes
docker-compose down -v

# Access the API
http://localhost:3000/api/v1/products

# Access Swagger documentation
http://localhost:3000/api/docs
```

---

### Environment Variables
- You need to set the following environment variables in a `.env` file (see `.env.example`):    

| Variable                  | Description                       | Example                                    |
| ------------------------- | --------------------------------- | ------------------------------------------ |
| `CONTENTFUL_SPACE_ID`     | Contentful space ID               | `xxxxxx`                                   |
| `CONTENTFUL_ACCESS_TOKEN` | Contentful access token           | `abc123`                                   |
| `CONTENTFUL_ENVIRONMENT`  | Contentful environment            | `master`                                   |
| `CONTENTFUL_CONTENT_TYPE` | Content type for products         | `product`                                  |
| `DATABASE_URL`            | PostgreSQL connection string      | `postgresql://user:applydigital@db:5432/applydigital` |
| `JWT_SECRET`              | Secret key for signing JWT tokens | `supersecret`                              |

---

### Authentication
- For testing private endpoints, use the hardcoded JWT token below:
```bash
npx ts-node scripts/sign-jwt.ts
```
Use the generated token in the `Authorization` header:
```Authorization
Bearer <your-token>
```
