# Paytm: Secure and User-Friendly Cash Transaction Web App

## Introduction

Paytm is a web application designed to facilitate secure and convenient cash transactions between users. Built with React, Express, Mongoose (MongoDB), Zod, and JSON Web Tokens (JWT), it offers a seamless user experience for sending and receiving money online.

## Key Features

### Secure Authentication:

- Signup and Signin: Create an account or log in securely using JWT authentication. Credentials are stored securely in the user's localStorage.

- Access Control: Only authorized users can access cash transaction features.

- User-Friendly Interface:
- - Intuitive Dashboard: View a clear list of active users (excluding yourself) for easy money transfer selection.
- - Responsive UI: Optimized for various devices and screen sizes, ensuring user convenience.
- - Dynamic UI Updates: Real-time UI updates reflect transaction activity, keeping users informed.

- Efficient Money Management:
- - Send Money: Easily transfer money to other users on the platform.
- - Request Money: Initiate money requests, notifying the recipient through a user-friendly popup.
- - Manage Requests: Accept, deny, or postpone incoming money requests directly from the popup or your dashboard.

- Robust Database:
- - Mongoose (MongoDB): Stores user data, transaction history, and other relevant information securely.

- Data Validation:
- - Zod: Enforces robust input validation for all user interactions, ensuring data integrity.
Getting Started

## Prerequisites: Node.js, npm (or yarn)

1. Clone Repository: git clone https://github.com/your-username/paytm-clone.git
2. Install Dependencies: npm install (or yarn install)
3. Database Setup:
4. Install and configure MongoDB locally or on a cloud provider.
5. Configure database connection details in the backend code.
6. Start Development Server: npm start (or yarn start)
7. Access Application: Visit http://localhost:3000 (or your designated port) in your browser.

## Deployment

For production deployment,vercel was picked for both backend and frontend using serverless functions.

## License

This project is licensed under the MIT License.
