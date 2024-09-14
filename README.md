# React Todo App with Authentication

A feature-rich todo application built with React, featuring user authentication and database integration.

## Features

- User Authentication
  - Sign-up page for new users
  - Sign-in page for existing users
- Todo Management
  - Add new todos
  - Update existing todos
  - Delete todos
  - Mark todos as done/undone
- Timer Alert (optional feature)
- Database Integration using Prisma with PostgreSQL

## Tech Stack

- Frontend: React
- Backend: Node.js with Express (assumed)
- Database: PostgreSQL
- ORM: Prisma
- Authentication: JSON Web Tokens (JWT) (assumed)

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or later)
- npm or yarn
- PostgreSQL

## Setup and Installation

1. Clone the repository:
   ```
   git clone https://github.com/preeeetham/react-todo.git
   cd react-todo-app
   ```

2. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

3. Set up your PostgreSQL database and update the connection string in your Prisma schema.

4. Set up Prisma:
   ```
   npx prisma generate
   npx prisma migrate dev
   ```

5. Create a `.env` file in the root directory and add your environment variables:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/your_database"
   JWT_SECRET="your_jwt_secret"
   ```

6. Start the development server:
   ```
   npm run dev
   ```
   or
   ```
   yarn dev
   ```

7. Open [http://localhost:5147](http://localhost:5147) to view the app in your browser.

## Usage

1. Sign up for a new account or sign in with existing credentials.
2. Once authenticated, you can start adding, updating, and deleting todos.
3. Mark todos as done when completed.
4. (If implemented) Set timer alerts for your todos.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

