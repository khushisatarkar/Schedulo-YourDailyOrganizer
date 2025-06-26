import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Event } from '../types'

export function useEvents(userId: string | undefined) {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) {
      setEvents([])
      setLoading(false)
      return
    }

    fetchEvents()
  }, [userId])

  const fetchEvents = async () => {
    if (!userId) return

    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', userId)
        .order('start_time')

      if (error) throw error
      setEvents(data || [])
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const createEvent = async (eventData: Omit<Event, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .insert([eventData])
        .select()
        .single()

      if (error) throw error
      setEvents(prev => [...prev, data])
      return { data, error: null }
    } catch (error) {
      console.error('Error creating event:', error)
      return { data: null, error }
    }
  }

  const updateEvent = async (id: string, updates: Partial<Event>) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      setEvents(prev => prev.map(event => event.id === id ? data : event))
      return { data, error: null }
    } catch (error) {
      console.error('Error updating event:', error)
      return { data: null, error }
    }
  }

  const deleteEvent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id)

      if (error) throw error
      setEvents(prev => prev.filter(event => event.id !== id))
      return { error: null }
    } catch (error) {
      console.error('Error deleting event:', error)
      return { error }
    }
  }

  const checkOverlap = (startTime: string, endTime: string, excludeId?: string) => {
    return events.filter(event => {
      if (excludeId && event.id === excludeId) return false
      
      const eventStart = new Date(event.start_time)
      const eventEnd = new Date(event.end_time)
      const newStart = new Date(startTime)
      const newEnd = new Date(endTime)

      return (
        (newStart < eventEnd && newEnd > eventStart) ||
        (eventStart < newEnd && eventEnd > newStart)
      )
    })
  }

  return {
    events,
    loading,
    createEvent,
    updateEvent,
    deleteEvent,
    checkOverlap,
    refetch: fetchEvents,
  }
}