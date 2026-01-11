# 🏗️ EDLIST - Modern Project Management System

EDLIST is a powerful, production-ready Project Management System designed for teams to collaborate, track tasks, and manage projects in real-time. Built with the MERN stack (PostgreSQL with Prisma), it features a sleek dashboard, interactive charts, and a responsive UI.

![Dashboard Preview](https://github.com/shasbinas/project-management/raw/main/preview.png) *(Note: Replace with your actual hosted image if available)*

## 🚀 Key Features

- **📊 Comprehensive Dashboard**: Visualize task priority distribution and project status with interactive charts.
- **📅 Project & Task Tracking**: Create projects, assign tasks, set priorities, and track progress through various views (List, Board, Timeline, Table).
- **👥 Team Management**: Organize users into teams and assign roles like Product Owner or Project Manager.
- **🔐 Secure Authentication**: Integrated with AWS Cognito / Custom JWT for secure user login and registration.
- **🖼️ Profile & Attachments**: Upload profile pictures and task attachments with AWS S3 integration.
- **🌓 Dark Mode**: Fully responsive design with a beautiful dark mode experience.
- **🔍 Global Search**: Quickly find tasks, projects, and users across the entire platform.

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) & [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Components**: [MUI DataGrid](https://mui.com/x/react-data-grid/), [Lucide React](https://lucide.dev/)
- **Timeline**: [gantt-task-react](https://github.com/MaTeMaTuK/gantt-task-react)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Auth**: [AWS Cognito](https://aws.amazon.com/cognito/) / custom JWT
- **File Storage**: [AWS S3](https://aws.amazon.com/s3/)

## ⚙️ Project Structure

```bash
project-management/
├── client/          # Next.js Frontend
│   ├── src/app/     # App Router Pages
│   ├── src/state/   # Redux & RTK Query
│   └── public/      # Static Assets
└── server/          # Express.js Backend
    ├── prisma/      # Database Schema & Seed Data
    └── src/         # Controllers & Routes
```

## 🏁 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database
- AWS Account (for Cognito & S3)

### 1. Setup Backend
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory:
```env
PORT=8000
DATABASE_URL="your_postgresql_url"
AWS_COGNITO_USER_POOL_ID="your_pool_id"
AWS_COGNITO_CLIENT_ID="your_client_id"
AWS_S3_BUCKET_NAME="your_bucket_name"
AWS_REGION="your_region"
```
Initialize Database:
```bash
npx prisma generate
npx prisma db push
npm run seed
```

### 2. Setup Frontend
```bash
cd client
npm install
```
Create a `.env.local` file in the `client` directory:
```env
NEXT_PUBLIC_API_BASE_URL="http://localhost:8000"
NEXT_PUBLIC_COGNITO_USER_POOL_ID="your_pool_id"
NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID="your_client_id"
```

### 3. Run Locally
**Start Server:**
```bash
cd server
npm run dev
```
**Start Client:**
```bash
cd client
npm run dev
```

## 📜 License
This project is licensed under the [ISC License](LICENSE).

---
Developed with ❤️ by [Shasbin AS](https://github.com/shasbinas)
