# CaveHill Room Finder

CaveHill Room Finder is a modern web application that helps students at the University of the West Indies Cave Hill Campus find available classrooms and view room schedules.

## Features

- **Find Free Rooms**: Search for available rooms by day, time, and duration
- **View Schedule**: Browse class schedules with filters for faculty, day, room, and course prefix
- **Modern UI**: Clean, responsive design that works on all devices
- **Dark Mode**: Automatic dark mode support based on system preferences
- **Real-time Search**: Filter results instantly as you change criteria

## Tech Stack

- **Next.js 16**: React framework with App Router
- **React 19**: UI library
- **TypeScript**: Type-safe development
- **Tailwind CSS 4**: Utility-first CSS framework
- **Bun**: Fast JavaScript runtime and package manager

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) installed on your system

### Installation

1. Install dependencies:
```sh
bun install
```

2. Start the development server:
```sh
bun run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```sh
bun run build
bun run start
```

## API

This application connects to the CHRoomFinder API at:
- Base URL: `https://chroomfinduh.onrender.com/api/v1`

The API provides endpoints for:
- `/schedule` - Class schedules
- `/free` - Available rooms
- `/rooms` - List of all rooms
- `/prefixes` - Course prefixes by faculty

Note: The API is hosted on Render's free tier, so the first request may take up to 1 minute while the service spins up.

## Project Structure

```
ch_room_finder/
├── app/              # Next.js app directory
│   ├── globals.css   # Global styles
│   ├── layout.tsx    # Root layout
│   └── page.tsx      # Home page with tabs
├── components/       # React components
│   ├── ErrorMessage.tsx
│   ├── FreeRoomsFinder.tsx
│   ├── LoadingSpinner.tsx
│   └── ScheduleViewer.tsx
├── lib/              # Utilities and API client
│   └── api.ts
└── types/            # TypeScript type definitions
    └── api.ts
```

## Contributing

Feel free to submit issues and enhancement requests.

## License

Refer to the main project LICENSE.
