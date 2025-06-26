import React from "react";
import { CalendarHeader } from "../Calendar/CalendarHeader";
import { MonthlyView } from "../Calendar/MonthlyView";
import { WeeklyView } from "../Calendar/WeeklyView";
import { DailyView } from "../Calendar/DailyView";
import { EventModal } from "../Calendar/EventModal";
import { useCalendar } from "../../hooks/useCalendar";

export default function Dashboard() {
  const {
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
  } = useCalendar();

  return (
    <div className="min-h-screen bg-background text-primary">
      <CalendarHeader
        currentDate={currentDate}
        viewMode={viewMode}
        onDateChange={handleDateChange}
        onViewModeChange={handleViewModeChange}
        onAddEvent={openModal}
      />

      <main className="p-6">
        {viewMode === "monthly" && (
          <MonthlyView
            currentDate={currentDate}
            events={events}
            onDateClick={(date) => {
              handleDateChange(date);
              openModal(date);
            }}
            onEventClick={handleEventClick}
          />
        )}

        {viewMode === "weekly" && (
          <WeeklyView
            currentDate={currentDate}
            events={events}
            onTimeSlotClick={handleTimeSlotClick}
            onEventClick={handleEventClick}
          />
        )}

        {viewMode === "daily" && (
          <DailyView
            currentDate={currentDate}
            events={events}
            onTimeSlotClick={(hour) => handleTimeSlotClick(currentDate, hour)}
            onEventClick={handleEventClick}
          />
        )}
      </main>

      <EventModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSave={handleAddEvent}
        onUpdate={handleUpdateEvent}
        onDelete={handleDeleteEvent}
        event={selectedEvent}
        initialDate={selectedDate ?? undefined}
        userId={userId}
        overlappingEvents={overlappingEvents}
        onResolveOverlap={handleResolveOverlap}
      />
    </div>
  );
}
