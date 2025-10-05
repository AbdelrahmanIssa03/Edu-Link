# EduLink AI-Backend

## Description

The AI Repository serves as the backbone of the **EduLink**, designed to enhance real-time student-instructor interaction. It manages transcriptions, and queries while enabling context-aware similarity searches for both instructors and students.

The repository is built around **Qdrant**, an open-source vector search database, to facilitate semantic similarity matching between student queries, instructor lectures, and uploaded course materials, and **LangChain** framework for easy integration of the AI components. This ensures real-time retrieval of relevant content.

## Table of Contents

- [Technologies Used](#technologies-used)
- [Installation Instructions](#installation-instructions)
- [Usage Instructions](#usage-instructions)

### Technologies Used

- Python (Programming Language)
- Qdrant (Vector Database)
- LangChain (AI Framework)
- gRPC (API Type)
- Redis (Cache Management)

### Installation Instructions

Follow the steps below to set up and run the project:

#### Prerequisites

Ensure you have the following installed:

- Python 3.12+
- `pip` 25.0+ (usually installed with python)

#### Setup

1. **Clone the repository:**

   ```sh
   git clone https://github.com/EduLink-Project/AI-Backend.git
   cd <project_directory>
   ```

2. **Create and activate a virtual environment (optional but recommended):**

   ```sh
   python -m venv venv
   source venv/bin/activate  # On Windows use: venv\Scripts\activate
   ```

3. **Install dependencies:**

   ```sh
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**

   - The project includes an `.env` file with necessary configurations.
   - The `.env` file exist in the Docuemtns folders
   - Ensure you configure it as needed before running the application.

5. **Run the application:**

   ```sh
   python main.py
   ```

#### Troubleshooting

- If you encounter any missing dependencies, try upgrading `pip` and reinstalling:

  ```sh
  pip install --upgrade pip
  pip install -r requirements.txt --no-cache-dir
  ```

- Ensure your `.env` file is correctly configured and has the necessary environment variables.

### Usage Instructions

### Running the Application

- Execute the following command to start the application:

  ```sh
  python main.py
  ```

  or

  ``` sh
  pymon main.py     # start the application with Hot-Reload
  ```

- If the application runs on a server, access it via:

  ``` sh
  0.0.0.0:3000
  ```

  (Adjust the port as per your configuration.)

### Environment Variables

- The `.env` file contains necessary configurations such as API keys, database credentials, or other settings.
- Ensure the variables are correctly set up before running the application.
