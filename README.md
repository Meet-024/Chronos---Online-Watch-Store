# Chronos — Online Watch Store

Chronos is a premium, full-stack e-commerce web application dedicated to luxury and lifestyle watches. Built using an **ASP.NET Core Web API** (C#, Entity Framework Core, SQLite) backend and a modern **React.js** frontend, it provides a seamless shopping experience for users and a comprehensive dashboard for administrators to manage products, categories, orders, and messages.

---

## 📌 Project Overview (Resume Summary)

- **Built a full-stack shopping website** where users can browse, search, and filter watches by category, brand, and price, as well as manage their cart, wishlist, and orders.
- **Created backend APIs using ASP.NET Core and C#** with Entity Framework Core and SQLite database to handle user login, user registration, and product data.
- **Added security with JWT tokens** and created an Admin panel to let administrators add, edit, or delete products, manage categories, and view customer orders.

---

## 🚀 Features

### 🛍️ Customer Experience
- **Interactive Shop**: Browse, filter by category, brand, and price range, and search for watches.
- **Product Details**: Detailed specifications, reviews, and real-time stock availability.
- **Cart & Wishlist**: Manage items, adjust quantities, and save favorites.
- **User Dashboard**: Track orders, manage profile details, and review order histories.
- **Responsive Design**: Elegant interface optimized for desktop, tablet, and mobile devices.

### 🛡️ Admin Dashboard
- **Product Management**: Complete CRUD operations for products (including image uploading).
- **Category Management**: Organize watches by custom categories.
- **Order Management**: Track orders, view details, and update shipping/delivery status.
- **Customer Messages**: Read and manage contact queries submitted by users.

---

## 🛠️ Tech Stack

- **Frontend**: React.js, React Router, Context API, Lucide React (Icons), Vanilla CSS
- **Backend**: ASP.NET Core 10 Web API, C#, Entity Framework Core, JWT Bearer Authentication, BCrypt
- **Database**: SQLite (`chronos.db`) with automatic EF Core data seeder

---

## 📦 Getting Started

Follow these steps to set up and run Chronos locally on your system.

### Prerequisites
- [.NET 10 SDK](https://dotnet.microsoft.com/) installed
- [Node.js](https://nodejs.org/) installed

### 1. Clone & Setup Workspace
Ensure your workspace structure looks like this:
```text
chronos/
├── aspnet_backend/
├── frontend/
└── Chronos.sln
```

### 2. Run Backend API

#### Option A: Visual Studio
1. Open `Chronos.sln` in Visual Studio.
2. Select the `http` profile and press `F5` (or click Run).

#### Option B: .NET CLI
Navigate to the `aspnet_backend` folder and start the API:
```bash
cd aspnet_backend
dotnet run --launch-profile http
```
The API server will run at `http://localhost:5000`.

---

### 3. Run Frontend App

Navigate to the `frontend` folder, install dependencies, and start the development server:

```bash
cd frontend
npm install
npm run dev
```

The application will run locally at `http://localhost:3000`.

---

## 🔑 Test Accounts

- **Regular Customer**: `user@example.com` / `password123`
- **Administrator**: `admin@example.com` / `password123`
