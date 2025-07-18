# 🏨 Hotel Management System

A full-stack web application for hotel booking and management, including support for room & service reservation, reviews, and booking history.

---

## 📁 Project Structure

```
├── backend/            # Main API server for room, service, booking, user...
├── backend_chatbot/    # Chatbot service for support or travel recommendation
├── frontend/           # Web client for hotel guests
```

---

## 🚀 Features

- 🛏️ View room types and details
- 🧴 Browse available hotel services (spa, laundry, etc.)
- 📝 Book rooms and optional services
- ⭐ Rate and review rooms and services
- 📜 View personal booking history
- 🔐 User login, registration, and management
- 💬 Integrated AI chatbot (optional) for travel or room support

---

## ⚙️ Tech Stack

| Layer         | Technology                          |
|---------------|--------------------------------------|
| Frontend      | ReactJS, TailwindCSS                |
| Backend       | Node.js, ExpressJS                  |
| Chatbot       | OpenAI API                          |
| Database      | MySQL                               |
| Auth          | JWT                                 |

---

## 🛠️ Getting Started

### 1. Clone the project

```bash
git clone https://github.com/irisus1/Hotel_Management_Website.git
cd Hotel_Management_Website
```

### 2. Setup environment variables

Create `.env` files for each service:

- `backend/.env`
- `backend_chatbot/.env`
- `frontend/.env`

Use `.env.example` if provided.

---

### 3. Run the services

#### Backend API

```bash
cd backend
npm install
npm run start
```

#### Chatbot Server

```bash
cd backend_chatbot
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
py app.py
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

---



## 👨‍💻 Contributors

- Original by [@TruongDacDien](https://github.com/TruongDacDien)
- Updated by [@YourUsername](https://github.com/YourUsername)

---

