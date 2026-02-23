'use client';

import { useState } from 'react';
import ScheduleViewer from '@/components/ScheduleViewer';
import FreeRoomsFinder from '@/components/FreeRoomsFinder';

type Tab = 'schedule' | 'free';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('free');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-zinc-950 dark:to-zinc-900">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/80">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                CaveHill Room Finder
              </h1>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Find available rooms at UWI Cave Hill Campus
              </p>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5 text-zinc-500"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                UWI Cave Hill
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="mb-6">
          <p>Note: The current website is being hosted for free, so there may be issues when loading </p>
          <div className="border-b border-zinc-200 dark:border-zinc-800">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('free')}
                className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium transition-colors ${activeTab === 'free'
                  ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                  : 'border-transparent text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-300'
                  }`}
              >
                <div className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Find Free Rooms
                </div>
              </button>

              <button
                onClick={() => setActiveTab('schedule')}
                className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium transition-colors ${activeTab === 'schedule'
                  ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                  : 'border-transparent text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-300'
                  }`}
              >
                <div className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  View Schedule
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="rounded-lg">
          {activeTab === 'free' && <FreeRoomsFinder />}
          {activeTab === 'schedule' && <ScheduleViewer />}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-zinc-200 bg-white/50 py-6 dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Made for UWI Cave Hill students
          </p>
        </div>
      </footer>
    </div>
  );
}
