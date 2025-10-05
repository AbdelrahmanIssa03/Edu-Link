# EduLink User-Backend

## Description

The User Repository manages user authentication, authorization, and data, ensuring secure access control for instructors and students. It tracks user roles, session participation, and interactions.

Built on a scalable architecture, it leverages gRPC, JWT authentication, and a relational database for structured storage. With real-time updates, and access controls, it ensures a secure, responsive experience.

## Table of Contents

- [Technologies Used](#technologies-used)
- [Installation Instructions](#installation-instructions)
- [Usage Instructions](#usage-instructions)

### Technologies Used

- Go (Programming Language)
- PostgreSQL (Relational Database)
- gRPC (API Type)

### Installation Instructions

Follow the steps below to set up and run the project:

#### Prerequisites

Ensure you have the following installed:

- Go 1.2+

#### Setup

1. **Clone the repository:**

   ```sh
   git clone https://github.com/EduLink-Project/User-Backend.git
   cd <project_directory>
   ```

2. **Install dependencies:**

   ```sh
   go mod tidy
   ```

3. **Set up environment variables:**

   - The project includes an `.env` file with necessary configurations.
   - The `.env` file exist in the Docuemtns folders
   - Ensure you configure it as needed before running the application.

4. **Run the application:**

   ```sh
   go run main.go
   ```

#### Troubleshooting

- If you encounter any missing dependencies, try running:

  ```sh
  go mod tidy
  ```

- Ensure your `.env` file is correctly configured and has the necessary environment variables.

### Usage Instructions

### Running the Application

- Execute the following command to start the application:

  ```sh
  go run main.go
  ```

  or

  ``` sh
  air    # start the application with Live-Reload
  ```

  make sure to use `air init` command first before running `air`, and you can do it only once.

- If the application runs on a server, access it via:

  ``` sh
  0.0.0.0:3000
  ```

  (Adjust the port as per your configuration.)

### Environment Variables

- The `.env` file contains necessary configurations such as API keys, database credentials, or other settings.
- Ensure the variables are correctly set up before running the application.
