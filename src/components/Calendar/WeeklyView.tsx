import React from "react";
import { Event } from "../../types";

interface WeeklyViewProps {
  currentDate: Date;
  events: Event[];
  onTimeSlotClick: (date: Date, hour: number) => void;
  onEventClick: (event: Event) => void;
}

export function WeeklyView({
  currentDate,
  events,
  onTimeSlotClick,
  onEventClick,
}: WeeklyViewProps) {
  const getWeekDates = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const weekDates = getWeekDates();
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getEventsForDateAndHour = (date: Date, hour: number) => {
    return events.filter((event) => {
      const eventDate = new Date(event.start_time);
      const eventHour = eventDate.getHours();

      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear() &&
        eventHour === hour
      );
    });
  };

  const today = new Date();

  return (
    <div className="bg-background rounded-lg shadow-sm border border-accent overflow-hidden">
      {/* Week day headers */}
      <div className="grid grid-cols-8 bg-[#cbd5b2] border-b border-accent">
        <div className="p-3 border-r border-accent"></div>
        {weekDates.map((date, index) => (
          <div
            key={index}
            className="p-3 text-center border-r border-accent last:border-r-0"
          >
            <div className="text-sm font-medium text-accent">
              {weekDays[index]}
            </div>
            <div
              className={`text-lg font-semibold mt-1 ${
                date.getDate() === today.getDate() &&
                date.getMonth() === today.getMonth() &&
                date.getFullYear() === today.getFullYear()
                  ? "bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto"
                  : "text-accent"
              }`}
            >
              {date.getDate()}
            </div>
          </div>
        ))}
      </div>

      {/* Time slots */}
      <div className="max-h-[600px] overflow-y-auto">
        {hours.map((hour) => (
          <div
            key={hour}
            className="grid grid-cols-8 border-b border-accent last:border-b-0"
          >
            <div className="p-3 border-r border-accent text-sm font-medium text-accent bg-[#cbd5b2]">
              {hour === 0
                ? "12 AM"
                : hour < 12
                ? `${hour} AM`
                : hour === 12
                ? "12 PM"
                : `${hour - 12} PM`}
            </div>

            {weekDates.map((date, dateIndex) => (
              <div
                key={dateIndex}
                className="min-h-[60px] p-1 border-r border-accent last:border-r-0 cursor-pointer hover:bg-[#cbd5b2] transition-colors"
                onClick={() => onTimeSlotClick(date, hour)}
              >
                {getEventsForDateAndHour(date, hour).map((event) => (
                  <div
                    key={event.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                    className="text-xs p-1 rounded mb-1 cursor-pointer hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: event.color, color: "white" }}
                  >
                    {event.title}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
