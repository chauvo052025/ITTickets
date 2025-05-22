````markdown
# IT Support Ticketing and Tracking System

## Overview

This project is an **online IT support ticketing and tracking system** designed to manage support requests across multiple campuses. It enables supervisors and IT staff to efficiently assign, track, resolve, and escalate tickets based on severity levels, ensuring quick and organized responses to IT issues. The system supports mobile devices and integrates features for ticket tracking, reporting, and end-user interaction.

## Features

### Core Features

- **Multi-Campus Support**: Handle IT support requests from multiple campuses, each with its own set of tickets.
- **Ticket Assignment**: Supervisors can assign IT staff to support tickets. If no staff is assigned, the system automatically assigns IT staff based on severity.
    - **Normal Severity**: Assigned within 30 minutes.
    - **Urgent Severity**: Assigned within 5 minutes.
    - **Mission-Critical Severity**: Assigned within 3 minutes.
- **Self-Assignment**: IT staff members can assign themselves to unassigned tickets.
- **Ticket Tracking and Documentation**: The system allows IT staff to document their fixes and track the status of each ticket.
- **Escalation and Additional Support**: Tickets can be escalated if needed, and users can request additional support.
- **End-User Ticket Closure**: End-users can confirm the closure of a ticket once the issue is resolved.
- **Searchable Past Cases**: A searchable repository of past cases and fixes that can serve as a knowledge base or FAQ/self-help center.
- **Mobile Support**: The system is mobile-friendly and can be accessed from any device.

### System Views

The solution provides different user environments:

- **End-User**: A simple interface to report and track issues, as well as confirm the resolution of support tickets.
- **Manager View**: Offers an overview of all support tickets, providing managers the ability to manage resources and overall ticket distribution.
- **Supervisor View**: Supervisors can assign IT staff, track the progress of support cases, and ensure timely resolution of tickets.
- **IT Support View**: IT support staff can manage, document, and resolve support cases, including updating ticket statuses and logging fixes.

## Requirements

### Prerequisites

Before setting up the project, make sure you have the following installed on your machine:

- **Node.js** (Recommended version: v16.x or higher)
- **npm** (Node Package Manager)
- **Git** (For version control)

### Environment Configuration

You may need to set environment variables for local development or production deployment. Here’s a list of common environment variables:

```bash
DB_CONNECTION_STRING=your-database-connection-string
SUPPORT_EMAIL=support@example.com
SUPPORT_API_KEY=your-api-key
PORT=3000
````

## Installation

Follow the steps below to set up the system on your local machine:

### 1. Clone the Repository

Start by cloning the repository to your local machine:

```bash
git clone https://github.com/your-username/it-support-ticketing-system.git
cd it-support-ticketing-system
```

### 2. Install Dependencies

Install all necessary dependencies using npm:

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory of the project and set your environment variables:

```bash
DB_CONNECTION_STRING=your-database-connection-string
SUPPORT_EMAIL=support@example.com
SUPPORT_API_KEY=your-api-key
```

### 4. Run the Development Server

Run the development server to start the application:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000) by default.

### 5. Building for Production

To build the project for production, run the following command:

```bash
npm run build
```

This will generate the production-ready code in the `dist` directory.

## Folder Structure

Here’s an overview of the project directory structure:

```
src/                  # Contains all the source code for the application (frontend and backend)
  components/          # UI components
  controllers/         # Handles logic for ticket creation, assignment, and resolution
  services/            # External API integrations, database operations
  models/              # Data models and schemas (for MongoDB, PostgreSQL, etc.)
  views/               # Server-side rendered views (if applicable)
public/                # Static assets like images, fonts, and icons
dist/                  # Compiled files after build (production)
index.html            # Main HTML template
package.json           # Defines project dependencies and scripts
package-lock.json      # Lock file for npm dependencies
vite.config.ts         # Configuration file for Vite (if using Vite as a build tool)
tailwind.config.js     # Tailwind CSS configuration file
postcss.config.js      # PostCSS configuration file
tsconfig.json          # TypeScript configuration file
eslint.config.js       # ESLint configuration file
.gitignore             # Specifies files to be ignored by Git (e.g., node_modules, build files)
```

## Usage

### Reporting a Support Ticket (End-User)

1. Navigate to the **End-User** view.
2. Select the appropriate **severity level** for your issue (Normal, Urgent, or Mission-Critical).
3. Provide a **description** of the issue and submit the ticket.
4. Track the progress of your ticket through the dashboard.
5. Confirm the resolution and closure of the ticket when notified.

### Managing Support Tickets (Supervisor/Manager/IT Support)

1. Supervisors can **assign IT staff** to support tickets.
2. IT staff can **self-assign** to unassigned tickets based on availability.
3. Tickets will be **escalated** automatically if unresolved within specified time limits.
4. All actions (assignments, documentation, resolutions) are logged for transparency.

## Contributing

We welcome contributions to enhance the system. To contribute:

1. **Fork the repository** to your GitHub account.
2. **Clone the forked repository** to your local machine.
3. Create a new **branch** for your changes.
4. Make your changes and **commit** them.
5. Push the changes to your forked repository.
6. Submit a **pull request** for review.

Please make sure your code follows the project's coding conventions and passes all tests.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Acknowledgments

* **Tailwind CSS**: For fast and responsive UI design.
* **Vite**: For a fast and modern development build tool.
* **ESLint**: For maintaining code quality and consistency.
* **PostCSS**: For advanced CSS processing.

## Contact

For further inquiries or questions, please contact the project maintainer at:

* Email: [vongocchauIT@gmail.com](mailto:vongocchauIT@gmail.com)
* GitHub: [vongocchauIT](https://github.com/chaungocvoIT)

```
