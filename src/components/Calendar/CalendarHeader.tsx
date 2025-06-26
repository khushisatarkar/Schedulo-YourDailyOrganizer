import React from "react";
import { ChevronLeft, ChevronRight, Plus, LogOut } from "lucide-react";
import { ViewMode } from "../../types";
import { useAuth } from "../../hooks/useAuth";

interface CalendarHeaderProps {
  currentDate: Date;
  viewMode: ViewMode;
  onDateChange: (date: Date) => void;
  onViewModeChange: (mode: ViewMode) => void;
  onAddEvent: () => void;
}

export function CalendarHeader({
  currentDate,
  viewMode,
  onDateChange,
  onViewModeChange,
  onAddEvent,
}: CalendarHeaderProps) {
  const { signOut, user } = useAuth();

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (viewMode === "monthly")
      newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
    else
      newDate.setDate(
        newDate.getDate() +
          (viewMode === "weekly" ? 7 : 1) * (direction === "next" ? 1 : -1)
      );
    onDateChange(newDate);
  };

  const getDateRangeText = () => {
    if (viewMode === "monthly")
      return currentDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });

    if (viewMode === "weekly") {
      const start = new Date(currentDate);
      start.setDate(start.getDate() - start.getDay());
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      return `${start.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })} - ${end.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}`;
    }

    return currentDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-background shadow-sm border-b border-primary px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-20">
          <h1 className="text-5xl font-bold text-primary font-schedulo">
            Schedulo
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateDate("prev")}
              className="p-2 hover:bg-accent/10 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-accent" />
            </button>
            <h2 className="text-lg font-semibold text-accent min-w-[200px] text-center">
              {getDateRangeText()}
            </h2>
            <button
              onClick={() => navigateDate("next")}
              className="p-2 hover:bg-accent/10 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-accent" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-accent/10 rounded-lg p-1">
            {(["monthly", "weekly", "daily"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => onViewModeChange(mode)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === mode
                    ? "bg-background text-primary shadow-sm"
                    : "text-accent hover:text-primary"
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>

          <button
            onClick={onAddEvent}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/80 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Event
          </button>

          <div className="flex items-center gap-3">
            <span className="text-sm text-accent">{user?.email}</span>
            <button
              onClick={signOut}
              className="p-2 hover:bg-accent/10 rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5 text-accent" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
