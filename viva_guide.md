# 🎓 GrocerX Viva Preparation Guide

Use this guide to explain the technical concepts of your project during your viva.

## 🏗️ 1. Backend: NestJS Architecture
NestJS is a progressive Node.js framework that uses **TypeScript**.
*   **Modules**: The project is organized into logical blocks (Auth, Users, Products, Orders). This makes the code **scalable** and **maintainable**.
*   **Controllers**: These define the **API Endpoints** (e.g., `GET /api/products`). They handle the incoming HTTP requests and return responses.
*   **Services**: This is where the **Business Logic** lives. For example, `OrdersService` calculates the estimated delivery time.
*   **Providers & DI**: NestJS uses **Dependency Injection**. We "inject" services into controllers so they can use their logic without needing to create new instances manually.

## 💾 2. Database: TypeORM & SQLite
*   **TypeORM**: We used an **ORM** (Object-Relational Mapper). This allows us to interact with the database using TypeScript classes (**Entities**) instead of writing raw SQL.
*   **Entities**: We defined `User`, `Order`, and `Product` entities.
*   **SQLite**: A file-based database. It's excellent for development because it requires zero configuration and stores data in a single file (`database.sqlite`).

## 🛰️ 3. Real-Time: WebSockets (Socket.io)
*   We implemented a **Tracking Gateway** in NestJS.
*   When a rider moves, they emit a `locationUpdate` event.
*   The server receives this and broadcasts it to the specific **Room** (Order ID) where the customer is listening.

## 🔒 4. Security & Auth
*   **Passport.js**: Used for the authentication strategies.
*   **JWT (JSON Web Token)**: Used to identify the logged-in user securely.
*   **Guards**: We implemented `JwtAuthGuard` and `RolesGuard`. If a user is not an Admin, the `RolesGuard` will block them from the `/admin` routes.
*   **Hashing**: We used `bcryptjs` to hash passwords before saving them, ensuring that even if the database is leaked, user passwords remain secure.

## 🎨 5. Frontend: React & Tailwind
*   **React Router**: Handles the navigation between pages.
*   **Zustand**: Used for **State Management** (storing the user session and the shopping cart).
*   **Tailwind CSS**: Used for the "Grocer Orange" premium design system.

---
**Common Viva Question:** *"Why use NestJS instead of plain Express?"*
**Your Answer:** *"NestJS provides a standardized architecture out of the box. It enforces clean code practices like Dependency Injection and Modularity, which are essential for team collaboration and long-term project maintenance."*
