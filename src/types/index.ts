export interface Event {
  id: string
  title: string
  description: string | null
  start_time: string
  end_time: string
  color: string
  user_id: string
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
}

export type ViewMode = 'monthly' | 'weekly' | 'daily'

export interface CalendarDate {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
  events: Event[]
}

export const EVENT_COLORS = [
  { name: 'Blue', value: '#3B82F6', bg: 'bg-blue-500', text: 'text-white' },
  { name: 'Green', value: '#10B981', bg: 'bg-emerald-500', text: 'text-white' },
  { name: 'Purple', value: '#8B5CF6', bg: 'bg-violet-500', text: 'text-white' },
  { name: 'Red', value: '#EF4444', bg: 'bg-red-500', text: 'text-white' },
  { name: 'Orange', value: '#F97316', bg: 'bg-orange-500', text: 'text-white' },
  { name: 'Pink', value: '#EC4899', bg: 'bg-pink-500', text: 'text-white' },
  { name: 'Teal', value: '#14B8A6', bg: 'bg-teal-500', text: 'text-white' },
  { name: 'Indigo', value: '#6366F1', bg: 'bg-indigo-500', text: 'text-white' },
] as const