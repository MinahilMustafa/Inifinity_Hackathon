#DEMO LINK
https://www.loom.com/share/3f7c4e72497a49eaa07ee2bfa69859c1

# NovaWorks CRM — AI Project Manager (Meeting to Execution)
**The Infinity Hack ’26 — Challenge Submission**  
**Repository**: [github.com/MinahilMustafa/Inifinity_Hackathon](https://github.com/MinahilMustafa/Inifinity_Hackathon)  
**Organization**: NovaWorks Technologies (Lahore, Pakistan)  

---

## 📄 PAGE 1: System Overview, Architecture & Workflow

### 1. Problem Statement & Executive Summary
In fast-paced software agencies, delivery planning meetings frequently suffer from manual friction between strategic discussions and actual task assignment. NovaWorks Technologies required an AI-native CRM where an administrator pastes an unformatted 60-minute delivery planning meeting transcript, and the platform autonomously:
1. Identifies discrete client engagements and project scopes.
2. Extracts tasks, effort estimations (in hours), and strict deadlines.
3. Maps projects to Project Managers and tasks to Developer Agents strictly from the existing 9-member roster.
4. Enforces **Role-Based Access Control (RBAC)** at the API and database query level so Managers only access their projects and Developers only see their assigned deliverables.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                SYSTEM ARCHITECTURE FLOW                                │
│                                                                                        │
│   [ Admin Pastes Transcript ]                                                          │
│               │                                                                        │
│               ▼                                                                        │
│   [ React / Vite Frontend ] ── (POST /api/ai/create-from-transcript with JWT)          │
│               │                                                                        │
│               ▼                                                                        │
│   [ Node.js / Express Backend ] ──► [ Query 9 Employees from XAMPP MySQL ]             │
│               │                                                                        │
│               ▼                                                                        │
│   [ OpenAI API (gpt-4o-mini) + Fallback Engine ] ◄── (Directory + Rules + Transcript)  │
│               │                                                                        │
│               ▼                                                                        │
│   [ Zod Schema Validation ]                                                            │
│   (Manager = PM, Assignee = DEV, Positive Hours, Task Deadline <= Project Deadline)   │
│               │                                                                        │
│               ▼                                                                        │
│   [ MySQL Database Transaction (All-or-Nothing ACID Commit) ]                          │
│               │                                                                        │
│               ▼                                                                        │
│   [ Instant Live Updates across Role-Specific Dashboards ]                             │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### 2. End-to-End Meeting-to-Execution Workflow

1. **Roster Ingestion**: The backend queries the MySQL `users` table to supply the AI with the exact employee roster (3 Project Managers, 6 Developer Agents).
2. **AI Synthesis & Prompt Engineering**:
   - The model is instructed with strict business rules: **Final recap overrides earlier discussions**, ignore rejected features (no payment gateways, no maps), never invent employees (e.g., Kamran is excluded), and enforce deadlines in October 2026.
3. **Zod Validation Pipeline**:
   - The AI's structured JSON is strictly validated using Zod before any database writes. Unresolved or malformed fields trigger clean error handling.
4. **All-or-Nothing Persistence**:
   - Projects and linked tasks are committed inside a **MySQL Transaction (`START TRANSACTION ... COMMIT`)**, ensuring partial records are never left behind if an error occurs.
5. **Role-Based Access Control (RBAC)**:
   - **Administrator**: Global project overview, stat cards, transcript conversion tool, and read-only team directory.
   - **Project Manager**: Access strictly limited to projects where `manager_id = currentUser.id`.
   - **Developer Agent**: Access strictly limited to tasks where `assignee_id = currentUser.id` across projects. Direct API requests verify user ID from verified JWT tokens.

---

## 📄 PAGE 2: Data Schema, Technology Stack & Judge Verification

### 3. Database Schema (XAMPP MySQL / MariaDB)

```
   ┌────────────────────────────────────────────────────────┐
   │                        USERS                           │
   ├──────────────┬──────────────┬──────────────────────────┤
   │ id           │ VARCHAR(50)  │ PRIMARY KEY (e.g. PM01)  │
   │ name         │ VARCHAR(100) │ Full Name                │
   │ email        │ VARCHAR(150) │ UNIQUE (e.g. demo login) │
   │ password_hash│ VARCHAR(255) │ bcrypt hashed            │
   │ role         │ ENUM         │ ADMIN | MANAGER | AGENT  │
   │ specialization VARCHAR(150) │ Role Focus               │
   │ skills       │ JSON         │ Array of skill tags      │
   └──────────────┴──────────────┴──────────────────────────┘
                  │ 1                       │ 1
                  │ manages                 │ assigned to
                  ▼ *                       ▼ *
   ┌─────────────────────────────────────┐  │
   │              PROJECTS               │  │
   ├──────────────┬──────────────────────┤  │
   │ id           │ VARCHAR(50) [PK]     │  │
   │ name         │ VARCHAR(150)         │  │
   │ client_name  │ VARCHAR(150)         │  │
   │ description  │ TEXT                 │  │
   │ manager_id   │ VARCHAR(50) [FK] ────┼──┘
   │ deadline     │ DATE (YYYY-MM-DD)    │
   └──────────────┬──────────────────────┘
                  │ 1
                  │ contains
                  ▼ *
   ┌─────────────────────────────────────┐
   │               TASKS                 │
   ├──────────────┬──────────────────────┤
   │ id           │ VARCHAR(50) [PK]     │
   │ project_id   │ VARCHAR(50) [FK]     │
   │ title        │ VARCHAR(150)         │
   │ description  │ TEXT                 │
   │ assignee_id  │ VARCHAR(50) [FK]     │
   │ deadline     │ DATE (YYYY-MM-DD)    │
   │ estimated_hours DECIMAL(5,2)        │
   └─────────────────────────────────────┘
```

---

### 4. Technology Stack & Implementation Highlights

| Layer | Technology | Key Implementation Role |
| :--- | :--- | :--- |
| **Frontend** | **React 18 + Vite** | Modular SPA with custom enterprise theme, dark navigation sidebar, and role-based views. |
| **Icons & UI** | **Lucide-React** | Enterprise icons matching production AI platforms (`Sparkles`, `Layers`, `ShieldCheck`). |
| **Backend API**| **Node.js (v24) + Express** | Stateless REST API with JWT authorization, transaction handling, and query filtering. |
| **Database** | **MySQL / MariaDB (XAMPP)** | Local relational database on port `3306` with seeded demo credentials. |
| **AI Integration** | **OpenAI SDK (`gpt-4o-mini`)** | Structured JSON extraction with resilient pattern-matching fallback engine. |
| **Validation** | **Zod Schema Validator** | Strict runtime schema verification preventing invalid or hallucinated records. |

---

### 5. Demo Accounts & Step-by-Step Judge Testing Guide

All demo accounts use the standard password: **`Demo123!`**

| Reference | Role | Name | Email | Specialization | Assigned Work in Demo |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **ADMIN** | Administrator | Admin | `admin@novaworks.example` | Administrator | System Overview & Transcript Tool |
| **PM01** | Manager | Ayesha Khan | `ayesha@novaworks.example` | Web PM | **UrbanCart Website** (4 Tasks, 40h) |
| **PM02** | Manager | Bilal Ahmed | `bilal@novaworks.example` | Mobile PM | **QuickServe Mobile App** (4 Tasks, 46h) |
| **PM03** | Manager | Hina Malik | `hina@novaworks.example` | AI PM | **HelpDeskPro AI Assistant** (4 Tasks, 38h) |
| **DEV01** | Agent | Ali Raza | `ali@novaworks.example` | Full-Stack | 3 Tasks on UrbanCart (Catalog, Cart, Integration) |
| **DEV02** | Agent | Hamza Shah | `hamza@novaworks.example` | Full-Stack | 2 Tasks across UrbanCart and QuickServe APIs |
| **DEV03** | Agent | Sara Noor | `sara@novaworks.example` | App Developer | 2 Tasks on QuickServe (Screens, Booking) |
| **DEV04** | Agent | Usman Tariq | `usman@novaworks.example` | App Developer | 1 Task on QuickServe (Mobile Integration) |
| **DEV05** | Agent | Zain Abbas | `zain@novaworks.example` | AI Developer | 2 Tasks on HelpDeskPro (Answer Gen, Escalation) |
| **DEV06** | Agent | Maryam Asif | `maryam@novaworks.example` | AI Developer | 2 Tasks on HelpDeskPro (FAQ Processing, Testing) |

#### How to Verify:
1. **Admin Transcript Flow**: Sign in as `admin@novaworks.example` $\rightarrow$ Paste transcript $\rightarrow$ Click **Synthesize Project & Tasks** $\rightarrow$ Observe **3 projects** and **12 tasks** created.
2. **Manager Isolation**: Sign in as `ayesha@novaworks.example` $\rightarrow$ Only **UrbanCart Website** is visible.
3. **Developer Isolation**: Sign in as `ali@novaworks.example` $\rightarrow$ Only his **3 assigned tasks** appear in "My Tasks".
4. **Multi-Project Cross Assignment**: Sign in as `hamza@novaworks.example` $\rightarrow$ Shows his **2 backend tasks** spanning both *UrbanCart* and *QuickServe*.
5. **Persistence**: Press `F5` to refresh $\rightarrow$ All data remains saved in XAMPP MySQL.
