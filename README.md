# Task Management System

A full-stack task management application built with React, TypeScript, and Node.js that enables users to manage their tasks with role-based access control. The system distinguishes between regular users who can manage their own tasks and administrators who have full access to all tasks in the system.

## 🚀 Features

### User Management

- User registration and authentication
- JWT-based authentication
- Role-based access control (Admin/User)
- Secure password hashing using bcrypt

### Task Management

- Create, read, update, and delete tasks
- Role-based task visibility
- Users can only view and edit their own tasks
- Admins have full access to all tasks but cannot create their own tasks.
- Task filtering and sorting capabilities

## 🛠️ Technology Stack

### Frontend

- **React** with TypeScript for UI development
- **Vite** as the build tool and development server
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Axios** for API communication
- **TailwindCSS** for styling

### Backend

- **Node.js** runtime environment
- **Express.js** web framework
- **MongoDB** with Mongoose ODM for data persistence
- **TypeScript** for type-safe development
- **JSON Web Tokens (JWT)** for authentication
- **bcrypt** for password hashing

### Development Tools

- **TypeScript** (v5.6.3) for type safety
- **Babel** for JavaScript compilation
  - @babel/core (v7.26.0)
  - @babel/preset-env
  - @babel/preset-typescript
- **Jest** and **Supertest** for testing
  - babel-jest (v29.7.0)
  - ts-jest (v29.2.5)
  - supertest (v7.0.0)
- **mongodb-memory-server** for testing
- **nodemon** for development server
- **concurrently** for running multiple scripts
- **dotenv** for environment variable management
- **CORS** for Cross-Origin Resource Sharing

## 📁 Project Structure

```
project-root/
├── client/
│   ├── src/
│   │   ├──assets/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── state/
│   │   ├──types/
│   │   └── utils/
│   ├── package.json
│   └── vite.config.ts
│
└── server/
    ├── src/
    │   ├── controllers/
    │   ├── middleware/
    │   ├── models/
    │   ├── routes/
    │   └── utils/
    ├── package.json
    └── tsconfig.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB instance
- npm or yarn package manager

### Installation

1. Clone the repository:

```bash
git clone https://github.com/littlegod20/Online_Task_Mangement_System_Frontend.git
```

2. Install backend dependencies:

```bash
cd server
npm install
```

3. Install frontend dependencies:

```bash
cd client
npm install
```

4. Create a `.env` file in the backend directory:

```env
PORT=5000
JWT_SECRET_KEY=your_jwt_secret
```

5. Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:5000/api
```

### Running the Application

1. Start the backend server:

```bash
cd server
npm run dev:build
```

2. Start the frontend development server:

```bash
cd client
npm run dev
```

The application will be available at `http://localhost:5173`

## 🔒 API Endpoints

### Authentication

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user

### Tasks

- `GET /api/tasks` - Get all tasks (admin) or user's tasks
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task
- `GET /api/tasks/:id` - Get current user's tasks

## 🔐 Security

- Password hashing using bcrypt
- JWT-based authentication
- Role-based access control
- Input validation and sanitization
- HTTP-only cookies for token storage
- CORS configuration for API security

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
