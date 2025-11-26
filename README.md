# cap2-project


# cap2-project


# MERN App

This is a MERN stack project with **TypeScript** and **Vite**.  
The project is structured into two main folders:

- `frontend/` → React + Vite + TypeScript  
- `backend/` → Node.js + Express + MongoDB + TypeScript  

---

## Table of Contents

- [Project Setup](#project-setup)  
- [Environment Variables](#environment-variables)  
- [Running the Project](#running-the-project)  
- [API Testing](#api-testing)  
- [Notes](#notes)  

---

## Project Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd <your-project-folder>


Install dependencies

Without this, npm run dev will fail because Node can’t find the required packages.

You need to run it separately in backend/ and frontend/.




2️⃣ Environment variables

Backend .env tells the server which port to use and how to connect to MongoDB.

Frontend .env (optional) tells the frontend where the API is.

This is essential because hardcoding URLs or credentials is bad practice.

3️⃣ Run the backend

npm run dev starts the server with hot reload, so they can see changes instantly.

4️⃣ Run the frontend

npm run dev starts Vite dev server so they can view the app in the browser.

5️⃣ API Testing

This ensures the backend is working.

Simple test commands (curl or fetch) help verify the setup.

6️⃣ Notes

Ignore node_modules/ → don’t push heavy files to git.

Include .env.example → easier for others to set up.

Clarifies which stack is used for frontend and backend.












