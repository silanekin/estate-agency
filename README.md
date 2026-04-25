# Estate Agency Transaction Management System

A full-stack application for managing real estate transactions and commission distribution.

## Live URLs

- Frontend: https://estate-agency-git-main-silanekins-projects.vercel.app
- Backend: - Backend: - Backend: https://estate-agency-wmjq.onrender.com

## Tech Stack

- **Backend**: NestJS, TypeScript, MongoDB Atlas, Mongoose
- **Frontend**: Nuxt 3, Pinia, Tailwind CSS
- **Testing**: Jest

## Getting Started

### Requirements

- Node.js v20+
- npm

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:
MONGODB_URI=your_mongodb_atlas_connection_string

Start the development server:

```bash
npm run start:dev
```

Backend runs on http://localhost:3002

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on http://localhost:3000

### Running Tests

```bash
cd backend
npm run test
```

## API Endpoints

### Agents
GET    /agents          List all agents
POST   /agents          Create a new agent
GET    /agents/:id      Get a single agent

### Transactions
GET    /transactions              List all transactions
POST   /transactions              Create a new transaction
GET    /transactions/:id          Get a single transaction
PATCH  /transactions/:id/stage    Advance to the next stage

## Commission Rules

- 50% of the total service fee goes to the agency
- 50% goes to the agent pool
- If listing agent and selling agent are the same person, they receive 100% of the agent pool
- If they are different people, each receives 50% of the agent pool