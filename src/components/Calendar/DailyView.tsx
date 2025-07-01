import React from "react";
import { Event } from "../../types";

interface DailyViewProps {
  currentDate: Date;
  events: Event[];
  onTimeSlotClick: (hour: number) => void;
  onEventClick: (event: Event) => void;
}

export function DailyView({
  currentDate,
  events,
  onTimeSlotClick,
  onEventClick,
}: DailyViewProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEventsForHour = (hour: number) =>
    events.filter((event) => {
      const d = new Date(event.start_time);
      return (
        d.getFullYear() === currentDate.getFullYear() &&
        d.getMonth() === currentDate.getMonth() &&
        d.getDate() === currentDate.getDate() &&
        d.getHours() === hour
      );
    });

  const isToday = new Date().toDateString() === currentDate.toDateString();

  return (
    <div className="bg-background rounded-lg shadow-sm border border-primary overflow-hidden">
      <div className="bg-accent/10 border-b border-primary p-4 text-center">
        <h3 className="text-lg font-semibold text-accent">
          {currentDate.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </h3>
        {isToday && (
          <span className="inline-block mt-1 px-2 py-1 bg-primary text-white text-xs font-medium rounded-full">
            Today
          </span>
        )}
      </div>

      <div className="max-h-[600px] overflow-y-auto scrollbar-hide">
        {hours.map((hour) => (
          <div
            key={hour}
            className="flex border-b border-primary last:border-b-0"
          >
            <div className="w-20 p-3 border-r border-primary text-sm font-medium text-accent bg-background/70">
              {hour === 0
                ? "12 AM"
                : hour < 12
                ? `${hour} AM`
                : hour === 12
                ? "12 PM"
                : `${hour - 12} PM`}
            </div>

            <div
              className="flex-1 min-h-[80px] p-2 cursor-pointer hover:bg-accent/10 transition-colors"
              onClick={() => onTimeSlotClick(hour)}
            >
              <div className="space-y-1">
                {getEventsForHour(hour).map((event) => (
                  <div
                    key={event.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                    className="p-2 rounded cursor-pointer hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: event.color, color: "white" }}
                  >
                    <div className="font-medium">{event.title}</div>
                    {event.description && (
                      <div className="text-sm opacity-90 mt-1">
                        {event.description}
                      </div>
                    )}
                    <div className="text-xs opacity-75 mt-1">
                      {new Date(event.start_time).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                      })}{" "}
                      -{" "}
                      {new Date(event.end_time).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
