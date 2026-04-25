# DESIGN.md

## 1. Architecture Overview

I built a full-stack estate agency transaction management system using NestJS for the backend and Nuxt 3 for the frontend, with MongoDB Atlas as the database.

---

## 2. Backend Architecture

### Module Structure
src/
├── agents/
│   ├── agents.controller.ts
│   ├── agents.service.ts
│   ├── agents.module.ts
│   └── schemas/
│       └── agent.schema.ts
├── transactions/
│   ├── transactions.controller.ts
│   ├── transactions.service.ts
│   ├── transactions.module.ts
│   └── schemas/
│       └── transaction.schema.ts
└── app.module.ts

### Why I structured it this way

I put all HTTP logic in controllers and all business logic in services. This separation makes the code easier to test and maintain. Controllers do not know about the database, and services do not know about HTTP.

---

## 3. Data Models

### Agent

```json
{
  "_id": "ObjectId",
  "name": "string (required)",
  "email": "string (required, unique)",
  "phone": "string (required)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Transaction

```json
{
  "_id": "ObjectId",
  "propertyAddress": "string (required)",
  "totalServiceFee": "number (required)",
  "stage": "agreement | earnest_money | title_deed | completed",
  "listingAgentId": "ObjectId (ref: Agent)",
  "sellingAgentId": "ObjectId (ref: Agent)",
  "commission": "CommissionBreakdown | null",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### CommissionBreakdown (embedded in Transaction)

```json
{
  "agencyShare": "number",
  "listingAgentShare": "number",
  "sellingAgentShare": "number",
  "isSameAgent": "boolean"
}
```

### Why I embedded commission inside transaction

Commission always belongs to one transaction and cannot exist on its own. I chose to embed it instead of creating a separate collection because there is no need for joins, the data stays consistent, and if a transaction is deleted, its commission is deleted too.

---

## 4. Stage Transition Logic

I defined four stages that follow a strict order:
agreement → earnest_money → title_deed → completed

I prevent invalid transitions at the service layer. If a transaction is already at the last stage, the system throws a BadRequestException. This reflects the real-world process and ensures full traceability.

---

## 5. Commission Calculation

I calculate commission automatically when a transaction moves to the completed stage. I store the result inside the transaction document so it is always available without recalculation.

### Rules I implemented

- 50% of totalServiceFee goes to the agency
- 50% goes to the agent pool

**Scenario 1 - Same agent:**
listingAgentShare = agentPool (100%)
sellingAgentShare = 0

**Scenario 2 - Different agents:**
listingAgentShare = agentPool * 0.5
sellingAgentShare = agentPool * 0.5

### Why I calculate on completion

Commission only becomes real when the deal is done. Calculating and storing it at the completed stage avoids unnecessary computation on every request and creates a permanent financial record.

---

## 6. Frontend Architecture

### Pages I built
pages/
├── index.vue                  # Dashboard - transaction list
├── agents.vue                 # Agent management
└── transactions/
└── [id].vue               # Transaction detail and commission breakdown

### State Management

I used Pinia to manage all API calls and shared state in one store. This keeps my components clean and makes data available across pages without passing props down the tree.

### Why I chose Pinia

Pinia is the official state management solution for Vue 3. It has a simple API and full TypeScript support. I found it easier to work with than Vuex for this scale of project.

---

## 7. API Endpoints

### Agents
GET    /agents        List all agents
POST   /agents        Create a new agent
GET    /agents/:id    Get a single agent

### Transactions
GET    /transactions              List all transactions
POST   /transactions              Create a new transaction
GET    /transactions/:id          Get a single transaction
PATCH  /transactions/:id/stage    Advance to the next stage

---

## 8. Deployment

- **Backend**: Railway
- **Frontend**: Vercel
- **Database**: MongoDB Atlas (M0 Free Tier)

### Live URLs
- Backend: https://estate-agency-production.up.railway.app
- Frontend: https://estate-agency-git-main-silanekins-projects.vercel.app