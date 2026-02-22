# Library Management System — React Frontend

## Prerequisites
- Node.js 16+
- Your Spring Boot backend running on **port 8081**

## Setup

```bash
cd library-frontend
npm install
npm start
```

App opens at http://localhost:3000

---

## Login Credentials

### Librarian
- Email: `librarian@library.com`
- Password: `lib123`

### Member
- Register a new account via the login screen **OR**
- Use existing member email + password from the database

---

## Features by Role

### 🎓 Member
| Page | Access |
|------|--------|
| Dashboard | Personal stats (borrows, fines, notifications) |
| Browse Books | Search all books with availability status |
| My Borrows | View own borrows; submit requests; cancel pending requests |
| My Fines | View own outstanding fines |
| Notifications | View own notifications |

### ⚙️ Librarian
| Page | Access |
|------|--------|
| Dashboard | Full library overview stats |
| Books & Inventory | **Add / Edit / Delete** books and inventory records |
| Borrow Records | View all borrows; **issue, update status, delete** |
| Members | **Add / Edit / Delete** member accounts |
| Fines | **Add / Edit / Delete / mark Paid** fines |
| Notifications | **Send** notifications to members; delete |

---

## Project Structure

```
src/
├── context/
│   └── AuthContext.jsx       # Role-based auth (LIBRARIAN / MEMBER)
├── services/
│   └── api.js                # All API calls to backend (port 8081)
├── components/
│   ├── Sidebar.jsx           # Role-aware navigation sidebar
│   └── Toast.jsx             # Toast notification system
├── pages/
│   ├── LoginPage.jsx         # Login + Registration
│   ├── DashboardPage.jsx     # Role-specific dashboard
│   ├── BooksPage.jsx         # Books + Inventory
│   ├── MembersPage.jsx       # Members (librarian only)
│   ├── BorrowsPage.jsx       # Borrow records
│   ├── FinesPage.jsx         # Fines
│   └── NotificationsPage.jsx # Notifications
├── styles.css                # Global styles (Playfair Display + DM Sans)
├── App.jsx                   # Router + layout
└── index.js                  # Entry point
```

## Backend API Expected

Base URL: `http://localhost:8081`

| Endpoint | Description |
|----------|-------------|
| `GET/POST /members` | List / create members |
| `GET/PUT/DELETE /members/{id}` | Single member ops |
| `GET/POST /books` | Books |
| `PUT/DELETE /books/{id}` | Update/delete books |
| `GET/POST /inventory` | Inventory |
| `PUT/DELETE /inventory/{id}` | Update/delete inventory |
| `GET/POST /borrow` | Borrow records |
| `PUT/DELETE /borrow/{id}` | Update/delete borrow |
| `GET/POST /fines` | Fines |
| `PUT/DELETE /fines/{id}` | Update/delete fine |
| `GET/POST /notifications` | Notifications |
| `DELETE /notifications/{id}` | Delete notification |

> **Note:** Add `@CrossOrigin(origins = "*")` to all your Spring Boot `@RestController` classes, or configure a global CORS config, so the React app can reach the API.
