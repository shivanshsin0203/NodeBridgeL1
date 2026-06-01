# NodeBridge L1

![Node.js](https://img.shields.io/badge/Node.js-18-339933)
![Express](https://img.shields.io/badge/Express-4.19-000000)
![Socket.io](https://img.shields.io/badge/Socket.io-4.7-010101)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED)
![License](https://img.shields.io/badge/License-ISC-lightgrey)

A lightweight HTTP and WebSocket server bridge that provides a remote development environment with terminal emulation, file management, and code execution capabilities.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Screenshots](#screenshots)
- [Prerequisites](#prerequisites)
- [Installation and Setup](#installation-and-setup)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [Docker Usage](#docker-usage)
- [API Routes](#api-routes)
- [WebSocket Events](#websocket-events)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Remote Terminal Emulation** - Full terminal access via WebSocket using node-pty
- **File Management** - Browse, read, and write files in the user workspace
- **Code Execution** - Run user code in an isolated environment with real-time output
- **Live File Syncing** - Automatic file change detection and synchronization using chokidar
- **Containerized Deployment** - Docker support for consistent environments
- **CORS Enabled** - Cross-origin support for web-based clients

## Tech Stack

- **Runtime:** Node.js 18.x
- **Framework:** Express.js 4.19.2
- **WebSocket:** Socket.io 4.7.5
- **Terminal:** node-pty 1.0.0
- **File Watching:** chokidar 3.6.0
- **HTTP Client:** axios 1.7.2
- **Process Management:** tree-kill 1.2.2

## Project Structure

```
NodeBridgeL1/
├── index.js              # Main entry point - server initialization
├── http.js               # HTTP API routes
├── ws.js                 # WebSocket server and terminal management
├── tree.js               # Directory tree utility
├── package.json          # Root dependencies
├── Dockerfile            # Container configuration
├── .dockerignore         # Docker ignore rules
└── user/                 # User workspace directory
    ├── index.js          # User application entry point
    └── package.json      # User application dependencies
```

## Screenshots

<!-- Add screenshots of your application here -->

> _Screenshots coming soon_

## Prerequisites

- **Node.js** 18.x or higher
- **npm** (comes with Node.js)
- **Docker** (optional, for containerized deployment)

## Installation and Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/shivanshsin0203/NodeBridgeL1.git
   cd NodeBridgeL1
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Install user workspace dependencies:
   ```bash
   cd user
   npm install
   cd ..
   ```

## Environment Variables

> ⚠️ **Note:** No `.env.example` file was found in this repository. The following variables were inferred from the source code and may be incomplete or inaccurate. Please verify against the actual codebase.

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3002` | Server listening port |
| `INIT_CWD` | `__dirname` | Initial working directory for user workspace |

## Running the Project

### Development Mode

```bash
node index.js
```

The server will start on the configured port (default: 3002):
```
listening on *:3002
```

### Using npm scripts

```bash
npm start
```

## Docker Usage

### Build the Docker Image

```bash
docker build -t nodebridge-l1 .
```

### Run the Container

```bash
docker run -p 3002:3002 nodebridge-l1
```

The Docker container includes:
- Ubuntu base image
- Node.js 18.x
- Python 3 and pip
- Build essentials
- All project dependencies pre-installed

## API Routes

### HTTP Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/project` | Create a new project container |
| `GET` | `/filetree` | Get directory tree of user workspace |
| `GET` | `/filecontent?path=<path>` | Get file contents |
| `POST` | `/run` | Execute user code in workspace |
| `POST` | `/stop` | Stop running user process |
| `GET` | `/live/*` | Serve static files from user workspace |

### Request/Response Examples

**Create Project:**
```json
POST /project
Body: { "replId": "abc123", "language": "javascript" }
Response: "Container created successfully! for replId: abc123 and language: javascript"
```

**Run Code:**
```json
POST /run
Response: { "url": "http://localhost:8000" }
```

**Stop Code:**
```json
POST /stop
Response: "Process terminated"
```

## WebSocket Events

### Client to Server

| Event | Data | Description |
|-------|------|-------------|
| `terminal:write` | `string` | Write data to terminal |
| `set:id` | `{ id: string }` | Set document/session ID |
| `file:change` | `{ path: string, content: string }` | Update file contents |

### Server to Client

| Event | Data | Description |
|-------|------|-------------|
| `terminal:data` | `string` | Terminal output data |
| `file:refresh` | `string` | File change notification with path |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the [package.json](package.json) file for details.