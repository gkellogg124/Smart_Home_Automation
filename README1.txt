
# Smart Home Automation System

This README provides the necessary steps to set up and run the Smart Home Automation System project.

## Prerequisites

1. **Node.js and npm**: Make sure Node.js (v14 or later) and npm are installed on your machine.
2. **SQLite**: This project uses an SQLite database. Ensure SQLite is installed if you'd like to interact with the database directly.

## Setup Instructions

1. **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd <project-folder>
    ```

2. **Install Dependencies**:
    Use npm to install the required packages listed in `package.json`.
    ```bash
    npm install
    ```

3. **Set Up the Database**:
    - The project uses an SQLite database (`database.db`). Ensure the `database.db` file is in the root project folder.
    - If the database does not exist, the server will automatically create it on the first run with the necessary tables (devices, users, schedules, alerts).

4. **Run the Server**:
    Start the Express server with:
    ```bash
    npm start
    ```
    or
    ```bash
    node app.js
    ```

5. **Access the Application**:
    - Open a web browser and navigate to `http://localhost:3000` to access the Smart Home Automation System dashboard.
    - Log in with the default user roles or create users as needed.

## Project Structure

- `app.js`: Main server file setting up Express routes and database interactions.
- `views/`: Contains EJS templates for the frontend.
- `public/`: Holds static files like CSS stylesheets and icons.
- `database.db`: SQLite database file used by the application.

## Usage

- **Dashboard**: Provides quick access to manage devices, user roles, scheduling, diagnostics, and alerts.
- **Device Management**: Add, remove, and control devices.
- **Role Management**: Assign roles (Admin, Homeowner, Technician) to users.
- **Scheduling**: Schedule device actions at specific times.
- **Diagnostics**: Run tests on devices for troubleshooting.
- **Alerts**: View notifications for device status changes and scheduled actions.

## Additional Notes

- **Development Mode**: Use `nodemon` for auto-reloading during development.
    ```bash
    npm install -g nodemon
    nodemon app.js
    ```

- **Port Configuration**: By default, the app runs on port 3000. Adjust the port in `app.js` if needed.

## Troubleshooting

- **Database Issues**: Ensure `database.db` is accessible and SQLite is functioning correctly.
- **Dependency Errors**: Run `npm install` to ensure all dependencies are up to date.
