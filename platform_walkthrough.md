# 🛒 GrocerX Platform Walkthrough

Welcome to the **GrocerX** delivery platform. This document explains the features and workflows implemented in the system.

## 🚀 1. Customer Workflow
*   **Browsing**: Customers can browse real-time products from the home page.
*   **Checkout**: Items added to the cart can be checked out by providing a delivery address.
*   **Live Tracking**: After placing an order, customers are redirected to a **Live Tracking Page** featuring:
    *   Real-time map updates via **Socket.io**.
    *   Estimated Delivery Time (30 min countdown).
    *   Dynamic Status Bar (Pending → Confirmed → Preparing → Out for Delivery → Delivered).
*   **Active Order Banner**: If a customer leaves the tracking page, a smart banner appears on the Home Page to take them back to their active delivery.

## 🛡️ 2. Admin Management (Dashboard)
Admins have full control over the platform via a premium-styled dashboard:
*   **Order Management**: View all orders, update their status, and **Assign Riders**.
*   **User Management**: Direct creation of new Riders and Admins. Promote/Demote existing users.
*   **Inventory Control**: Add new products, upload square WebP images (center-cropped), and manage stock levels.

## 🛵 3. Rider Interface
Riders have a dedicated mobile-friendly panel:
*   **Order List**: View assigned orders with full customer details.
*   **GPS Broadcasting**: When a rider starts a delivery, their location is broadcasted to the customer in real-time.
*   **One-Tap Actions**: Buttons to call the customer or mark the order as delivered.

## 🔐 4. Authentication & Security
*   **JWT & Cookies**: Secure HttpOnly cookies handle sessions.
*   **Google OAuth**: "Continue with Google" enabled (currently in Demo Mode for immediate testing).
*   **Role-Based Access**: Automatic redirects prevent users from accessing areas they aren't authorized for (e.g., Customers cannot enter the Admin panel).

---
*Created for your Viva exam preparation.*
