# 🧘 Fitify - Fitness Tracker Frontend

Welcome to the **frontend** of the Fitify Fitness Tracker Web App! This project is built with **React**, **Tailwind CSS**, **DaisyUI**, **React Router**, and **TanStack Query**, and supports three types of users: **Member**, **Trainer**, and **Admin**.

- here is the live link to explore.
  https://fitify-5fe13.web.app/

---

## 🚀 Features

- 🔐 User authentication with role-based access
- 🧍 Member dashboard (booking, trainer reviews, etc.)
- 🏋️ Trainer dashboard (slot management, class assignment)
- 👑 Admin dashboard (user & trainer management, stats)
- 🔎 Class search by name or category
- 📅 Real-time booking system
- 💳 Stripe payment integration
- 📊 Dynamic dashboard based on role
- ✅ SweetAlert2 popup modals for better UX

---

## 📁 Project Structure

src/
├── components/ → Reusable UI components
├── pages/ → All route-based pages
├── layouts/ → Layout wrappers like MainLayout, DashboardLayout
├── hooks/ → Custom hooks (e.g. useAuth, useAxios)
├── routes/ → React Router configs
├── context/ → Authentication Provider
├── assets/ → Icons & images
├── App.jsx → Main app entry
└── main.jsx → React DOM entry point

---

## 🛠️ Tech Stack

| Tech                      | Description                                |
| ------------------------- | ------------------------------------------ |
| React.js                  | Frontend JavaScript library                |
| Tailwind CSS              | Utility-first CSS framework                |
| DaisyUI                   | Ready-made UI components for Tailwind      |
| React Router DOM          | Single Page Application (SPA) routing      |
| TanStack Query            | Server state & caching for API data        |
| Axios                     | HTTP client for API calls                  |
| SweetAlert2               | Beautiful modals and alerts                |
| Stripe.js                 | Secure online payment integration          |
| Firebase                  | Authentication and user management         |
| dotenv                    | Environment variable management            |
| react-helmet-async        | SEO and dynamic document head control      |
| react-hot-toast           | Toast notifications for better UX          |
| react-select              | Custom dropdown/select component           |
| react-hook-form           | Easy and performant form management        |
| Recharts                  | Customizable charts and data visualization |
| react-slick               | Carousel/slider component                  |
| slick-carousel            | CSS dependency for react-slick             |
| react-responsive-carousel | Responsive image/content slider            |
| Google Font (Outfit)      | Clean and modern typography                |

🔑 Authentication & Roles

- User authentication handled via Firebase (Email/Password)
- After login, user role is fetched from backend
- Role-based conditional rendering:
- member → MemberDashboard
- trainer → TrainerDashboard
- admin → AdminDashboard
- Unknown → ForbiddenPage

🔍 Search System (All Classes Page)

- Users can search classes by:

- Class Name
- Category (e.g. Yoga, Zumba)
- Backend handles case-insensitive filtering
- Uses pagination with search

📊 Dashboard Overview (Role-Based)
👤 MemberDashboard

- Welcome message & quote
- Today's new classes & forums
- Booked trainer info & reviews
- Quick links + quote submission

🏋️ TrainerDashboard

- Slot management
- Class assignment
- Earnings summary
- Review insights

👑 AdminDashboard

- Total users, trainers, classes
- Trainer status (pending/approved)
- Forum stats
- Recent activities
- Income stats (today + total)

🙌 Credits
Made with ❤️ by Rejaul Karim (Fitify Assignment Project)

📧 Email: questcoderull@gmail.com
🌐 Portfolio: (https://github.com/questcoderull)
