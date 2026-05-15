# Video-Call Platform

A modern, real-time video calling application built with Node.js, React, and Socket.IO. This project enables users to connect with others through peer-to-peer video communication with integrated messaging capabilities.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [WebSocket Events](#websocket-events)
- [Project Architecture](#project-architecture)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### Core Functionality
- **Real-time Video Calling**: Peer-to-peer video communication using WebRTC
- **Live Chat**: Send and receive messages during video calls
- **User Authentication**: Secure user registration and login with JWT tokens
- **Room Management**: Join specific call rooms using unique paths
- **User Presence**: Real-time notifications when users join or leave calls
- **Call History**: Track user activity and time spent in calls

### Security Features
- JWT-based authentication and authorization
- Password encryption using bcryptjs
- CORS protection with configurable origins
- Secure cookie-based session management

### User Experience
- Responsive Material-UI design
- Tailwind CSS styling
- Real-time user notifications
- Seamless room joining and disconnection

---

## Tech Stack

### Frontend
- **React 19** - UI library
- **Vite 8** - Build tool and development server
- **Socket.IO Client** - Real-time communication
- **Material-UI (MUI)** - Component library
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **React Router** - Client-side routing
- **React Icons** - Icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js 5** - Web framework
- **Socket.IO 4** - Real-time bidirectional communication
- **MongoDB** - NoSQL database
- **Mongoose 9** - MongoDB ODM
- **JWT (jsonwebtoken)** - Token-based authentication
- **bcryptjs** - Password hashing
- **Nodemon** - Development server with auto-reload
- **CORS** - Cross-origin resource sharing

---

## Project Structure

```
Video-Call/
├── Backend/
│   ├── src/
│   │   ├── app.js                 # Express app configuration
│   │   ├── controllers/
│   │   │   └── socketManager.js   # Socket.IO event handlers
│   │   ├── routes/
│   │   │   └── auth.routes.js     # Authentication endpoints
│   │   ├── db/
│   │   │   └── db.js              # Database connection
│   │   └── models/                # Mongoose schemas
│   ├── server.js                  # Server entry point
│   ├── package.json
│   └── .env                       # Environment variables
│
├── Frontend/
│   ├── src/
│   │   ├── components/            # React components
│   │   ├── pages/                 # Page components
│   │   ├── utils/                 # Utility functions
│   │   ├── App.jsx                # Root component
│   │   └── main.jsx               # Entry point
│   ├── public/                    # Static assets
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── README.md                      # This file
```

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16.x or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Package managers (comes with Node.js)
- **MongoDB** - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (cloud)
- **Git** - [Download](https://git-scm.com/)

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Jauhar-Eamam/Video-Call.git
cd Video-Call
```

### 2. Install Backend Dependencies

```bash
cd Backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../Frontend
npm install
```

---

## Configuration

### Backend Setup (.env file)

Create a `.env` file in the `Backend/` directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/video-call
# OR for MongoDB Atlas:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/video-call

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# Environment
ENVIRONMENT=development
```

**Important Security Notes:**
- Never commit `.env` files to version control
- Use strong JWT secrets in production
- Change all default values for production deployments
- For MongoDB Atlas, replace username and password with your credentials

### Frontend Setup

Create a `.env` file in the `Frontend/` directory (optional):

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

---

## Running the Application

### Development Mode

#### Start Backend Server

```bash
cd Backend
npm run dev
```

The backend server will run on `http://localhost:5000` with Nodemon watching for changes.

#### Start Frontend Development Server

In a new terminal:

```bash
cd Frontend
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Production Mode

#### Backend

```bash
cd Backend
npm run start
```

Or with PM2:

```bash
npm run prod
```

#### Frontend

Build the frontend:

```bash
cd Frontend
npm run build
```

Then serve the `dist` folder using a static server or deploy to a hosting platform.

---

## API Endpoints

### Authentication Endpoints

All endpoints are prefixed with `/api/auth`

#### Register User
- **Method:** `POST`
- **Endpoint:** `/register`
- **Body:**
  ```json
  {
    "username": "john_doe",
    "email": "john@example.com",
    "password": "securePassword123"
  }
  ```
- **Response:** User object with JWT token

#### Login User
- **Method:** `POST`
- **Endpoint:** `/login`
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "securePassword123"
  }
  ```
- **Response:** User object with JWT token

#### Get Current User
- **Method:** `GET`
- **Endpoint:** `/me`
- **Authentication:** Required (JWT Token)
- **Response:** Current user object

#### Logout
- **Method:** `POST`
- **Endpoint:** `/logout`
- **Authentication:** Required (JWT Token)
- **Response:** Success message

---

## WebSocket Events

The application uses Socket.IO for real-time communication. Below are the main events:

### Client → Server Events

#### `join-call`
Join a video call room
- **Parameters:** `path` (string) - Unique room identifier
- **Usage:**
  ```javascript
  socket.emit('join-call', '/room123');
  ```

#### `signal`
Send WebRTC signaling data to another peer
- **Parameters:**
  - `toId` (string) - Socket ID of the recipient
  - `message` (object) - WebRTC signal data
- **Usage:**
  ```javascript
  socket.emit('signal', recipientSocketId, signalData);
  ```

#### `chat-message`
Send a chat message during a call
- **Parameters:**
  - `data` (string) - Message content
  - `sender` (string) - Sender's name
- **Usage:**
  ```javascript
  socket.emit('chat-message', 'Hello!', 'John');
  ```

### Server → Client Events

#### `user-joined`
Fired when a new user joins the call
- **Parameters:**
  - `socketId` (string) - New user's socket ID
  - `users` (array) - List of all users in the room
- **Usage:**
  ```javascript
  socket.on('user-joined', (socketId, users) => {
    console.log('User joined:', socketId);
  });
  ```

#### `signal`
Received WebRTC signaling data from a peer
- **Parameters:**
  - `fromId` (string) - Socket ID of the sender
  - `message` (object) - WebRTC signal data
- **Usage:**
  ```javascript
  socket.on('signal', (fromId, message) => {
    handleSignal(fromId, message);
  });
  ```

#### `chat-message`
Received a chat message from another user
- **Parameters:**
  - `data` (string) - Message content
  - `sender` (string) - Sender's name
  - `socketId` (string) - Sender's socket ID
- **Usage:**
  ```javascript
  socket.on('chat-message', (data, sender, socketId) => {
    console.log(`${sender}: ${data}`);
  });
  ```

#### `user-left`
Fired when a user leaves the call
- **Parameters:**
  - `socketId` (string) - Socket ID of the user who left
- **Usage:**
  ```javascript
  socket.on('user-left', (socketId) => {
    console.log('User left:', socketId);
  });
  ```

---

## Project Architecture

### Communication Flow

```
┌─────────────────┐                    ┌─────────────────┐
│   User A        │                    │   User B        │
│   (Frontend)    │                    │   (Frontend)    │
└────────┬────────┘                    └────────┬────────┘
         │                                      │
         │ HTTP/REST                            │
         ├─────────────────────────────────────┤
         │                                      │
         │ Socket.IO (WebSocket)                │
         │  ├─ join-call                        │
         │  ├─ signal (WebRTC SDP/ICE)         │
         │  ├─ chat-message                    │
         │  └─ user-joined/user-left          │
         │                                      │
         └─────────────────────────────────────┘
                        ↓
              ┌──────────────────┐
              │  Express Server  │
              │  + Socket.IO     │
              ├──────────────────┤
              │ Auth Router      │
              │ Socket Manager   │
              └────────┬─────────┘
                       │
                       ↓
              ┌──────────────────┐
              │    MongoDB       │
              │   (User Data)    │
              └──────────────────┘
```

### Key Components

1. **Socket.IO Server**: Manages real-time connections and message routing
2. **Express Router**: Handles HTTP authentication endpoints
3. **MongoDB**: Stores user credentials and session data
4. **React Frontend**: Provides user interface and WebRTC peer connections

---

## Development

### Running Tests

```bash
cd Backend
npm test
```

### Linting Frontend Code

```bash
cd Frontend
npm run lint
```

### Building Frontend for Production

```bash
cd Frontend
npm run build
npm run preview
```

### Debugging

**Backend:**
- Use `console.log()` statements or configure a debugger
- Check logs in the terminal running the server

**Frontend:**
- Use browser DevTools (F12 in Chrome/Firefox)
- Check console for Socket.IO connection status

---

## Best Practices

### Security
1. Never expose `.env` files in version control
2. Use HTTPS in production
3. Implement rate limiting on authentication endpoints
4. Validate and sanitize all user inputs
5. Use strong passwords and JWT secrets

### Performance
1. Optimize media streams for bandwidth
2. Implement proper error handling and reconnection logic
3. Monitor WebSocket connection health
4. Use lazy loading for frontend components

### Code Quality
1. Follow ESLint rules configured in the project
2. Add unit tests for critical functions
3. Document complex logic with comments
4. Keep components modular and reusable

---

## Troubleshooting

### Backend won't connect to MongoDB
- Verify MongoDB is running
- Check connection string in `.env`
- Ensure firewall allows connection on MongoDB port (27017)

### Frontend can't connect to backend
- Verify backend is running on the correct port
- Check CORS configuration in `Backend/src/app.js`
- Ensure Socket.IO URL in frontend matches backend

### WebRTC connection fails
- Check browser WebRTC support
- Verify firewall allows WebRTC connections
- Check browser console for specific errors

### "Cannot find module" errors
- Run `npm install` in the respective directory
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`

---

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure your code follows the project's style guide and includes appropriate tests.

---

## License

This project is licensed under the ISC License - see the LICENSE file for details.

---

## Support

For issues, questions, or suggestions:
- Open an [Issue](https://github.com/Jauhar-Eamam/Video-Call/issues)
- Contact the maintainer: [@Jauhar-Eamam](https://github.com/Jauhar-Eamam)

---

## Acknowledgments

- [Socket.IO](https://socket.io/) - Real-time communication
- [React](https://react.dev/) - UI library
- [Express.js](https://expressjs.com/) - Web framework
- [Material-UI](https://mui.com/) - Component library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework

---

**Last Updated:** May 15, 2026
**Version:** 1.0.0
