# ACM KARE Event Team Registration Portal

A futuristic, production-ready team registration portal built with React, Firebase, and cutting-edge UI/UX design for HACKARE 3.0.

## Features

- **Neural Network Background**: Animated particle system with interactive nodes and links
- **Splash Screen**: 12-second animated intro with ACM KARE logo featuring:
  - Logo zoom animation (scale 0.8 → 1.3 → 1)
  - Pulsating glow effects
  - Animated glowing line
  - Smooth transitions
- **Authentication**: Firebase email/password authentication with @klu.ac.in validation
- **Team Registration**: Complete form for 5-member teams (1 leader + 4 members)
- **Admin Dashboard**:
  - Real-time data updates with Firebase listeners
  - Attendance sheet format with all member rows
  - Alternating row colors (dark navy + blue gradient)
  - Smooth hover animations
  - Search functionality by team name
  - Animated row transitions on load
  - CSV and PDF export in attendance sheet format
  - Protected admin-only access
  - Team and member count statistics
- **Glassmorphism Design**: Beautiful blue diamond theme with glowing effects
- **Fully Responsive**: Works on all devices

## Admin Dashboard Format

The admin portal displays teams in a professional attendance sheet style:

| Team Number | Team Name   | Reg Number  | Name        |
|-------------|-------------|-------------|-------------|
| 1           | Tech Titans | 99230040428 | Thaha       |
| 1           | Tech Titans | 89          | TH          |
| 1           | Tech Titans | 1234        | THJS        |
| 1           | Tech Titans | 33445y38    | Member 4    |
| 1           | Tech Titans | 3           | Member 5    |
| 2           | Next Team   | ...         | ...         |

**Key Features:**
- Team Number and Team Name repeat for all members (attendance sheet style)
- Auto-generated team numbers (1, 2, 3...) based on registration order
- Alternating row colors with gradient backgrounds
- Visual separator between teams
- Hover effects with subtle scale and shadow
- First member of each team in bold

### Export Features

**CSV Export:**
- Professional attendance sheet format
- Team Name and Team Number on every row
- File name: `HackARE-3.0-Team-Details.csv`
- Clean, importable data structure

**PDF Export:**
- Professional document header:
  - ACM KARE logo (top-left corner)
  - "KALASALINGAM ACADEMY OF RESEARCH AND EDUCATION"
  - "KARE ACM STUDENT CHAPTER – HACKARE 3.0"
  - "TEAM REGISTRATION SHEET"
  - Generation date
- Formatted table with:
  - Black header row
  - Thin borders
  - Professional fonts
  - Proper column alignment
  - All team info repeated for each member
- File name: `HackARE-3.0-Team-Details.pdf`

## Tech Stack

- React 18
- TypeScript
- Firebase (Auth + Realtime Database)
- React Router DOM
- Framer Motion (Advanced animations)
- Tsparticles (Neural network background)
- React Toastify (Notifications)
- jsPDF + jsPDF-AutoTable (PDF generation)
- FileSaver.js (File downloads)
- Tailwind CSS
- Custom Google Fonts (Orbitron + Poppins)

## Admin Credentials

- Email: 99230040469@klu.ac.in
- Password: Thaha@555

## User Access

Any valid @klu.ac.in email can create an account and register teams.

## Animation Sequence

**Splash Screen (12 seconds):**
1. ACM KARE logo appears with zoom effect (0.8 → 1.3 → 1)
2. Continuous pulsating glow on logo
3. "ACM KARE Presents" text fades in below logo
4. Animated glowing line expands
5. "Event Team Registration Portal" text appears
6. Auto-redirect to login page

## Getting Started

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Project Structure

- `/src/components` - All React components
  - `NeuralNetworkBg.tsx` - Animated particle background
  - `SplashScreen.tsx` - Animated intro with ACM logo
  - `Login.tsx` - Authentication with toggle
  - `ProtectedRoute.tsx` - Route protection logic
  - `RegistrationForm.tsx` - Team registration form
  - `AdminDashboard.tsx` - Admin portal with attendance view
- `/src/firebase.js` - Firebase configuration
- `/src/AuthContext.tsx` - Authentication context provider
- `/src/index.css` - Global styles with custom classes
- `/public/ACM_LOGO.png` - Official ACM KARE logo

## Styling Features

- Glassmorphism cards with blur effects
- Neon blue glowing inputs and buttons
- Orbitron font for titles (futuristic)
- Poppins font for body text (clean)
- Custom scrollbar styling
- Hover animations throughout
- Alternating table row colors
- Professional color scheme (dark navy + cyan gradients)

## Export File Naming

- CSV: `HackARE-3.0-Team-Details.csv`
- PDF: `HackARE-3.0-Team-Details.pdf`

All exports maintain the attendance sheet format for easy printing and record-keeping.
# HACKARE_3.0-registration
