# 🎓 NestJS Viva Cheat Sheet: GrocerX Edition

This guide covers everything your examiner (Sir) might ask about the backend of your project.

---

## 🚀 1. What is NestJS?
**Answer:** NestJS is a progressive **Node.js framework** used for building professional, scalable server-side applications. It is built with **TypeScript** and combines elements of Object-Oriented Programming (OOP) and Functional Programming.

### Why do we use it? (The "Why" Question)
*   **Structure:** It provides a fixed architecture (Modules, Controllers, Services). In plain Express, every project is different; in NestJS, every project follows a standard.
*   **Scalability:** Its modular design makes it easy to add new features (like adding a 'Rider' module to an existing 'Grocery' app).
*   **TypeScript:** It allows us to catch bugs early using static typing.

---

## 🌟 2. Key Advantages of NestJS
1.  **Modularity:** Each feature (Auth, Products, Orders) is in its own module.
2.  **Dependency Injection (DI):** It manages how different parts of the app talk to each other, making the code cleaner and easier to test.
3.  **Built-in Features:** It comes with built-in support for Validation, Guard (Security), Interceptors, and WebSockets.
4.  **Community & Documentation:** It has excellent documentation and a massive community.

---

## 🛠️ 3. What is CRUD and Where is it Used?
**CRUD** stands for:
*   **C**reate (POST): Adding a new product or registering a user.
*   **R**ead (GET): Viewing the list of groceries or checking order history.
*   **U**pdate (PATCH/PUT): Changing a product's price or updating a user's profile.
*   **D**elete (DELETE): Removing a product from the database.

**In GrocerX:** We used CRUD in the **Admin Dashboard** to manage products, categories, and users.

---

## 💾 4. Database: Connection & Access
### How is it connected?
*   We use **TypeORM** (Object-Relational Mapper).
*   **TypeORM** acts as a bridge between our TypeScript code and the database.
*   **Database Type:** We used **SQLite** (a file-based database) for development because it is lightweight and requires no separate server setup.

### How do we access data?
1.  **Entities:** We define classes (e.g., `product.entity.ts`) that represent our tables.
2.  **Repositories:** We use the `Repository` pattern to perform actions like `this.productRepo.save(data)` or `this.productRepo.find()`.

---

## 🔄 5. How Data Flow Works (Request Lifecycle)
When a user performs an action (e.g., searches for "Apples"), the data flows like this:

1.  **Client (Frontend):** Sends an HTTP GET request to `/api/products?search=apple`.
2.  **Controller (`ProductsController`):** Receives the request and extract the search query.
3.  **Service (`ProductsService`):** The Controller calls the Service. The Service contains the **Business Logic** (e.g., "Find all available products matching this name").
4.  **Repository/Database:** The Service uses TypeORM to fetch data from `database.sqlite`.
5.  **Response:** The Service returns data to the Controller, which sends a JSON response back to the Frontend.

---

## 🛡️ 6. Common "Tricky" Questions
*   **Q: What is a Decorator?**
    *   **A:** Those things starting with `@` (like `@Controller`, `@Get`). They add metadata to our classes and methods so NestJS knows how to handle them.
*   **Q: What is Dependency Injection?**
    *   **A:** Instead of creating a new instance of a class manually (using `new Service()`), we ask NestJS to provide it for us in the constructor. This makes our code "loosely coupled."
*   **Q: What is a Guard?**
    *   **A:** It's used for security. For example, our `JwtAuthGuard` checks if a user is logged in before allowing them to see their orders.
*   **Q: What is a DTO?**
    *   **A:** Data Transfer Object. It defines the "shape" of the data coming into our API (e.g., what fields are required when creating a product).

---
**Pro Tip for Viva:** If you don't know the answer, stay calm. Say, *"I used this specific feature to ensure the project is scalable and follows industry standards."*
