# Asia Bazaar - Application Documentation (Presentation Edition)

## 1. Project Overview

**Project Name:** Asia Bazaar Grocery and Cafe Ecommerce Application  
**Type:** Full-stack web application  
**Purpose:** Provide a single online platform where users can:
- browse grocery and cafe products,
- add products to cart,
- place pickup or delivery orders,
- pay online or on pickup/delivery,
- manage their profile and view order history,
- and allow admins to manage products, orders, payments, and users.

This application is designed for a real retail use case (Asia Bazaar grocery and cafe), combining customer shopping and admin operations in one system.

---

## 2. Business Problem Solved

Traditional grocery and cafe ordering often depends on in-person visits or manual phone calls. This causes:
- limited ordering convenience,
- no centralized product catalog,
- weak order tracking,
- and difficult day-to-day admin management.

This project solves that by delivering:
- a digital storefront (`/store` and `/cafe`),
- a structured checkout with delivery/payment options,
- and an admin dashboard for complete order/product operations.

---

## 3. Main Application Modules

### 3.1 Customer Module

- User registration and login
- Password reset (email link flow)
- Home page with Store and Cafe entry points
- Grocery catalog with category/search/stock/discount filters
- Cafe catalog with menu-section filtering
- Product details and related products
- Shopping cart management
- Multi-step checkout
- Stripe card payment support
- Pickup / delivery order options
- User profile update
- User order history with status/payment visibility

### 3.2 Admin Module

- Admin-only route protection (`/admin`)
- Dashboard with revenue, order, customer, and product statistics
- Product CRUD (add/update/delete via soft delete)
- Order list with filters and expandable item details
- Order status and payment status updates
- Users listing and search
- Payments dashboard (status metrics and filtering)
- Reviews dashboard (currently mock-data driven)

---

## 4. Key Features Covered

## 4.1 Authentication and Authorization

- Signup and login using JWT token-based auth.
- Protected customer routes (`/mycart`, `/profile`) if user is not logged in.
- Protected admin route (`/admin`) checks `userInfo.admin`.
- Forgot password and reset password flow with email token.

## 4.2 Product Catalog

- Products are separated into:
- Store items (`product_category != "cafe"`)
- Cafe items (`product_category == "cafe"`)
- Product cards include:
- name,
- image,
- price,
- size/quantity measure,
- discount,
- stock state.

## 4.3 Cart and Checkout

- Add to cart with duplicate prevention.
- Update cart item quantity.
- Remove cart item.
- Empty cart after successful order.
- Checkout supports:
- Pickup + pay on pickup
- Delivery + cash on delivery
- Card payment via Stripe PaymentElement
- Dynamic totals with:
- tax,
- shipping,
- optional card processing fee.

## 4.4 Orders

- Order creation stores complete snapshot of ordered items.
- Customer can view all own orders in profile.
- Admin can view and update order/payment statuses.
- Order confirmation email is sent after placing order.

## 4.5 Admin Product Management

- Add product with multiple image upload (AWS S3).
- Update product fields, preserve old images, add new images.
- Soft delete products (`isDeleted = true`).
- Product fields include:
- category,
- stock,
- out-of-stock toggle,
- discount percentage,
- description.

---

## 5. Core User Flows

## 5.1 Customer Shopping Flow

1. User opens home page.
2. User navigates to Store or Cafe.
3. User searches/filters products.
4. User opens product detail page.
5. User adds product to cart.
6. User reviews cart and updates quantities.
7. User goes to checkout.
8. User selects delivery type and payment method.
9. Order is placed successfully.
10. User sees order in profile history.

## 5.2 Password Reset Flow

1. User opens forgot password page.
2. User submits registered email.
3. Backend sends reset email with tokenized URL.
4. User opens link and sets new password.
5. User logs in with updated password.

## 5.3 Admin Order Management Flow

1. Admin logs in and opens `/admin`.
2. Admin views pending/processing/shipped/delivered orders.
3. Admin filters by status/payment/search.
4. Admin updates order status and payment status.
5. Changes are persisted via API and reflected in dashboard.

---

## 6. Pages and Route Map

### Public / Customer

- `/` - Home
- `/signup` - Signup
- `/login` - Login
- `/passwordrequest` - Forgot password
- `/reset-password/:id/:token` - Reset password
- `/store` - Grocery storefront
- `/cafe` - Cafe storefront
- `/menu` - Cafe menu image section
- `/product/:productId` - Product detail
- `/mycart` - Cart (protected)
- `/checkout` - Checkout
- `/profile` - User profile and order history (protected)

### Admin

- `/admin` - Dashboard (protected, admin only)
- `/admin/products` - Product listing
- `/admin/addProduct` - Add product
- `/admin/updateProduct/:productId` - Update product
- `/admin/users` - User management
- `/admin/orders` - Order management
- `/admin/payments` - Payments dashboard
- `/admin/reviews` - Reviews dashboard (mock-data)

---

## 7. Technology Stack

### Frontend

- React + Vite
- Redux Toolkit for state management
- React Router
- Material Tailwind + Tailwind CSS
- Framer Motion + Swiper/Slick for UI interactions
- Stripe React SDK (PaymentElement)
- Axios for API integration
- React Toastify for notifications

### Backend

- Node.js + Express
- MongoDB + Mongoose
- JWT-based auth
- bcrypt/bcryptjs for password hashing
- Multer for file upload handling
- AWS S3 SDK for product image storage
- Nodemailer for password reset and order emails
- Stripe server SDK for payment intent creation

### Deployment

- Frontend hosted on Vercel
- Backend hosted on Vercel
- MongoDB Atlas for database

---

## 8. Data and Domain Concepts

### Users

- Basic profile data
- Admin flag
- Authentication credentials

### Products

- Price, size, quantity measure
- Category (store/cafe categories)
- Stock and discount controls
- Multiple images
- Soft-delete support

### Cart Items

- User-product relation
- Quantity

### Orders

- Embedded order item snapshots
- Payment and delivery metadata
- Order/payment statuses
- Shipping/pickup details

---

## 9. Application Strengths

- Complete user journey from discovery to checkout.
- Real payment integration with Stripe.
- Practical admin operations for real store usage.
- Product image cloud upload via AWS S3.
- Email-enabled workflows (password reset, order confirmation).
- Mobile-friendly UI across customer and admin pages.

---

## 10. Current Limitations / Improvement Areas

- Review module is currently based on local mock data (not DB-backed yet).
- Some UI actions in admin user/review pages are placeholder actions.
- Contact form posts to `/api/msgs/send` but no matching backend route exists in current server routes.
- No role-based granular permissions beyond `admin` boolean.
- No automated test suite configured yet.
- Client currently references production API URL in `client/src/config/url.js`.

---

## 11. Future Enhancements

- Real review/ratings backend integration.
- Coupon and loyalty points system.
- Real-time order notifications (Socket.IO).
- Sales analytics charts with date-range export.
- Inventory threshold alerts and low-stock automation.
- Multi-address customer profiles.
- Delivery slot scheduling.
- CI/CD and automated testing pipeline.

---

