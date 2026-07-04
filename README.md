# Chronos — Online Watch Store

Chronos is a premium, full-stack e-commerce web application dedicated to luxury and lifestyle watches. Built using the modern MERN stack (MongoDB, Express, React, Node.js), it provides a seamless shopping experience for users and a comprehensive dashboard for administrators to manage products, categories, orders, and messages.

---

## 🚀 Features

### 🛍️ Customer Experience
- **Interactive Shop**: Browse, filter by category/brand, and search for watches.
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
- **Backend**: Node.js, Express.js, JWT Authentication, Multer (File uploads)
- **Database**: MongoDB (Mongoose ODM)

---

## 📦 Getting Started

Follow these steps to set up and run Chronos locally on your system.

### Prerequisites
- [Node.js](https://nodejs.org/) installed
- [MongoDB](https://www.mongodb.com/) running locally or a MongoDB Atlas URI

### 1. Clone & Setup Workspace
Ensure your workspace structure looks like this:
```text
WatchStore/
├── backend/
└── frontend/
```

### 2. Configure Backend
Navigate to the `backend` folder and create a `.env` file (based on `.env.example`):

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` folder:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/watch_store
JWT_SECRET=supersecretwatchstorekey123
```

#### Seed Database
Populate the database with initial products, categories, and test user accounts:
```bash
npm run seed
```
*This seeds a test user (`user@example.com` / `password123`) and an admin user (`admin@example.com` / `password123`).*

#### Start Backend Server
```bash
npm start
```
The API server will run at `http://localhost:5000`.

---

### 3. Configure Frontend
Navigate to the `frontend` folder, install dependencies, and start the development server:

```bash
cd ../frontend
npm install
npm run dev
```

The application will run locally at `http://localhost:3000/`.

---

## 🏗️ Production Build
To generate a production-ready build of the frontend application:
```bash
cd frontend
npm run build
```
This compiles the assets into a high-performance `dist` directory using Vite.
