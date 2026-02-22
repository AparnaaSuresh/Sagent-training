# Budget Manager - React Frontend

A complete React frontend for the Personal Budget Tracker Spring Boot backend.

## Project Structure

```
budget-tracker/
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx              # App entry point
    ├── App.jsx               # Root component + routing
    ├── api/
    │   └── api.js            # All API calls to Spring Boot backend
    ├── context/
    │   └── AppContext.jsx    # Global state (users, income, expenses, etc.)
    ├── components/
    │   ├── Navbar.jsx        # Top navigation + user switcher
    │   ├── Modal.jsx         # Reusable modal dialog
    │   └── FormField.jsx     # Shared form styles & components
    └── pages/
        ├── Dashboard.jsx     # Overview: balance, charts, recent transactions
        ├── IncomePage.jsx    # Add/edit/delete income records
        ├── ExpensesPage.jsx  # Add/edit/delete expenses with category filter
        ├── BudgetsPage.jsx   # Set monthly limits, track spending vs budget
        ├── GoalsPage.jsx     # Create savings goals, track progress
        ├── CategoriesPage.jsx # Manage income & expense categories
        ├── UsersPage.jsx     # User registration & management
        └── NotificationsPage.jsx # View & manage notifications
```

## Setup

### 1. Start the Spring Boot backend
Make sure your backend is running on `http://localhost:8080`.

You may need to add CORS config to your Spring Boot app. Add this to a config class:

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
            .allowedOrigins("http://localhost:3000")
            .allowedMethods("GET", "POST", "PUT", "DELETE")
            .allowedHeaders("*");
    }
}
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the frontend
```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Features

- **Dashboard** - Balance overview, spending breakdown by category, recent transactions, goal progress
- **Income Tracking** - Log salary, freelance, and other income sources
- **Expense Logging** - Record expenses by category with descriptions and dates
- **Budget Setting** - Set monthly spending limits per category with visual progress bars
- **Goal Tracking** - Set savings goals and track progress based on your balance
- **Categories** - Manage INCOME and EXPENSE categories
- **User Management** - Register and manage multiple users
- **Notifications** - View and mark notifications as read
- **User Switcher** - Switch between users in the navbar to filter data per user

## API Endpoints Used

| Feature | Endpoints |
|---------|-----------|
| Users | GET/POST `/users`, PUT/DELETE `/users/{id}` |
| Income | GET/POST `/income`, PUT/DELETE `/income/{id}` |
| Expenses | GET/POST `/expenses`, PUT/DELETE `/expenses/{id}` |
| Categories | GET/POST `/categories`, PUT/DELETE `/categories/{id}` |
| Budgets | GET/POST `/budgets`, PUT/DELETE `/budgets/{id}` |
| Goals | GET/POST `/goals`, PUT/DELETE `/goals/{id}` |
| Notifications | GET/POST `/notifications`, PUT/DELETE `/notifications/{id}` |
