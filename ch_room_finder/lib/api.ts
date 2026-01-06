// API Service Layer for CHRoomFinder

import type {
  ApiResponse,
  ScheduleItem,
  ScheduleParams,
  FreeRoomItem,
  FreeRoomsParams,
  RoomsList,
  PrefixItem,
  PrefixParams,
} from '@/types/api';

const API_BASE_URL = 'https://chroomfinduh.onrender.com/api/v1';

// Helper function to build query string
function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

// Generic fetch function with error handling
async function apiFetch<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data: ApiResponse<T> = await response.json();

    if (data.status === 'failed') {
      throw new Error(data.error.message || 'API request failed');
    }

    return data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unknown error occurred');
  }
}

// Schedule endpoint
export async function getSchedule(params: ScheduleParams = {}): Promise<ScheduleItem[]> {
  const queryString = buildQueryString(params);
  const endpoint = `${API_BASE_URL}/schedule${queryString}`;
  return apiFetch<ScheduleItem[]>(endpoint);
}

// Free rooms endpoint
export async function getFreeRooms(params: FreeRoomsParams): Promise<FreeRoomItem[]> {
  const queryString = buildQueryString(params);
  const endpoint = `${API_BASE_URL}/free${queryString}`;
  return apiFetch<FreeRoomItem[]>(endpoint);
}

// Rooms endpoint
export async function getRooms(): Promise<RoomsList> {
  const endpoint = `${API_BASE_URL}/rooms`;
  return apiFetch<RoomsList>(endpoint);
}

// Prefixes endpoint
export async function getPrefixes(params: PrefixParams = {}): Promise<PrefixItem[]> {
  const queryString = buildQueryString(params);
  const endpoint = `${API_BASE_URL}/prefixes${queryString}`;
  return apiFetch<PrefixItem[]>(endpoint);
}
