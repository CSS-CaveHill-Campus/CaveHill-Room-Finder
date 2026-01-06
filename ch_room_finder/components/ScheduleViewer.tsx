'use client';

import { useState, useEffect } from 'react';
import { getSchedule, getRooms, getPrefixes } from '@/lib/api';
import type { ScheduleItem, Day, Faculty, PrefixItem } from '@/types/api';
import { DAY_LABELS, CLASS_TYPE_LABELS, FACULTY_LABELS } from '@/types/api';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

export default function ScheduleViewer() {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [rooms, setRooms] = useState<string[]>([]);
  const [prefixes, setPrefixes] = useState<PrefixItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [selectedDay, setSelectedDay] = useState<Day | ''>('');
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | ''>('');
  const [selectedPrefix, setSelectedPrefix] = useState<string>('');
  const [limit, setLimit] = useState<number>(20);

  // Load initial data
  useEffect(() => {
    Promise.all([getRooms(), getPrefixes()])
      .then(([roomsData, prefixesData]) => {
        setRooms(roomsData);
        setPrefixes(prefixesData);
      })
      .catch((err) => {
        console.error('Failed to load initial data:', err);
      });
  }, []);

  // Fetch schedule
  const fetchSchedule = async () => {
    setLoading(true);
    setError(null);

    try {
      const params: any = { limit };
      if (selectedDay) params.day = selectedDay;
      if (selectedRoom) params.room = selectedRoom;
      if (selectedPrefix) {
        params.prefix = selectedPrefix;
      } else if (selectedFaculty) {
        params.faculty = selectedFaculty;
      }

      const data = await getSchedule(params);
      setSchedule(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch schedule');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, [selectedDay, selectedRoom, selectedFaculty, selectedPrefix, limit]);

  // Get filtered prefixes based on selected faculty
  const filteredPrefixes = selectedFaculty
    ? prefixes.filter((p) => p.faculty.toLowerCase() === selectedFaculty)
    : prefixes;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Filters
        </h3>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Day Filter */}
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Day
            </label>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value as Day | '')}
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
            >
              <option value="">All Days</option>
              {Object.entries(DAY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Room Filter */}
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Room
            </label>
            <select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
            >
              <option value="">All Rooms</option>
              {rooms.map((room) => (
                <option key={room} value={room}>
                  {room}
                </option>
              ))}
            </select>
          </div>

          {/* Faculty Filter */}
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Faculty
            </label>
            <select
              value={selectedFaculty}
              onChange={(e) => {
                setSelectedFaculty(e.target.value as Faculty | '');
                setSelectedPrefix(''); // Reset prefix when faculty changes
              }}
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
            >
              <option value="">All Faculties</option>
              {Object.entries(FACULTY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Prefix Filter */}
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Course Prefix
            </label>
            <select
              value={selectedPrefix}
              onChange={(e) => setSelectedPrefix(e.target.value)}
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
            >
              <option value="">All Prefixes</option>
              {filteredPrefixes.map((prefix) => (
                <option key={prefix.prefix} value={prefix.prefix}>
                  {prefix.prefix} - {prefix.desc}
                </option>
              ))}
            </select>
          </div>

          {/* Limit Filter */}
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Results Limit
            </label>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={0}>All</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      {loading && <LoadingSpinner message="Fetching schedule..." />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && schedule.length === 0 && (
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-8 text-center dark:border-zinc-800 dark:bg-zinc-900/50">
          <p className="text-zinc-600 dark:text-zinc-400">
            No classes found with the selected filters.
          </p>
        </div>
      )}

      {!loading && !error && schedule.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Schedule Results
            </h3>
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              {schedule.length} {schedule.length === 1 ? 'class' : 'classes'}
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {schedule.map((item, index) => (
              <div
                key={index}
                className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                      {item.course_code}
                    </h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {CLASS_TYPE_LABELS[item.class_type as 'L' | 'T']}
                    </p>
                  </div>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    {DAY_LABELS[item.day]}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <svg
                      className="mr-2 h-4 w-4 text-zinc-500"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-zinc-700 dark:text-zinc-300">
                      {item.start_time}:00 - {item.end_time}:00
                    </span>
                  </div>

                  <div className="flex items-center text-sm">
                    <svg
                      className="mr-2 h-4 w-4 text-zinc-500"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="text-zinc-700 dark:text-zinc-300">
                      {item.room} - {item.building}
                    </span>
                  </div>

                  <div className="flex items-center text-sm">
                    <svg
                      className="mr-2 h-4 w-4 text-zinc-500"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs text-zinc-600 dark:text-zinc-400">
                      {item.start_date} - {item.end_date}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
