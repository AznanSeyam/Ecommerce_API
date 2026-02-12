# Ecommerce API

A scalable and production-ready RESTful API for an e-commerce application built with NestJS. This backend system handles authentication, product management, cart operations, orders, and role-based authorization.

---

## Features

- JWT Authentication
- Role-based Authorization (User / Admin)
- Product & Category Management
- Cart Management
- Order Processing
- Secure Password Hashing
- RESTful API Structure
- Modular Architecture (NestJS)

---

## Tech Stack

- Node.js
- NestJS
- TypeScript
- PostgreSQL
- TypeORM
- JWT
- Bcrypt

---

## Installation

### Clone the repository

git clone https://github.com/AznanSeyam/Ecommerce_API.git

cd Ecommerce_API

---

## API Endpoints

### Authentication

| Method | Endpoint        | Access     | Description            |
|--------|----------------|------------|------------------------|
| POST   | /auth/register | Public     | Register new user      |
| POST   | /auth/login    | Public     | Login user             |
| GET    | /auth/profile  | Protected  | Get logged-in user     |

---

### Users

| Method | Endpoint    | Access    | Description        |
|--------|------------|-----------|--------------------|
| GET    | /users     | Admin     | Get all users      |
| GET    | /users/:id | Admin     | Get user by ID     |
| PATCH  | /users/:id | Protected | Update user        |
| DELETE | /users/:id | Admin     | Delete user        |

---

### Categories

| Method | Endpoint           | Access | Description           |
|--------|-------------------|--------|-----------------------|
| GET    | /categories       | Public | Get all categories    |
| GET    | /categories/:id   | Public | Get category by ID    |
| POST   | /categories       | Admin  | Create category       |
| PATCH  | /categories/:id   | Admin  | Update category       |
| DELETE | /categories/:id   | Admin  | Delete category       |

---

### Products

| Method | Endpoint         | Access | Description           |
|--------|-----------------|--------|-----------------------|
| GET    | /products       | Public | Get all products      |
| GET    | /products/:id   | Public | Get product by ID     |
| POST   | /products       | Admin  | Create product        |
| PATCH  | /products/:id   | Admin  | Update product        |
| DELETE | /products/:id   | Admin  | Delete product        |

---

### Cart

| Method | Endpoint            | Access    | Description          |
|--------|--------------------|-----------|----------------------|
| GET    | /cart              | Protected | Get user cart        |
| POST   | /cart/items        | Protected | Add item to cart     |
| PATCH  | /cart/items/:id    | Protected | Update cart item     |
| DELETE | /cart/items/:id    | Protected | Remove cart item     |
| DELETE | /cart/clear        | Protected | Clear cart           |

---

### Orders

| Method | Endpoint               | Access    | Description            |
|--------|-----------------------|-----------|------------------------|
| POST   | /orders               | Protected | Create order           |
| GET    | /orders               | Protected | Get user orders        |
| GET    | /orders/:id           | Protected | Get order details      |
| PATCH  | /orders/:id/status    | Admin     | Update order status    |
