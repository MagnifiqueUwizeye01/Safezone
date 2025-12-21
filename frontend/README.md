# SafeZone - Community Safety Platform

SafeZone is a comprehensive community safety and incident reporting platform designed to enhance public safety through technology-enabled collaboration between citizens, law enforcement, and administrators.

## Overview

SafeZone enables citizens to report security incidents, police officers to monitor and respond to reports, and administrators to manage the entire safety ecosystem. The platform leverages location-based services to ensure that safety information reaches the right people at the right time.

## Features

- **Incident Reporting**: Citizens can submit detailed incident reports with location tracking
- **Alert System**: Location-based alert broadcasting for real-time safety notifications
- **User Management**: Role-based access control (Admin, Police, Citizen)
- **Location Management**: Hierarchical location structure for precise incident mapping
- **Dashboard Analytics**: Comprehensive statistics and insights for administrators
- **Two-Factor Authentication**: Enhanced security with OTP-based authentication
- **Global Search**: Search functionality across all platform data
- **Responsive Design**: Modern, mobile-friendly user interface

## Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/MagnifiqueUwizeye01/Safezone-frontend.git
cd Safezone-frontend
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory
```env
VITE_API_BASE_URL=http://localhost:8080
```

4. Start the development server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
safezone-frontend/
├── src/
│   ├── api/           # API services and configuration
│   ├── components/    # Reusable React components
│   ├── context/       # React Context providers
│   ├── hooks/         # Custom React hooks
│   ├── pages/         # Page components
│   ├── routes/        # Route configuration
│   ├── utils/         # Utility functions
│   └── styles/        # Global styles
├── public/            # Static assets
└── package.json       # Project dependencies
```

## User Roles

- **Admin**: Full system access, user management, analytics
- **Police**: Report management, alert creation, incident monitoring
- **Citizen**: Report submission, alert viewing, profile management

## License

This project is developed for academic purposes.

