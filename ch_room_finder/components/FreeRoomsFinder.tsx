'use client';

import { useState, useEffect } from 'react';
import { getFreeRooms, getRooms } from '@/lib/api';
import type { FreeRoomItem, Day } from '@/types/api';
import { DAY_LABELS } from '@/types/api';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import SearchableDropdown from './SearchableDropdown';

export default function FreeRoomsFinder() {
  const [freeRooms, setFreeRooms] = useState<FreeRoomItem[]>([]);
  const [allRooms, setAllRooms] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [is500Error, setIs500Error] = useState(false);

  // Filter states
  const [selectedDay, setSelectedDay] = useState<Day>('mon');
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [selectedHour, setSelectedHour] = useState<string>('');
  const [duration, setDuration] = useState<number>(1);

  // Load rooms, filtering out "None" values
  useEffect(() => {
    getRooms()
      .then((rooms) => {
        const validRooms = rooms.filter(
          (room) => room && room.toLowerCase() !== 'none'
        );
        setAllRooms(validRooms);
      })
      .catch((err) => {
        console.error('Failed to load rooms:', err);
      });
  }, []);

  // Fetch free rooms, filtering out "None" values
  const fetchFreeRooms = async () => {
    if (!selectedDay) return;

    setLoading(true);
    setError(null);
    setIs500Error(false);

    try {
      const params: any = { day: selectedDay };
      if (selectedRoom) params.room = selectedRoom;
      if (selectedHour) {
        params.hour = parseInt(selectedHour);
        params.duration = duration;
      }

      const data = await getFreeRooms(params);

      // Filter out any rooms with "None" values
      const validRooms = data.filter(
        (room) =>
          room.room &&
          room.room.toLowerCase() !== 'none' &&
          room.building &&
          room.building.toLowerCase() !== 'none'
      );

      setFreeRooms(validRooms);
    } catch (err) {
      const error = err as Error & { status?: number };
      setError(error.message || 'Failed to fetch free rooms');
      if (error.status === 500) {
        setIs500Error(true);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFreeRooms();
  }, [selectedDay, selectedRoom, selectedHour, duration]);

  const handleRetry = async () => {
    await fetch('/api/v1/free', { signal: AbortSignal.timeout(60000) });
    setTimeout(() => {
      window.location.reload();
    }, 60000);
  };

  // Generate hour options (6 AM to 10 PM)
  const hourOptions = Array.from({ length: 17 }, (_, i) => i + 6);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Search for Free Rooms
        </h3>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Day Filter - Required */}
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Day <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value as Day)}
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
            >
              {Object.entries(DAY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Hour Filter - Optional */}
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Start Time (Optional)
            </label>
            <select
              value={selectedHour}
              onChange={(e) => setSelectedHour(e.target.value)}
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
            >
              <option value="">Any Time</option>
              {hourOptions.map((hour) => (
                <option key={hour} value={hour}>
                  {hour}:00 ({hour < 12 ? 'AM' : 'PM'})
                </option>
              ))}
            </select>
          </div>

          {/* Duration Filter - Only shown if hour is selected */}
          {selectedHour && (
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Duration (hours)
              </label>
              <input
                type="number"
                min="1"
                max="8"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
              />
            </div>
          )}

          {/* Specific Room Filter - Optional */}
          <SearchableDropdown
            value={selectedRoom}
            onChange={setSelectedRoom}
            options={allRooms}
            label="Specific Room (Optional)"
            placeholder="All Rooms"
          />
        </div>

        {selectedHour && (
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
            Showing rooms available from {selectedHour}:00 for {duration} hour
            {duration > 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Results */}
      {loading && <LoadingSpinner message="Finding free rooms..." />}
      {error && <ErrorMessage message={error} onRetry={is500Error ? handleRetry : undefined} />}

      {!loading && !error && freeRooms.length === 0 && (
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-8 text-center dark:border-zinc-800 dark:bg-zinc-900/50">
          <svg
            className="mx-auto h-12 w-12 text-zinc-400"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            No free rooms found with the selected criteria.
          </p>
        </div>
      )}

      {!loading && !error && freeRooms.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Available Rooms
            </h3>
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              {freeRooms.length} {freeRooms.length === 1 ? 'room' : 'rooms'} available
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {freeRooms.map((room, index) => (
              <div
                key={`${room.room}-${room.day}-${room.available_from}-${room.available_to}-${index}`}
                className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <h4 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                      {room.room}
                    </h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {room.building}
                    </p>
                  </div>
                  <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
                    Free
                  </span>
                </div>

                <div className="space-y-2 border-t border-zinc-200 pt-3 dark:border-zinc-800">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-600 dark:text-zinc-400">Day:</span>
                    <span className="font-medium text-zinc-900 dark:text-zinc-50">
                      {DAY_LABELS[room.day]}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-600 dark:text-zinc-400">Available:</span>
                    <span className="font-medium text-zinc-900 dark:text-zinc-50">
                      {room.available_from}:00 - {room.available_to}:00
                    </span>
                  </div>

                  <div className="mt-3 rounded bg-zinc-50 p-2 text-center dark:bg-zinc-800">
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      {parseInt(room.available_to) - parseInt(room.available_from)} hours free
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
