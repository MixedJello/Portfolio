# Portfolio Website

I did a thing! This is a responsive portfolio website built with Next.js, Go, and Docker. This project features a simple design but with some fun interaction integrated within using Matter.JS. Smooth animation and scrolling used within GSAP and Lenis. For the backend I built a contact form that sends emails directly from the website.

## 🚀 Features

- Modern, responsive design
- Smooth animations and transitions
- Contact form with email functionality
- Docker containerization for easy deployment
- Nginx reverse proxy for optimal routing
- Health check endpoints for monitoring
- Environment variable configuration
- Production-ready setup

## 🛠️ Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **Backend**: Go (Gin framework)
- **Containerization**: Docker
- **Reverse Proxy**: Nginx
- **Process Management**: Supervisor
- **Email Service**: SMTP
- **Deployment**: Render.com

## 📋 Prerequisites

- Docker and Docker Compose
- Go 1.23 or later
- Node.js 20 or later
- npm or yarn

## 🔧 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# SMTP Configuration
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password

# Port Configuration (optional)
PORT=8080
```

## 🚀 Getting Started

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/yourusername/portfolio.git
cd portfolio
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your SMTP credentials
```

3. Start the development environment:
```bash
docker compose up --build
```

4. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Nginx: http://localhost:8080

### Production Deployment

The project is configured for deployment on Render.com:

1. Push your code to GitHub
2. Create a new Web Service on Render.com
3. Connect your GitHub repository
4. Set the following environment variables in Render:
   - `SMTP_USER`
   - `SMTP_PASS`
   - `PORT` (optional, defaults to 8080)

## 🏗️ Project Structure

```
portfolio/
├── frontend/           # Next.js frontend application
├── backend/           # Go backend application
├── docker/            # Docker-related files
├── nginx.conf         # Nginx configuration
├── supervisord.conf   # Supervisor configuration
├── Dockerfile         # Main Dockerfile
├── docker-compose.yml # Docker Compose configuration
└── README.md          # This file
```

## 🔍 Health Checks

The application includes health check endpoints:

- Frontend: `http://localhost:8080/`
- Backend: `http://localhost:8080/health`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👤 Author

Tyler McGue - https://www.linkedin.com/in/tyler-mcgue-insert-job-here/ - tylermcgue@gmail.com

Project Link: https://github.com/MixedJello/Portfolio
