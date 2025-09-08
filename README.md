# Personal Finance Tracker


## Overview
The Personal Finance Tracker is a web application designed to help users manage their finances effectively. It provides features for tracking transactions, generating reports, and managing user authentication.

## Project Structure
The project is divided into two main parts: the frontend and the backend.

### Frontend
The frontend is built using React and Vite. It includes the following key components:
- **Features**: Contains slices for authentication, transactions, and reports.
- **Pages**: Includes the main pages such as Dashboard and Settings.
- **Components**: Reusable UI components and chart wrappers.
- **Utils**: Utility functions for API calls.

### Backend
The backend is built using Spring Boot and Maven. It includes:
- **Controllers**: Handles API requests for authentication, transactions, and reports.
- **Services**: Contains business logic for handling user authentication and transaction management.
- **Entities**: Defines the data models for User, Account, and Transaction.
- **Security**: Configures JWT-based authentication.

## Getting Started
To get started with the project, follow these steps:

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd personal-finance-tracker
   ```

2. **Set up the backend**:
   - Navigate to the `backend` directory.
   - Use Maven to build the project:
     ```
     ./mvnw clean install
     ```
   - Run the application:
     ```
     ./mvnw spring-boot:run
     ```

3. **Set up the frontend**:
   - Navigate to the `frontend` directory.
   - Install dependencies:
     ```
     npm install
     ```
   - Start the development server:
     ```
     npm run dev
     ```

## Technologies Used
- **Frontend**: React, Vite, Tailwind CSS, Redux, Redux toolkit
- **Backend**: Spring Boot, Java, Maven, JWT for authentication
