# 🛒 FreshBasket – Grocery Delivery Frontend

React frontend for the Spring Boot grocery delivery backend.

## Project Structure

```
src/
├── context/
│   ├── AuthContext.js       # Login/logout state management
│   └── CartContext.js       # Cart state with discount logic
├── services/
│   └── api.js               # All Axios API calls to backend
├── components/
│   ├── Navbar.js            # Navigation with cart badge
│   ├── ProtectedRoute.js    # Redirect to login if unauthenticated
│   └── Toast.js             # Notification pop-ups
├── pages/
│   ├── Home.js              # Landing page
│   ├── Login.js             # Login by email
│   ├── Register.js          # Create new customer account
│   ├── Products.js          # Browse & add groceries to cart
│   ├── Cart.js              # Cart with discount + place order
│   ├── Orders.js            # View & cancel orders
│   └── Notifications.js     # Order status notifications
├── App.js                   # Router + providers
└── index.js                 # Entry point
```

## Backend API Endpoints Used

| Feature        | Method | Endpoint                                        |
|----------------|--------|-------------------------------------------------|
| Register       | POST   | `/customers`                                    |
| Get customers  | GET    | `/customers`                                    |
| Get categories | GET    | `/categories`                                   |
| Add to cart    | POST   | `/cart/{customerId}/{productId}/{quantity}`      |
| Get cart       | GET    | `/cart`                                         |
| Remove cart    | DELETE | `/cart/{id}`                                    |
| Place order    | POST   | `/orders/{customerId}/{productId}/{quantity}?deliveryAddress=` |
| Get orders     | GET    | `/orders`                                       |
| Cancel order   | DELETE | `/orders/{id}`                                  |
| Notifications  | GET    | `/notifications`                                |

## Setup & Run

### 1. Start the Spring Boot backend
Make sure it's running on `http://localhost:8080`

### 2. Enable CORS in the backend
Add this to your Spring Boot `application.properties`:
```
spring.mvc.cors.allowed-origins=http://localhost:3000
```
Or add `@CrossOrigin(origins = "http://localhost:3000")` to each controller.

### 3. Install and run frontend
```bash
npm install
npm start
```
Opens at http://localhost:3000

## Key Features
- ✅ Register / Login (by email, matched against backend)
- ✅ Browse products by category with search
- ✅ Add to cart with quantity selector
- ✅ ₹25 discount auto-applied when cart > ₹200
- ✅ Place orders with delivery address (calls backend)
- ✅ View & cancel your orders
- ✅ Order notifications
- ✅ Protected routes (login required)
- ✅ Persistent login via localStorage
