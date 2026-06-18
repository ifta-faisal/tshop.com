# 🛒 RoboXpressBD

A full-stack e-commerce platform for electronics, robotics, and DIY components, built as a TechShopBD-style clone for the Bangladeshi market.

- **Frontend:** React 18 + Vite + Tailwind CSS
- **Backend:** Spring Boot 3.2 (Java 17) + Spring Security + JPA
- **Database:** MySQL 8

---

## ✨ Features

- 🔐 JWT-based authentication (signup / login / persistent session)
- 🏠 Home page with hero carousel, featured / new / trending / back-in-stock rails, and category tiles
- 🔎 Search, filter (category, brand), and sort (newest, price asc/desc, name)
- 🛍️ Product detail with image, description, specs, stock indicator, and qty selector
- 🧺 Cart (add / update / remove / clear), live subtotal
- 💵 Checkout (Cash on Delivery, bKash, Nagad) with order placement
- 📦 My Orders + order detail page
- 👤 Account page with profile editing and order history
- 💱 BDT currency formatting throughout (৳)

---

## 📁 Project structure

```
E-Com/
├── roboxpressbd-backend/      # Spring Boot API
│   ├── pom.xml
│   └── src/main/...
├── roboxpressbd-frontend/     # React SPA
│   ├── package.json
│   └── src/...
├── database/
│   └── schema.sql             # MySQL schema + seed data
└── README.md
```

---

## ✅ Prerequisites

| Tool    | Version | Notes                              |
|---------|---------|------------------------------------|
| Node.js | 18+     | for the frontend (you have v24 ✅) |
| Java    | 17+     | for the backend                    |
| Maven   | 3.8+    | for the backend                    |
| MySQL   | 8.x     | for the database                   |

Verify:

```powershell
node --version
java -version
mvn -v
mysql --version
```

---

## 🗄️ 1. Set up the database

1. Start MySQL.
2. From the project root, run the schema (creates the `roboxpressbd` database, tables, and seed data):

```powershell
mysql -u root -p < database\schema.sql
```

### 🔐 About the seeded admin password

`database/schema.sql` ships a demo admin (`admin@roboxpressbd.com` / `admin123`) with a **placeholder** BCrypt hash. To set a real working password:

**Option A — use the signup endpoint** (easiest):

```powershell
curl -X POST http://localhost:8080/api/auth/signup `
  -H "Content-Type: application/json" `
  -d "{\"fullName\":\"Site Admin\",\"email\":\"admin@roboxpressbd.com\",\"password\":\"YourRealPassword\",\"phone\":\"+8801700000000\"}"
```

Then promote to admin in MySQL:

```sql
INSERT IGNORE INTO user_roles (user_id, role)
SELECT id, 'ROLE_ADMIN' FROM users WHERE email = 'admin@roboxpressbd.com';
```

**Option B — generate a real BCrypt hash** (replace the placeholder hash in the SQL with the new one). A quick way: run a tiny Java/Python snippet using `BCryptPasswordEncoder` or `bcrypt` lib.

---

## ⚙️ 2. Configure the backend

`roboxpressbd-backend/src/main/resources/application.yml` reads the following (override via **environment variables** in production):

| Env var       | Default              | Purpose                          |
|---------------|----------------------|----------------------------------|
| `DB_USER`     | `root`               | MySQL user                       |
| `DB_PASS`     | *(empty)*            | MySQL password                   |
| `JWT_SECRET`  | *(dev default)*      | HMAC-SHA secret (≥ 256 bits)     |

You can also edit the file directly for local dev.

---

## 🚀 3. Run the backend

```powershell
cd roboxpressbd-backend
mvn spring-boot:run
```

API will be at **http://localhost:8080/api** (Swagger-style endpoints listed below).

### Available endpoints

| Method | Path                                  | Auth         | Description                  |
|--------|---------------------------------------|--------------|------------------------------|
| POST   | `/api/auth/signup`                    | public       | Register                     |
| POST   | `/api/auth/login`                     | public       | Login → JWT                  |
| GET    | `/api/products`                       | public       | List, supports `?q&category&brand&sort&page&size` |
| GET    | `/api/products/{slug}`                | public       | Product detail               |
| GET    | `/api/categories`                     | public       | All categories               |
| GET    | `/api/brands`                         | public       | All brands                   |
| GET    | `/api/banners?placement=HERO`         | public       | Active banners               |
| GET    | `/api/products/featured`              | public       | Featured                     |
| GET    | `/api/products/new-arrivals`          | public       | New arrivals                 |
| GET    | `/api/products/trending`              | public       | Trending                     |
| GET    | `/api/products/back-in-stock`         | public       | Back in stock                |
| GET    | `/api/cart`                           | user         | Current cart                 |
| POST   | `/api/cart/items`                     | user         | Add item                     |
| PUT    | `/api/cart/items/{productId}`         | user         | Update qty                   |
| DELETE | `/api/cart/items/{productId}`         | user         | Remove item                  |
| DELETE | `/api/cart`                           | user         | Clear cart                   |
| POST   | `/api/orders/checkout`                | user         | Place order                  |
| GET    | `/api/orders`                         | user         | My orders                    |
| GET    | `/api/orders/{orderNumber}`           | user         | Order detail                 |
| GET    | `/api/account/me`                     | user         | My profile                   |
| PUT    | `/api/account/me`                     | user         | Update profile               |
| GET    | `/api/admin/**`                       | admin        | *(reserved for future)*      |

---

## 🖥️ 4. Run the frontend

```powershell
cd roboxpressbd-frontend
npm install
npm run dev
```

Frontend will be at **http://localhost:5173**. The Vite dev server proxies `/api/*` to `http://localhost:8080` (configured in `vite.config.js`) — no CORS gymnastics needed during dev.

Build for production:

```powershell
npm run build
npm run preview
```

---

## 🧪 Smoke test

1. Open http://localhost:5173
2. Click **Sign Up**, create an account
3. Browse → add a few products to cart
4. **Cart** → **Checkout** → place an order
5. **Account** → see the new order in history
6. Refresh — your session persists via JWT in `localStorage` (`rx_token` / `rx_user`)

---

## 🛠️ Tech notes

- **JWT** uses JJWT 0.12.5 with HMAC-SHA-256 and a 7-day expiry by default
- **Passwords** are stored as BCrypt hashes (Spring Security default)
- **Sessions** are stateless — the API uses `Authorization: Bearer <token>` for everything authenticated
- **CORS** is pre-configured for `http://localhost:5173` and `http://localhost:3000`
- **Stock** is decremented transactionally when an order is placed; if stock is insufficient the checkout fails with a clear error
- **Order numbers** are generated as `RX-XXXXXXXX` (uppercase, first 8 chars of a UUID)

---

## 📜 License

MIT — clone, modify, and ship.
