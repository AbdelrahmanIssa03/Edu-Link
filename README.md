# 🧠 EduLink – AI-Powered Learning Ecosystem

EduLink is a modular system designed to enhance real-time interaction between **students** and **instructors** through AI-driven insights, semantic search, and intelligent course management.

This repository includes multiple services powering EduLink’s ecosystem — from AI processing to user management — and now extends to both **React (Vite)** and **Flutter** front-end clients.

---

## 📘 Table of Contents

1. [Overview](#overview)
2. [Repositories](#repositories)
3. [Technologies Used](#technologies-used)
4. [AI Backend Setup (Python)](#ai-backend-setup-python)
5. [User Backend Setup (Go)](#user-backend-setup-go)
6. [Running the React App (Vite)](#react-app-setup)
7. [Running the Flutter App](#flutter-app-setup)
8. [Environment Variables](#environment-variables)

## 🧩 Overview

EduLink bridges communication between **students** and **instructors** through real-time transcription, intelligent query handling, and context-aware search.  
The platform integrates multiple services, including:

- **AI Backend** – For semantic similarity search and retrieval-augmented responses  
- **User Backend** – For authentication, roles, and access management  
- **Frontend Clients** – React (Vite) web dashboard and Flutter mobile app  

---

## 🗂 Repositories

| Service | Description |
|----------|--------------|
| **AI-Backend** | Handles transcription, semantic matching, and content retrieval using Qdrant and LangChain |
| **User-Backend** | Manages authentication, authorization, and relational data using Go + PostgreSQL |
| **React App** | Web dashboard built with React and Vite |
| **Flutter App** | Cross-platform mobile client for students and instructors |

---

## ⚙️ Technologies Used

### Common
- gRPC (Service Communication)
- Docker (Deployment)
- JWT Authentication

### AI-Backend
- **Python 3.12+**
- **Qdrant** (Vector Database)
- **LangChain** (AI Integration)

### User-Backend
- **Go 1.2+**
- **PostgreSQL** (Relational Database)

---

## AI Backend Setup (Python)

### Installation

```bash
cd AI-Backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```
## User Backend Setup (Go)

### Installation

```bash
cd User-Backend
go mod tidy
go run main.go
```

## Instructor Dashboard (React)

### Installation

```bash
cd Instructor-Dashboard
npm install
npm run dev
```

## Student Application (Flutter)

### Installation

```bash
cd Student-App
flutter pub get
flutter run
```

## ⚙️ Environment Variables

Each service directory includes a `.env.sample` file that outlines the required credentials and API keys needed for proper system operation.  
You can use this file as a template to create your own `.env` file by updating it with valid values before running the application.
