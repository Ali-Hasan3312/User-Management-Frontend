# User Management System – Frontend

A **Next.js + TypeScript frontend** for the User Management System. Built with **React**, **Tailwind CSS**, and **Axios** for API communication with the backend.

---

## 🚀 Tech Stack

* **Next.js 16**
* **React 19**
* **TypeScript**
* **Tailwind CSS 4**
* **Axios** (API calls)
* **React Toastify** (Notifications)
* **Lucide React** (Icons)
* **Radix UI Slot** (Component composition)


```

---

## ⚙️ Environment Variables

Create a `.env` file in the root:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

> ⚠️ **Important:** Use `NEXT_PUBLIC_` prefix for variables that need to be exposed to the frontend.

---

## 📦 Installation

```bash
npm install
```

---

## 🏃 Running the Project

### Development Mode

```bash
npm run dev
```

The app will run at [http://localhost:3001](http://localhost:3001) by default (or your chosen port).

### Production Build

```bash
npm run build
npm run start
```

---

## 🔗 API Integration

* All API calls use **Axios** to connect to the backend at `NEXT_PUBLIC_API_URL`.
* Example of calling backend endpoints:

```ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const loginUser = (data: { email: string; password: string }) => {
  return api.post('/auth/login', data);
};
```

---

## 🧩 Features

* User authentication with **JWT** (token stored in memory / localStorage)
* Role-based routing (Admin / User)
* Toast notifications for success/error messages
* Responsive UI with Tailwind CSS
* Modular component structure for scalability

---

## 🛠 Scripts

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint"
}
