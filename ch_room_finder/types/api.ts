// API Types for CHRoomFinder

export type Faculty = 'fccpa' | 'fhe' | 'law' | 'fms' | 'fst' | 'fss';

export type Day = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export type ClassType = 'L' | 'T'; // L -> Lecture, T -> Tutorial

// API Response wrapper types
export interface ApiSuccessResponse<T> {
  status: 'success';
  data: T;
}

export interface ApiErrorResponse {
  status: 'failed';
  error: {
    code: number;
    message: string;
    type: string;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// Schedule endpoint types
export interface ScheduleItem {
  course_code: string;
  day: Day;
  start_time: string; // Hours only
  end_time: string;
  class_type: ClassType;
  start_date: string; // mm/dd/yyyy
  end_date: string; // mm/dd/yyyy
  room: string;
  building: string;
}

export interface ScheduleParams {
  faculty?: Faculty;
  limit?: number;
  day?: Day;
  room?: string;
  prefix?: string; // 4 character course prefix
}

// Free rooms endpoint types
export interface FreeRoomItem {
  room: string;
  day: Day;
  building: string;
  available_from: string; // Hour
  available_to: string; // Hour
}

export interface FreeRoomsParams {
  day: Day; // Mandatory
  hour?: number; // 24 hour format
  duration?: number; // Hours
  room?: string;
}

// Rooms endpoint types
export type RoomsList = string[];

// Prefixes endpoint types
export interface PrefixItem {
  faculty: string;
  prefix: string;
  desc: string;
}

export interface PrefixParams {
  faculty?: Faculty;
}

// Display-friendly labels
export const FACULTY_LABELS: Record<Faculty, string> = {
  fccpa: 'Culture, Creative & Performing Arts',
  fhe: 'Humanities & Education',
  law: 'Law',
  fms: 'Medical Sciences',
  fst: 'Science & Technology',
  fss: 'Social Sciences',
};

export const DAY_LABELS: Record<Day, string> = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
};

export const CLASS_TYPE_LABELS: Record<ClassType, string> = {
  L: 'Lecture',
  T: 'Tutorial',
};
