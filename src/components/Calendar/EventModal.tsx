import React, { useState, useEffect } from "react";
import {
  X,
  CalendarDays,
  Clock,
  PaintBucket,
  FileText,
  AlertTriangle,
} from "lucide-react";
import { Event, EVENT_COLORS } from "../../types";
import toast from "react-hot-toast";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (eventData: Omit<Event, "id" | "created_at" | "updated_at">) => void;
  onUpdate?: (id: string, updates: Partial<Event>) => void;
  onDelete?: (id: string) => void;
  event?: Event | null;
  initialDate?: Date;
  initialHour?: number;
  userId: string;
  overlappingEvents?: Event[];
  onResolveOverlap?: (action: "replace" | "reschedule") => void;
}

export function EventModal({
  isOpen,
  onClose,
  onSave,
  onUpdate,
  onDelete,
  event,
  initialDate,
  initialHour,
  userId,
  overlappingEvents = [],
  onResolveOverlap,
}: EventModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [color, setColor] = useState<string>(EVENT_COLORS[0].value);
  const [showOverlapWarning, setShowOverlapWarning] = useState(false);

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description || "");
      const startDateTime = new Date(event.start_time);
      const endDateTime = new Date(event.end_time);
      setStartDate(startDateTime.toISOString().split("T")[0]);
      setStartTime(startDateTime.toTimeString().slice(0, 5));
      setEndTime(endDateTime.toTimeString().slice(0, 5));
      setColor(event.color);
    } else if (initialDate) {
      const safeDate = new Date(initialDate);
      if (!isNaN(safeDate.getTime())) {
        const date = safeDate.toISOString().split("T")[0];
        const hour = initialHour ?? new Date().getHours();
        setStartDate(date);
        setStartTime(hour.toString().padStart(2, "0") + ":00");
        setEndTime((hour + 1).toString().padStart(2, "0") + ":00");
        setColor(EVENT_COLORS[0].value);
      }
    }

    setShowOverlapWarning(overlappingEvents.length > 0);
  }, [event, initialDate, initialHour, overlappingEvents]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!startDate || !startTime || !endTime) {
      toast.error("Please fill in all required fields");
      return;
    }

    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${startDate}T${endTime}`);

    if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
      toast.error("Invalid date or time format");
      return;
    }

    if (startDateTime >= endDateTime) {
      toast.error("Start time must be before end time");
      return;
    }

    const eventData = {
      title,
      description: description || null,
      start_time: startDateTime.toISOString(),
      end_time: endDateTime.toISOString(),
      color,
      user_id: userId,
    };

    if (event && onUpdate) {
      onUpdate(event.id, eventData);
      toast.success("Event updated successfully 💾");
    } else {
      onSave(eventData);
      toast.success("Event added successfully 🎉");
    }
  };

  const handleDelete = () => {
    if (event && onDelete) {
      onDelete(event.id);
      toast.success("Event deleted 🗑️");
      onClose();
    }
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setStartDate("");
    setStartTime("");
    setEndTime("");
    setColor(EVENT_COLORS[0].value);
    setShowOverlapWarning(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto scrollbar-hide">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-primary">
              {event ? "Edit Event" : "Create New Event"}
            </h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-accent/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-accent" />
            </button>
          </div>

          {showOverlapWarning && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">
                    Schedule Conflict
                  </h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    You have {overlappingEvents.length} overlapping event(s):
                  </p>
                  <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                    {overlappingEvents.slice(0, 3).map((overlapping) => (
                      <li
                        key={overlapping.id}
                        className="flex items-center gap-2"
                      >
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: overlapping.color }}
                        />
                        {overlapping.title}
                      </li>
                    ))}
                  </ul>
                  {onResolveOverlap && (
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => onResolveOverlap("replace")}
                        className="text-xs bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full hover:bg-yellow-200 transition-colors"
                      >
                        Replace existing
                      </button>
                      <button
                        onClick={() => onResolveOverlap("reschedule")}
                        className="text-xs bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full hover:bg-yellow-200 transition-colors"
                      >
                        Change time
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Event Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-primary rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Description (optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-primary rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                <CalendarDays className="w-4 h-4 inline mr-2" />
                Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-primary rounded-lg focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Start Time
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 border border-primary rounded-lg focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  End Time
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-3 py-2 border border-primary rounded-lg focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                <PaintBucket className="w-4 h-4 inline mr-2" />
                Color
              </label>
              <div className="flex gap-2 flex-wrap">
                {EVENT_COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setColor(c.value)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      color === c.value
                        ? "border-primary scale-110"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    style={{ backgroundColor: c.value }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-4">
              {event && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Delete
                </button>
              )}
              <div className="flex gap-3 ml-auto">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-accent hover:bg-accent/10 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
                >
                  {event ? "Update Event" : "Create Event"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
