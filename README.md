# Planat School - Social Networks

A backend project built with **Node.js** and **TypeScript** for managing school-based social networks. The project follows a modular structure using controllers, models, and routes with environment variable support.

## 📂 Project Structure
├── src
│ ├── controllers/ # Route handler logic
│ ├── models/ # Database models/schemas
│ ├── routes/ # API route definitions
│ ├── config/ # Environment/configuration files
│ ├── middlewares/ # Custom middlewares
│ ├── utils/ # Utility/helper functions
| |__ app.ts/ # Manage Routes file      
│ └── server.ts # Main entry point
├── .env # Environment variables
├── package.json
├── tsconfig.json
└── README.md

## 🚀 Features

- User authentication & roles (e.g., Admin, Teacher, Student, Parent)
- Social networking between students, teachers, and parents
- RESTful API architecture
- Environment variable management with `.env`
- Modular folder structure for scalability
- Written in **TypeScript** for type safety

1️⃣ Clone the repository:

```bash
git clone https://github.com/Forth-Tech4/Usermanagementdashboardback.git
cd Usermanagementdashboardback

2️⃣ Install dependencies:
npm install

3️⃣ Setup environment variables:

PORT=8001
JWT_SECRET="mysecret"

4️⃣ Run the project:
npm run dev
