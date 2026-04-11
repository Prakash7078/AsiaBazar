# Asia Bazaar - Code Documentation

## 1. Repository Structure

```text
VVIT-Clubs-main/
  client/                     # React frontend (Vite)
    src/
      Components/             # Reusable UI + page-level sections
      pages/                  # Route pages (auth, product, cart, admin)
      redux/                  # Redux slices and global store
      config/                 # API URL + utility configs
      data/                   # Mock/static data used by some pages
  server/                     # Express backend
    controllers/              # Business logic by domain
    routes/                   # API route definitions
    models/                   # Mongoose schemas
    middleware/               # Auth, upload, mail, token helpers
    db/                       # Mongo connection
```

---

## 2. Runtime Architecture

## 2.1 Frontend Startup

- Entry point: `client/src/main.jsx`
- Wraps application with:
- `Provider` (Redux store)
- `ThemeProvider` (Material Tailwind)

## 2.2 App Routing

- Main router in `client/src/App.jsx`
- Admin section protected with `ProtectedAdminRoute` (checks `userInfo?.admin`)
- Stripe `Elements` wrapper used for `/checkout`

## 2.3 Backend Startup

- Entry point: `server/server.js`
- Loads environment variables
- Connects MongoDB via `connectDB`
- Registers middleware:
- `cors`
- `express.json`
- `multer` memory storage for uploads
- Registers route groups:
- `/api/auth`
- `/api/admin`
- `/api/products`
- Exposes `/create-payment-intent` for Stripe PaymentIntent creation

---

## 3. Frontend Code Documentation

## 3.1 State Management (Redux)

### Store

- File: `client/src/redux/store.js`
- Slices:
- `auth`
- `admin`
- `product`

### Auth Slice (`authSlice.js`)

**State**
- `userInfo`, `token`, `loading`, `error`

**Async actions**
- `loginUser(data)`
- `signupUser(payload)`
- `forgotPassword({email})`
- `resetPassword({password,id,token})`
- `updateRegister({user_id,formData})`
- `logoutUser()`

**Behavior**
- Persists token and user profile in localStorage.
- Uses toast notifications for success/error feedback.

### Product Slice (`productSlice.js`)

**State**
- `products`, `storeItems`, `cafeItems`, `cartItems`, `customer_orders`, `loading`, `error`

**Catalog actions**
- `getProducts()`
- `getStoreItems()`
- `getCafeItems()`
- `getProduct(id)`

**Admin product actions**
- `addProduct(formData)`
- `updateProduct({formData,productId})`
- `deleteProduct(id)`

**Cart actions**
- `getCartItems({user_id})`
- `addproducttoCart({user_id,product_id,quantity})`
- `updateCartItem({user_id,cart_item_id,quantity})`
- `deleteCartItem({user_id,cart_item_id})`
- `deleteCart(user_id)`

**Order actions**
- `placeCustomerOrder({formData,cartItems})`
- `getCustomerOrders(user_id)`

### Admin Slice (`adminSlice.js`)

**State**
- `users`, `orders`, `notifications`, `loading`, `error`

**Actions**
- `getUsers()`
- `getAllOrders()`
- `updateOrder({orderId,orderdata})`
- `addAdmin(data)` (frontend thunk exists; backend route currently not active)

---

## 3.2 Key UI Components and Pages

## Navigation and Auth

- `Components/Navbar.jsx`
- Fixed top navbar
- Login dialog integration
- Cart badge
- Admin link for admin users
- Profile and logout controls

- `pages/Login.jsx`
- Modal-friendly login form
- Dispatches `loginUser`

- `pages/Signup.jsx`
- Signup with validation for required fields and mobile length

- `pages/PasswordRequest.jsx` and `pages/ResetPassword.jsx`
- Password reset workflow UI

## Shopping Experience

- `Home.jsx`
- Entry page with animated Store and Cafe CTA

- `Components/Store.jsx`
- Wrapper page for grocery section
- Renders `Categories`, `Contact`, `Footer`

- `Components/Categories.jsx`
- Grocery listing
- Search and category filters
- discount / in-stock / out-of-stock toggles
- Product card rendering and add-to-cart logic

- `Components/Cafe.jsx`
- Wrapper for cafe section
- Renders `CafeItems`, `SpecialOrder`, `Contact`, `Footer`

- `Components/CafeItems.jsx`
- Cafe listing with category chips and search/filter controls
- Add-to-cart and menu section integration

- `pages/ProductScreen.jsx`
- Product details, image slider, related products, add-to-cart

- `pages/CartPage.jsx`
- Cart listing, quantity updates, delete item, order summary

- `Components/Checkout.jsx`
- Multi-step checkout:
- Personal info
- Delivery type
- Address (if delivery)
- Payment method (pickup/cash/card)
- Stripe PaymentElement integration and payment confirmation

- `Components/Profile.jsx`
- User profile update
- Customer order history view

- `Components/MenuSection.jsx`
- Static visual cafe menu page

## Admin Experience

- `pages/AdminDashboard/AdminLayout.tsx`
- Sidebar + mobile drawer shell for admin routes

- `pages/AdminDashboard/AdminDashboard.jsx`
- KPI cards and recent orders table

- `pages/AdminDashboard/AdminProducts.jsx`
- Product table with filter and pagination
- Edit and soft delete actions

- `pages/AdminDashboard/Product.jsx`
- Add/update form
- Multi-image upload preview and removal
- Cafe sub-category handling in product name

- `pages/AdminDashboard/AdminOrders.jsx`
- Search/filter orders
- Expand order items
- Update order status and payment status with confirm dialog

- `pages/AdminDashboard/AdminUsers.jsx`
- User table and search

- `pages/AdminDashboard/AdminPayments.jsx`
- Payment status analytics and searchable orders table

- `pages/AdminDashboard/AdminReviews.tsx`
- Reviews dashboard based on mock data

---

## 4. Backend Code Documentation

## 4.1 Route Definitions

### Auth Routes (`server/routes/authRoutes.js`)

- `POST /api/auth/login`
- `POST /api/auth/signup`
- `POST /api/auth/forgotpassword`
- `PATCH /api/auth/resetpassword/:id/:token`
- `PATCH /api/auth/profile/:user_id` (protected)

### Product/Cart/Order Routes (`server/routes/productRoutes.js`)

- `GET /api/products/getProducts`
- `GET /api/products/getStore`
- `GET /api/products/getCafe`
- `GET /api/products/getSingleProduct/:id`
- `GET /api/products/getCartItems/:userId` (protected)
- `DELETE /api/products/deleteCart/:user_id` (protected)
- `POST /api/products/addProductCart` (protected)
- `DELETE /api/products/deleteCartItem/:user_id/:cart_item_id` (protected)
- `PUT /api/products/updateCartItem/:user_id/:cart_item_id` (protected)
- `POST /api/products/placeOrder` (protected)
- `GET /api/products/getOrders/:user_id` (protected)

### Admin Routes (`server/routes/adminRoutes.js`)

- `GET /api/admin/getUsers` (protected)
- `GET /api/admin/getOrders` (protected)
- `PUT /api/admin/updateOrder/:orderId` (protected)
- `POST /api/admin/addProduct` (protected)
- `PATCH /api/admin/updateProduct/:id` (protected)
- `DELETE /api/admin/deleteProduct/:id` (protected)

### Stripe Route (`server/server.js`)

- `POST /create-payment-intent`

---

## 4.2 Controllers and Responsibilities

### `authController.js`

- `login`
- Finds user by lowercase email
- Validates password with bcrypt
- Returns JWT token + user

- `signup`
- Prevents duplicate emails
- Hashes password
- Creates user and returns token

- `updateProfile`
- Updates profile fields by `user_id`

- `forgotPassword`
- Creates JWT reset token
- Sends reset email via Nodemailer

- `resetPassword`
- Verifies reset token
- Updates password hash

### `categoryController.js`

- Product reads:
- `getAllProducts`, `getStoreItems`, `getCafeItems`, `getSingleProduct`

- Cart operations:
- `getCartItems` (with populated product and user)
- `addProductCart` (duplicate prevention)
- `updateCartItem`
- `deleteCartItem`
- `deleteCart`

### `checkoutController.js`

- `addCustomerOrder`
- Accepts checkout form + cart snapshot
- Creates embedded order item records
- Deletes cart after successful order
- Sends order email confirmation

- `getUserOrders`
- Returns user orders with populated references

### `adminControllers.js`

- `getAllUsers`
- `addProduct` (handles multi-image S3 upload)
- `updateProduct` (merge existing + new images)
- `deleteProduct` (soft delete via `isDeleted`)
- `getAllOrders`
- `updateOrder`

---

## 4.3 Data Models

### User (`models/userModel.js`)

- `name`, `email`, `password`, `mobile_no`, `address`, `admin`, `createdAt`

### Product (`models/productModel.js`)

- `product_name`, `product_price`, `product_size`, `quantity_measure`
- `total_products`, `product_category`, `product_description`
- `product_image[]`, `isDeleted`, `outOfStock`, `discount`, `createdAt`

### CartItem (`models/cartItemModel.js`)

- `user` (ObjectId ref User)
- `product` (ObjectId ref Product)
- `quantity`, `added_at`

### Order (`models/orderModel.js`)

- `user` ref
- `items[]` embedded order items:
- `product`, `product_name`, `quantity`, `total_price`
- `total_amount`, `order_status`, `payment_status`, `payment_method`
- `updated_mobile_no`, `shipping_address`, `deliveryType`
- `createdAt`, `updatedAt`

---

## 5. Security and Middleware

- `middleware/auth.js`
- Validates bearer token
- Verifies JWT
- Protects private routes

- `middleware/utils.js`
- Token generation helper (`generateToken`)

- `middleware/uploadMiddleware.js`
- Uploads product images to AWS S3

- `middleware/sendMail.js`
- Sends password reset and order mails through SMTP

---

## 6. External Service Integrations

- **Stripe**
- Frontend uses PaymentElement via `@stripe/react-stripe-js`
- Backend creates payment intents through Stripe secret key

- **AWS S3**
- Product image upload and cloud URL storage

- **Nodemailer (Gmail SMTP)**
- Password reset email
- Order confirmation email

---

## 7. Configuration and Environment

## Client

- API base URL is currently hardcoded in:
- `client/src/config/url.js`

## Server environment variables (expected)

- `PORT`
- `MONGODB_URL`
- `JWT_SECRET`
- `STRIPE_SECRET`
- `PASS` (SMTP app password)
- `AWS_ACCOUNT_REGION`
- `AWS_ACCOUNT_ACCESS_KEY`
- `AWS_ACCOUNT_SECRET_ACCESS_KEY`
- `AWS_BUCKET_NAME`

---

## 8. Build and Run

## Frontend

```bash
cd client
npm install
npm run dev
```

## Backend

```bash
cd server
npm install
npm run dev
```

## Production build (frontend)

```bash
cd client
npm run build
```

---

## 9. Known Gaps and Code Notes

- `Contact.jsx` posts to `/api/msgs/send`, but this route is not present in current backend routes.
- Admin reviews page is mock-data based (`client/src/data/mockData.ts`), not database-driven.
- `addAdmin` thunk exists in frontend but corresponding active backend route is commented out.
- Stripe publishable key is hardcoded in frontend app config (`App.jsx`) in current state.
- Some pages still contain legacy/commented code sections, which can be cleaned in future refactor.

---

## 10. Suggested Refactor Roadmap

1. Move all API keys/URLs to env variables and remove hardcoded secrets.
2. Implement real review CRUD backend and connect AdminReviews.
3. Add tests:
- unit tests for slices/controllers
- integration tests for auth/cart/order APIs
4. Add standardized API error response contract.
5. Add role-based middleware for stricter admin-only backend routes.

---

## 11. Quick Module-to-File Mapping

- Routing shell: `client/src/App.jsx`
- Customer catalog: `client/src/Components/Categories.jsx`, `client/src/Components/CafeItems.jsx`
- Product detail: `client/src/pages/ProductScreen.jsx`
- Cart and checkout: `client/src/pages/CartPage.jsx`, `client/src/Components/Checkout.jsx`
- Profile/orders: `client/src/Components/Profile.jsx`
- Admin shell: `client/src/pages/AdminDashboard/AdminLayout.tsx`
- Admin orders: `client/src/pages/AdminDashboard/AdminOrders.jsx`
- Admin products: `client/src/pages/AdminDashboard/AdminProducts.jsx`, `client/src/pages/AdminDashboard/Product.jsx`
- API routes: `server/routes/*.js`
- Business logic: `server/controllers/*.js`
- Data schemas: `server/models/*.js`
