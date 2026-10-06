# Portfolio CMS

A modern, premium, full-stack developer portfolio website with a custom CMS built from scratch.

## Project Structure
- `frontend/` - React, TypeScript, Vite, Tailwind CSS (Public Portfolio)
- `admin/` - React, TypeScript, Vite, Tailwind CSS (Custom CMS)
- `backend/` - Node.js, Express, TypeScript, MySQL (API & Database)

## Setup Instructions

### 1. Database (MySQL)
1. Install MySQL and ensure it is running on your machine.
2. Create a new database named `portfolio_cms`.
   ```sql
   CREATE DATABASE portfolio_cms;
   ```
3. Inside `backend/.env`, configure your database credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=portfolio_cms
   ```

### 2. Installation
Run the following from the root directory to install all dependencies:
```bash
npm run install:all
```

### 3. Migrations & Seeding (Backend)
Navigate to the `backend/` directory:
```bash
cd backend
npm run migrate
npm run seed
```

### 4. Running the Application
From the root directory, you can start the services concurrently, or in separate terminals:

**Terminal 1 (Backend):**
```bash
npm run dev:backend
```
**Terminal 2 (Frontend):**
```bash
npm run dev:frontend
```
**Terminal 3 (Admin):**
```bash
npm run dev:admin
```

## Environment Variables
Ensure `.env` files are set up in `backend`, `frontend`, and `admin` according to the `.env.example` templates provided in those directories.

## Deployment
- **Backend:** Deploy on VPS, Render, or Railway with a MySQL database. Ensure you set production environment variables.
- **Frontend/Admin:** Can be statically hosted on Vercel or Netlify. Build using `npm run build` in their respective directories.

## Admin Credentials
By default, the admin credentials are set via environment variables during seeding:
- **Email:** admin@example.com (or whatever is in `ADMIN_EMAIL`)
- **Password:** securepassword123 (or whatever is in `ADMIN_PASSWORD`)
