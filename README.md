# HavenCode

HavenCode is a full-stack coding practice platform. It lets users solve DSA problems in a browser-based code editor, execute code against visible test cases, submit solutions against hidden test cases, review submission history, track progress, and chat with an AI coding assistant.

It also includes a protected admin console for creating, editing, and deleting coding problems.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Supported Languages](#supported-languages)
- [Project Structure](#project-structure)
- [Future Improvements](#future-improvements)
- [Author](#author)

## Features

### User Experience

- Register and log in with secure password hashing
- JWT cookie-based authentication
- Browse problems by difficulty and topic
- Search problems and filter solved or unsolved questions
- Solve problems in a Monaco-powered code editor
- Switch between C++, Java, Python, and JavaScript
- Run code against visible test cases
- Submit code against hidden test cases
- View runtime, memory usage, errors, and test-case results
- Review past submissions
- Track solved problems and completion percentages
- Use an AI assistant for hints, debugging, explanations, and complexity analysis
- Switch between light and dark themes

### Admin Features

- Protected admin-only routes
- Create new coding problems
- Edit existing problems
- Delete problems
- Manage visible test cases, hidden test cases, starter code, and reference solutions
- Automatically validate reference solutions through Judge0 before saving

## Tech Stack

### Frontend

- React 19
- Vite
- Redux Toolkit
- React Router
- Axios
- Monaco Editor
- Tailwind CSS
- DaisyUI
- React Markdown and remark-gfm

### Backend

- Node.js
- Express 5
- MongoDB and Mongoose
- Redis
- JWT
- bcrypt
- Google Gemini API
- Judge0-compatible OnlineCompiler API

## Architecture

```text
React/Vite Frontend
        |
        | HTTP + JWT cookie
        v
Express REST API
   |       |       |
 MongoDB  Redis  External APIs
   |                 |
Problem data      Judge0 and Gemini
Users/Submissions
```

The frontend communicates with the backend through an Axios client configured with credentials. Authentication is handled through a JWT stored in a browser cookie. Redis maintains blocked JWT tokens after logout. MongoDB stores users, problems, and submissions, while external services execute code and provide AI responses.

## Prerequisites

Install the following tools:

- Node.js 20 or later
- npm
- MongoDB Atlas or a local MongoDB instance
- Redis Cloud or a local Redis instance
- A Judge0 API token for `onlinecompiler.io`
- A Google Gemini API key

## Supported Languages

| Language | Judge0 Language ID |
|---|---:|
| C++ | 54 |
| Java | 62 |
| Python | 71 |
| JavaScript | 63 |

Starter code and reference solutions must include entries for all four languages.

## Project Structure

```text
LEETCODE/
├── backend/
│   └── src/
│       ├── controllers/
│       ├── db/
│       ├── middlewares/
│       ├── models/
│       ├── routes/
│       ├── seeds/
│       ├── utils/
│       ├── app.js
│       └── index.js
├── frontend/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       ├── store/
│       ├── utils/
│       ├── App.jsx
│       └── main.jsx
└── Readme.md
```

## Future Improvements

- Production deployment configuration
- Docker Compose setup
- Automated tests
- Submission execution queues
- Contest and leaderboard support
- Discussion threads
- Code-similarity checks
- OAuth authentication
- User profiles and avatars
- Paginated problem listings
- Detailed submission analytics

## Author

**Raunak Suri**

GitHub: [https://github.com/RaunakSuri](https://github.com/RaunakSuri)
