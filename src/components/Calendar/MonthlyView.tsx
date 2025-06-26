import React from "react";
import { Event, CalendarDate } from "../../types";

interface MonthlyViewProps {
  currentDate: Date;
  events: Event[];
  onDateClick: (date: Date) => void;
  onEventClick: (event: Event) => void;
}

export function MonthlyView({
  currentDate,
  events,
  onDateClick,
  onEventClick,
}: MonthlyViewProps) {
  const generateCalendarDates = (): CalendarDate[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const dates: CalendarDate[] = [];
    const today = new Date();

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      const dayEvents = events.filter((event) => {
        const eventDate = new Date(event.start_time);
        return (
          eventDate.getDate() === date.getDate() &&
          eventDate.getMonth() === date.getMonth() &&
          eventDate.getFullYear() === date.getFullYear()
        );
      });

      dates.push({
        date,
        isCurrentMonth: date.getMonth() === month,
        isToday:
          date.getDate() === today.getDate() &&
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear(),
        events: dayEvents,
      });
    }

    return dates;
  };

  const calendarDates = generateCalendarDates();
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="bg-background rounded-lg shadow-sm border border-primary overflow-hidden">
      {/* Week day headers */}
      <div className="grid grid-cols-7 bg-accent bg-opacity-10 border-b border-primary">
        {weekDays.map((day) => (
          <div
            key={day}
            className="p-3 text-center text-sm font-semibold text-accent"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {calendarDates.map((calendarDate, index) => (
          <div
            key={index}
            className={`min-h-[120px] border-r border-b border-primary p-2 cursor-pointer hover:bg-accent/10 transition-colors ${
              !calendarDate.isCurrentMonth ? "bg-background/70" : ""
            }`}
            onClick={() => onDateClick(calendarDate.date)}
          >
            <div className="flex items-center justify-between mb-1">
              <span
                className={`text-sm font-medium ${
                  calendarDate.isToday
                    ? "bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center"
                    : calendarDate.isCurrentMonth
                    ? "text-accent"
                    : "text-gray-500"
                }`}
              >
                {calendarDate.date.getDate()}
              </span>
            </div>

            <div className="space-y-1">
              {calendarDate.events.slice(0, 3).map((event) => (
                <div
                  key={event.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEventClick(event);
                  }}
                  className="text-xs p-1 rounded truncate cursor-pointer hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: event.color, color: "white" }}
                >
                  {event.title}
                </div>
              ))}
              {calendarDate.events.length > 3 && (
                <div className="text-xs text-accent font-medium">
                  +{calendarDate.events.length - 3} more
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
