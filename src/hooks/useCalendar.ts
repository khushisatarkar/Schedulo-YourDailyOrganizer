import { useState } from "react";
import { Event } from "../types";

export function useCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"monthly" | "weekly" | "daily">(
    "monthly"
  );
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [userId, setUserId] = useState("demo-user"); // replace with actual user auth if needed
  const [overlappingEvents, setOverlappingEvents] = useState<Event[]>([]);

  const openModal = (date?: Date, event?: Event) => {
    if (event) setSelectedEvent(event);
    if (date) setSelectedDate(date);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedEvent(null);
    setSelectedDate(null);
    setOverlappingEvents([]);
    setModalOpen(false);
  };

  const handleAddEvent = (
    eventData: Omit<Event, "id" | "created_at" | "updated_at">
  ) => {
    const newEvent: Event = {
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...eventData,
    };

    // Basic overlap detection (optional logic)
    const overlaps = events.filter((e) => {
      const aStart = new Date(eventData.start_time).getTime();
      const aEnd = new Date(eventData.end_time).getTime();
      const bStart = new Date(e.start_time).getTime();
      const bEnd = new Date(e.end_time).getTime();
      return (
        e.user_id === eventData.user_id &&
        ((aStart >= bStart && aStart < bEnd) ||
          (aEnd > bStart && aEnd <= bEnd) ||
          (aStart <= bStart && aEnd >= bEnd))
      );
    });

    if (overlaps.length > 0) {
      setOverlappingEvents(overlaps);
    } else {
      setEvents([...events, newEvent]);
      closeModal();
    }
  };

  const handleUpdateEvent = (id: string, updates: Partial<Event>) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === id
          ? { ...e, ...updates, updated_at: new Date().toISOString() }
          : e
      )
    );
    closeModal();
  };

  const handleDeleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    closeModal();
  };

  const handleDateChange = (date: Date) => {
    setCurrentDate(date);
  };

  const handleViewModeChange = (mode: "monthly" | "weekly" | "daily") => {
    setViewMode(mode);
  };

  const handleTimeSlotClick = (arg1: Date | number, arg2?: number) => {
    const date =
      typeof arg1 === "number" ? new Date(currentDate.setHours(arg1)) : arg1;
    openModal(date);
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  const handleResolveOverlap = (action: "replace" | "reschedule") => {
    if (action === "replace" && selectedEvent) {
      setEvents((prev) => [
        ...prev.filter((e) => !overlappingEvents.includes(e)),
        selectedEvent,
      ]);
      closeModal();
    } else if (action === "reschedule") {
      setOverlappingEvents([]);
    }
  };

  return {
    currentDate,
    viewMode,
    events,
    selectedEvent,
    selectedDate,
    modalOpen,
    userId,
    openModal,
    closeModal,
    handleAddEvent,
    handleUpdateEvent,
    handleDeleteEvent,
    handleDateChange,
    handleViewModeChange,
    handleTimeSlotClick,
    handleEventClick,
    overlappingEvents,
    handleResolveOverlap,
  };
}
