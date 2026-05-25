EasyGo – AI Powered Turf Booking Platform
Overview

EasyGo is a full-stack MERN application that allows users to discover sports turfs, book slots online, and make secure payments through Razorpay. The platform also includes role-based authentication for users and turf owners, along with an AI-powered recommendation system for personalized slot suggestions.

Features
User Features
User Registration & Login
JWT Authentication
Browse Available Turfs
View Turf Slots
Book Slots Online
Razorpay Payment Integration
View My Bookings
Cancel Bookings
AI Slot Recommendations
Owner Features
Owner Login
Owner Dashboard
Add New Turfs
Manage Turf Slots
View Turf Bookings
AI Features
Personalized Slot Recommendations
Booking History Based Suggestions
Smart Available Slot Recommendations
Tech Stack
Frontend
React.js
Vite
Tailwind CSS
Axios
React Router DOM
React Hot Toast
Backend
Node.js
Express.js
MongoDB
Mongoose
JWT Authentication
bcryptjs
Payment Integration
Razorpay
Deployment
Frontend: Vercel
Backend: Render
Database: MongoDB Atlas
Folder Structure
easygo/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── validators/
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   └── assets/
Installation
Clone Repository
git clone https://github.com/mekha06/turf-booking-system.git
Backend Setup
cd backend
npm install
npm run dev
Backend Environment Variables

Create .env inside backend:

PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
Frontend Setup
cd frontend
npm install
npm run dev
Frontend Environment Variables

Create .env inside frontend:

VITE_API_BASE_URL=your_backend_url
VITE_RAZORPAY_KEY_ID=your_key

API Routes
Auth Routes
POST /api/auth/register
POST /api/auth/login
Turf Routes
GET /api/turfs
POST /api/turfs
Booking Routes
POST /api/bookings
GET /api/bookings/my
PUT /api/bookings/:id/cancel
AI Recommendation Routes
GET /api/recommendations
Deployment Links
Frontend

Add your Vercel link here

Backend

Add your Render link here

Future Enhancements
Real-time slot availability
AI dynamic pricing
Chatbot assistant
Nearby turf recommendations
Email notifications
Booking analytics dashboard
Mobile responsive improvements
Author

Mekha S R

GitHub:
https://github.com/mekha06
LinkedIn:
https://www.linkedin.com/in/mekha-s-r-1930783b1/
