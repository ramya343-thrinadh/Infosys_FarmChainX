# 📘 Project Setup Guide

This guide explains how to run the project by starting both backend and frontend servers.

---

## 🚀 Prerequisites

Make sure you have installed:
- Node.js
- npm

---

## ⚙️ Setup Instructions

### 🔹 Step 1: Install Backend Dependencies

Open terminal and run:

cd backend  
npm install  

---

### 🔹 Step 2: Start Backend Server

cd backend  
npm start  

You should see output like:

Server running on port XXXX  
Database connected  

⚠️ Keep this terminal open. Do NOT close it.

---

### 🔹 Step 3: Start Frontend (New Terminal)

Open a NEW terminal and run:

npm install   (only first time)  
npm run dev  

---

## 🔴 Important

You MUST run both servers at the same time:

Backend → npm start (inside backend folder)  
Frontend → npm run dev (inside root folder)

---

## 🌐 Run the App

Open browser and go to:

http://localhost:3000  

(or the port shown in your terminal)

---

## ❗ Troubleshooting

- Error while registering/login?
  → Make sure backend server is running  

- Backend not working?
  → Check if you are inside backend folder  

- Port already in use?
  → Stop other apps or change port  

---

## ✅ Summary

- Install backend dependencies  
- Start backend server  
- Start frontend in new terminal  
- Keep both running  
