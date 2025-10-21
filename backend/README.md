# Personal Finance Tracker Application

## Overview

The Personal Finance Tracker (PFT) is a application designed to help users manage their personal finances. This application leverages various technologies and frameworks to provide a robust and scalable solution.

## Features

- **Spring Boot**: The application is built using Spring Boot, which simplifies the development process and provides a robust framework for building Java applications.
- **Spring Data JPA**: For database interactions, Spring Data JPA is used to simplify the data access layer.
- **Spring Security**: Ensures secure access to the application by providing authentication and authorization mechanisms.
- **Spring Validation**: For validating input data, ensuring that the data entered by the user is correct and consistent.
- **Flyway**: For database migrations, Flyway is used to manage and apply database schema changes.
- **Redis**: For caching, Redis is used to improve the performance of the application.
- **MapStruct**: For object mapping, MapStruct is used to simplify the conversion between different data transfer objects (DTOs) and entities.
- **Lombok**: For reducing boilerplate code, Lombok is used to generate getters, setters, and other boilerplate code automatically.
- **JJWT**: For JSON Web Tokens, JJWT is used to handle authentication and authorization tokens.
- **Testcontainers**: For integration testing, Testcontainers is used to run tests in isolated environments.

## Getting Started

### Prerequisites

- Java 21
- Maven
- Docker (optional, for running Redis and PostgreSQL)

### Installation

1. Clone the repository:

```sh
   git clone <repository-url>
   cd personal-finance-tracker
```

2. Install the dependencies:

```sh
mvn clean install
```

### Running the Application

To run the application in development mode, use the following command:

```sh
mvn spring-boot:run
```

### Running Tests

To run the tests, use the following command:

```sh
mvn test
```

### Additional Commands

- **Build the Application**:

    ```sh
    mvn clean package
    ```

- **Run Integration Tests with Testcontainers**:

    ```sh
    mvn verify
    ```

- **Clean the Project**:

    ```sh
    mvn clean
    ```
