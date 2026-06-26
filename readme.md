# Workspace Task System API

Backend API for a workspace-based task system built with Express, TypeScript, Prisma, and MariaDB/MySQL.

## Overview

This project currently provides:

- User authentication
- Workspace creation and ownership
- Role-based workspace invitations
- Profile and avatar updates

The active routes mounted by the app are:

- `/api/auth`
- `/api/workspace`
- `/api/invitations`

## Tech Stack

- Node.js
- Express 5
- TypeScript
- Prisma
- MariaDB/MySQL
- JWT
- Multer
- Nodemailer

## Project Structure

```text
workspace-task-system/
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── config/
│   ├── lib/
│   ├── middlewares/
│   ├── modules/
│   │   ├── auth/
│   │   ├── invitation/
│   │   └── workspace/
│   ├── types/
│   └── utils/
├── uploads/
│   └── avatars/
├── package.json
└── readme.md
```

## Features

### Authentication

- Register with name, email, and password
- Login with email and password
- Generate access and refresh tokens
- Refresh access token
- Logout
- Get current user profile
- Update profile name
- Upload and update avatar

### Workspace Management

- Create a workspace
- Get the current user's workspace
- Update workspace name
- Delete workspace

### Invitation System

- Invite users by email
- Restrict invitations by role
- Inspect invitation details by token
- Accept an invitation as the invited user

## Roles

- `owner`: can manage the workspace and invite `admin` or `member`
- `admin`: can invite `member`
- `member`: basic workspace member access

## Requirements

- Node.js 20+ recommended
- MariaDB or MySQL
- SMTP credentials for email sending

## Environment Variables

Create a `.env` file in the project root.

```env
PORT=3000

DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/DATABASE"

DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=your_password
DATABASE_NAME=workspace_task_system

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_SECRET=your_invitation_secret

MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_password

FRONTEND_URL=http://localhost:5173
```

Notes:

- `DATABASE_URL` is used by Prisma CLI for migrations.
- `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USER`, `DATABASE_PASSWORD`, and `DATABASE_NAME` are used by the runtime Prisma adapter.
- `MAIL_USER` and `MAIL_PASS` are used for invitation emails.
- The server currently listens on port `3000` directly in code.
- `FRONTEND_URL` exists for future frontend invitation flow, but the invitation link is currently hardcoded to a localhost API URL.

## Installation

```bash
npm install
```

Generate Prisma client:

```bash
npx prisma generate
```

Run migrations:

```bash
npx prisma migrate dev
```

## Available Scripts

```bash
npm run dev
npm run build
npm start
```

- `npm run dev` starts the app with `tsx watch src/server.ts`
- `npm run build` compiles TypeScript
- `npm start` runs the compiled output from `dist/server.js`

## Running the Project

Development:

```bash
npm run dev
```

Production:

```bash
npm run build
npm start
```

Base URL:

```text
http://localhost:3000
```

## API Endpoints

### Auth

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive tokens |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Logout current user |
| GET | `/api/auth/me` | Get current profile |
| PATCH | `/api/auth/profile` | Update profile name |
| PATCH | `/api/auth/avatar` | Upload avatar |

### Workspace

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/workspace` | Create workspace |
| GET | `/api/workspace` | Get current workspace |
| PATCH | `/api/workspace` | Update workspace name |
| DELETE | `/api/workspace` | Delete workspace |

### Invitations

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/invitations` | Send invitation |
| GET | `/api/invitations?invitationToken=...` | Get invitation details |
| POST | `/api/invitations/accept` | Accept invitation |

## Authentication

Protected routes use the `Authorization` header:

```http
Authorization: Bearer <access_token>
```

Refresh token requests currently also use the `Authorization` header:

```http
Authorization: Bearer <refresh_token>
```

## Request Notes

- Avatar upload uses `multipart/form-data`
- Avatar field name is `avatar`
- Invitation acceptance expects `invitationToken` in the request body

Successful responses follow this shape:

```json
{
  "success": true,
  "message": "Request successful",
  "data": {}
}
```

Error responses follow this shape:

```json
{
  "success": false,
  "message": "Error message",
  "errorCode": "SERVER_ERROR"
}
```

## Typical Flow

1. Register a user.
2. Login and store the returned access token and refresh token.
3. Create a workspace.
4. Invite another user with a role.
5. Open the invitation link or fetch invitation details by token.
6. Login as the invited user.
7. Accept the invitation.

## Current Limitations

- The app currently mounts only auth, workspace, and invitation modules.
- `PORT` is declared in `.env` but the server code currently uses `3000` directly.
- `src/config/env.ts` is still a placeholder.
- `prisma/seed.ts` is not implemented yet.
- Invitation links are currently built with a localhost API URL instead of `FRONTEND_URL`.
