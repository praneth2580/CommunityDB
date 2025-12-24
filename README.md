# 🌐 CommunityDB

A modern community management application built with React, TypeScript, and Supabase. Manage community members, volunteers, activities, and analytics through a beautiful admin dashboard.

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge)](https://praneth2580.github.io/CommunityDB)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?style=flat-square&logo=vite)](https://vite.dev)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3FCF8E?style=flat-square&logo=supabase)](https://supabase.com)

## ✨ Features

- **👥 People Management** - Add, edit, and manage community members
- **🙋 Volunteer Tracking** - Track and manage volunteers
- **📊 Analytics Dashboard** - Visualize community statistics
- **🔐 Role-Based Access** - Super Admin, Admin, and Volunteer roles
- **🌓 Dark Mode** - Toggle between light and dark themes
- **📱 Responsive Design** - Works on desktop and mobile

## 🛠️ Tech Stack

| Frontend       | Backend            | Styling        |
| -------------- | ------------------ | -------------- |
| React 19       | Supabase           | Tailwind CSS 4 |
| TypeScript     | PostgreSQL         | Lucide Icons   |
| Redux Toolkit  | Row Level Security |                |
| React Router 7 |                    |                |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/praneth2580/CommunityDB.git
   cd CommunityDB
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up the database**
   
   Run the SQL scripts in your Supabase SQL editor:
   - `supabase_schema.sql` - Creates tables, RLS policies, and functions
   - `seed.sql` - (Optional) Seeds sample data

5. **Start the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:5173/CommunityDB/](http://localhost:5173/CommunityDB/) in your browser.

## 📂 Project Structure

```
src/
├── components/     # Reusable UI components
├── layouts/        # Page layout wrappers
├── lib/            # Supabase client configuration
├── models/         # Data models and API functions
├── pages/
│   ├── admin/      # Admin dashboard pages
│   ├── auth/       # Authentication pages
│   └── landing/    # Public landing pages
├── store/          # Redux store and slices
├── App.tsx         # Main application with routing
└── main.tsx        # Application entry point
```

## 📜 Available Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start development server |
| `npm run build`   | Build for production     |
| `npm run preview` | Preview production build |
| `npm run lint`    | Run ESLint               |
| `npm run deploy`  | Deploy to GitHub Pages   |

## 🌐 Deployment

The app is deployed to GitHub Pages. To deploy your own version:

```bash
npm run deploy
```

This builds the app and publishes it to the `gh-pages` branch.

**Live URL:** [https://praneth2580.github.io/CommunityDB](https://praneth2580.github.io/CommunityDB)

## 🔒 Authentication

The app uses Supabase Auth with role-based access control:

| Role            | Permissions                    |
| --------------- | ------------------------------ |
| **Super Admin** | Full access, can manage admins |
| **Admin**       | Manage people and volunteers   |
| **Volunteer**   | Limited view access            |

## 📄 License

This project is private and not licensed for public use.

---

<p align="center">
  Made with ❤️ using React + TypeScript + Supabase
</p>
