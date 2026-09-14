# KARYO — Your Career, Connected.

> An AI-powered career intelligence platform that connects your profile, skills, resume, career progress, and real-world job opportunities in one intelligent workspace.

KARYO is a full-stack career development platform designed to help developers understand **where they currently stand, what skills they have, what they are missing, and which opportunities align with their profile**.

Instead of treating a resume as a static document, KARYO turns it into a structured career profile that continuously connects skills, experience, projects, education, career progress, and live opportunities.

---

## ✨ What KARYO Does

KARYO brings multiple parts of career development into one workflow:

* 🔐 **Secure Authentication** — Registration, login, JWT-based sessions, password hashing, protected routes, and session restoration.
* 📄 **AI Resume Analysis** — Upload a resume and extract structured career information using Gemini.
* 👤 **Profile Management** — Manage professional summary, experience, projects, education, skills, and target role.
* 🧠 **Skill Graph** — Visualize your current skill landscape and identify areas for improvement.
* 💼 **Opportunity Engine** — Discover real job opportunities based on your profile rather than static/mock listings.
* 🎯 **Deterministic Job Matching** — Opportunities are scored using skill coverage, role affinity, and evidence from the user's profile.
* 🤖 **AI Match Rationale** — Gemini enhances the explanation behind a match without inventing qualifications.
* 📈 **Career Score** — A dynamic profile score that updates as career information changes.
* 🕒 **Career Timeline** — Track professional experience and career progression.
* 🔄 **Persistent Profile** — Career information is stored in MongoDB and restored across sessions.
* 🛡️ **Production Security** — URL validation, CORS controls, sanitized server errors, protected APIs, and environment-based secrets.

---

## 🏗️ Architecture

```text
                         ┌──────────────────────┐
                         │       KARYO UI       │
                         │   React + TypeScript │
                         │        + Vite        │
                         └──────────┬───────────┘
                                    │
                              REST API / JWT
                                    │
                         ┌──────────▼───────────┐
                         │    Express Server    │
                         │      TypeScript      │
                         └──────────┬───────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
      ┌───────▼────────┐   ┌────────▼────────┐   ┌──────▼──────────┐
      │ Authentication │   │ Resume / Gemini │   │ Opportunity      │
      │ & User APIs    │   │ Analysis        │   │ Engine           │
      └───────┬────────┘   └────────┬────────┘   └──────┬───────────┘
              │                     │                   │
              └─────────────────────┼───────────────────┘
                                    │
                         ┌──────────▼───────────┐
                         │     MongoDB Atlas    │
                         │ Persistent User Data │
                         └──────────────────────┘

                         Opportunity Providers
                         ┌──────────────────────┐
                         │ Jobicy              │
                         │ Arbeitnow (fallback) │
                         │ Optional Adzuna      │
                         └──────────────────────┘
```

---

## 🧩 Core Modules

### 1. Authentication & User Management

KARYO provides a persistent authentication layer built around protected API routes.

Implemented capabilities include:

* User registration
* Duplicate email protection
* Secure password hashing with bcrypt
* JWT authentication
* Login
* Session restoration
* Protected API routes
* Token expiration/tampering handling
* Unauthorized-session event handling
* Logout and client-side session cleanup

---

### 2. AI Resume Intelligence

Users can upload a resume and have KARYO transform it into structured career information.

The resume analysis pipeline extracts information such as:

* Professional experience
* Education
* Projects
* Skills
* Target role
* Career score

Gemini is used for semantic resume analysis and structured extraction.

The system also handles edge cases such as:

* Missing resume
* Unsupported files
* Empty files
* Missing Gemini configuration
* Malformed AI responses
* Empty AI responses
* Resume deletion

### Non-destructive resume updates

Resume analysis does not blindly overwrite the user's profile.

When new skills are extracted, KARYO merges them with existing manually maintained skills and preserves a customized target role where applicable.

---

## 🧠 Skill Intelligence

KARYO converts profile information into a visual skill representation.

The Skill Graph helps users understand:

* Existing technical capabilities
* Skill relationships
* Areas represented in their profile
* Skills that can strengthen their target role

The graph works with manually maintained profile skills as well as skills extracted from a resume.

---

## 💼 Opportunity Engine

The Opportunity Engine connects the user's career profile with **real external job opportunities**.

KARYO does not rely on fake or hardcoded job listings.

### Current providers

**Primary**

* Jobicy Remote Tech Jobs API

**Fallback**

* Arbeitnow

**Optional**

* Adzuna when configured

The backend caches provider results for improved response performance and deduplicates opportunities using their URLs and normalized company/title combinations.

---

## 🎯 Matching Algorithm

KARYO uses a deterministic scoring model to establish the core job match:

```text
Match Score =
    50% × Skill Coverage
  + 30% × Role Affinity
  + 20% × Evidence Coverage
```

### Skill Coverage

Measures how much of the opportunity's required/relevant skill set is covered by the user's profile.

### Role Affinity

Measures how closely the opportunity's role aligns with the user's target role and career profile.

### Evidence Coverage

Measures whether the user's experience, projects, education, or other profile information provides supporting evidence for the opportunity.

The system also identifies:

* ✅ Matched skills
* ❌ Missing skills
* 🔗 Adjacent skills
* 📌 Profile evidence

### Gemini's role

Gemini is used to improve the human-readable rationale behind a match.

It does **not** determine the core score and is constrained from inventing qualifications that are not supported by the user's profile.

This keeps the core matching process deterministic while still providing useful AI-generated explanations.

---

## 📊 Career Intelligence Dashboard

The dashboard brings the user's career information together into a single workspace.

It includes:

* Career Score
* Profile information
* Skill Graph
* Opportunity Engine
* Career Timeline
* Projects
* Experience
* Education

The dashboard can also operate using manually maintained profile information even when a PDF resume has not been uploaded.

---

## 🕒 Career Timeline

The Timeline organizes professional development into a structured progression using information from the user's profile.

It provides a clearer view of:

* Experience
* Projects
* Education
* Career progression

---

## 👤 Profile Management

Users can manage their professional identity directly from KARYO.

Supported profile information includes:

* Professional summary
* Target role
* Skills
* Work experience
* Projects
* Education

Profile updates are persisted to MongoDB.

Career Score is recalculated when relevant profile information changes.

---

## 🔐 Security & Production Hardening

KARYO includes several production-oriented safeguards.

### Authentication

* JWT-protected API routes
* bcrypt password hashing
* Expired/tampered token handling
* Unauthorized request handling

### Input & URL Safety

External links are validated before being rendered or opened.

Only:

```text
http://
https://
```

URLs are accepted.

Unsafe protocols such as:

```text
javascript:
data:
```

and malformed/protocol-relative URLs are rejected.

### CORS

The backend supports explicitly configured allowed origins through environment configuration.

### Error Handling

Server errors are sanitized before being returned to clients to avoid exposing internal implementation details.

Database connection errors are also logged with sensitive credential information masked.

### Environment Secrets

Secrets and environment-specific configuration are kept outside the source-controlled codebase.

---

## ⚡ Performance

Production hardening included measured performance checks.

| Operation                   | Measured Result |
| --------------------------- | --------------: |
| Uncached job-provider fetch |      ~185.57 ms |
| Cached opportunity fetch    |        ~0.09 ms |
| Matching computation        |       ~37.40 ms |
| Frontend production build   |         ~6.36 s |
| JavaScript bundle           |    ~423 KB gzip |

The opportunity provider uses in-memory caching to avoid unnecessary repeated external API requests during the cache window.

---

## 🛠️ Tech Stack

### Frontend

* React
* TypeScript
* Vite
* React-based component architecture

### Backend

* Node.js
* Express.js
* TypeScript
* REST APIs
* JWT
* bcrypt

### Database

* MongoDB
* MongoDB Atlas

### AI

* Google Gemini

### External Data

* Jobicy
* Arbeitnow
* Optional Adzuna integration

### Development

* ESLint
* TypeScript
* Vite
* npm

---

## 📁 Project Structure

```text
KARYO/
│
├── src/
│   ├── components/
│   ├── config/
│   ├── context/
│   ├── pages/
│   ├── services/
│   ├── ...
│   │
│   └── main application files
│
├── server/
│   └── src/
│       ├── config/
│       │   ├── database.ts
│       │   └── env.ts
│       │
│       ├── controllers/
│       │   ├── auth.controller.ts
│       │   ├── opportunity.controller.ts
│       │   ├── resume.controller.ts
│       │   └── user.controller.ts
│       │
│       ├── middleware/
│       │   ├── auth.middleware.ts
│       │   ├── error.middleware.ts
│       │   └── upload.middleware.ts
│       │
│       ├── models/
│       │   └── User.ts
│       │
│       ├── routes/
│       │   ├── auth.routes.ts
│       │   ├── opportunity.routes.ts
│       │   ├── resume.routes.ts
│       │   └── user.routes.ts
│       │
│       ├── services/
│       │   ├── auth.service.ts
│       │   ├── jobProvider.service.ts
│       │   ├── matching.service.ts
│       │   └── resume.service.ts
│       │
│       ├── types/
│       │   ├── express.ts
│       │   ├── opportunity.ts
│       │   └── resume.ts
│       │
│       ├── utils/
│       │   └── ApiError.ts
│       │
│       └── app.ts
│
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have:

* Node.js installed
* npm installed
* MongoDB Atlas account/database
* Gemini API key

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd KARYO
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Install backend dependencies

```bash
cd server
npm install
cd ..
```

### 4. Configure environment variables

Create your environment files using the provided examples.

Frontend configuration:

```env
VITE_API_URL=http://localhost:5000
```

Backend configuration:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

Use strong production secrets and never commit actual `.env` files to Git.

### 5. Start the backend

```bash
cd server
npm run dev
```

### 6. Start the frontend

Open another terminal:

```bash
npm run dev
```

The application will then be available through the Vite development server.

---

## 🔌 API Overview

KARYO exposes protected REST APIs for the core career workflow.

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

### User/Profile

```text
GET  /api/user/profile
PUT  /api/user/profile
```

### Resume

```text
POST   /api/resume
GET    /api/resume
DELETE /api/resume
```

### Opportunities

```text
GET /api/opportunities
GET /api/opportunities/:id
```

Opportunity endpoints support profile-aware matching and opportunity discovery/filtering.

---

## 🧪 Verification

KARYO v1.0 was subjected to production-oriented verification covering:

* Authentication lifecycle
* Protected routes
* Profile persistence
* Resume processing
* Gemini edge cases
* Opportunity discovery
* Job-provider fallback
* Opportunity deduplication
* Matching calculations
* URL safety
* CORS
* Error sanitization
* Health endpoint
* Secret scanning
* Frontend build
* Backend build
* Full-stack API/state lifecycle

The release verification concluded with:

```text
READY FOR PRODUCTION
```

---

## ❤️ Why KARYO?

Most career platforms focus on one part of the journey:

> Resume → Jobs

KARYO focuses on the larger loop:

```text
              ┌──────────────┐
              │    PROFILE   │
              └──────┬───────┘
                     │
          ┌──────────▼──────────┐
          │   SKILLS & EVIDENCE │
          └──────────┬──────────┘
                     │
              ┌──────▼──────┐
              │ RESUME / AI │
              └──────┬──────┘
                     │
          ┌──────────▼──────────┐
          │   CAREER INSIGHTS   │
          └──────────┬──────────┘
                     │
             ┌───────▼────────┐
             │ REAL OPPORTUNITY│
             └───────┬────────┘
                     │
             ┌───────▼────────┐
             │  SKILL GROWTH  │
             └────────────────┘
```

The goal is not simply to help a user **find a job**.

The goal is to help them understand **why they are ready, where they are weak, and what they should work toward next.**

---

## 📌 Project Status

**KARYO v1.0 — Production Ready**

The current release represents the completed first production version of the platform, including authentication, persistent career profiles, AI resume analysis, skill intelligence, real opportunity discovery, deterministic matching, and production hardening.

---

## 👨‍💻 Built With

KARYO was designed and developed as a full-stack engineering project with a focus on:

* Production-oriented architecture
* Backend API design
* Authentication and security
* AI-assisted data extraction
* Deterministic recommendation logic
* External API integration
* Persistent user state
* Performance optimization
* Full-stack system integration

---

## 📄 License

This project is currently maintained as a personal/portfolio project.
