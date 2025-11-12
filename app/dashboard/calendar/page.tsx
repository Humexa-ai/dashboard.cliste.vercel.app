"use client";

import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, User, Phone, Mail } from "lucide-react";
import { motion } from "framer-motion";

type AppointmentStatus = "confirmed" | "pending" | "completed";
type ServiceType = "haircut" | "color" | "consultation" | "treatment";

type Appointment = {
  id: number;
  customerName: string;
  phone: string;
  email: string;
  date: Date;
  time: string;
  duration: string;
  service: ServiceType;
  status: AppointmentStatus;
  notes: string;
};

const appointments: Appointment[] = [
  {
    id: 1,
    customerName: "Sarah Johnson",
    phone: "+353 87 204 3321",
    email: "sarah.johnson@example.com",
    date: new Date(2025, 10, 12), // Nov 12
    time: "10:00 AM",
    duration: "1h",
    service: "haircut",
    status: "confirmed",
    notes: "Prefers quieter seats in the salon",
  },
  {
    id: 2,
    customerName: "Emma Wilson",
    phone: "+353 89 991 0444",
    email: "emma.wilson@example.com",
    date: new Date(2025, 10, 13), // Nov 13
    time: "2:00 PM",
    duration: "1.5h",
    service: "color",
    status: "confirmed",
    notes: "Color consultation for engagement photos",
  },
  {
    id: 3,
    customerName: "Michael Chen",
    phone: "+353 85 277 0909",
    email: "michael.chen@example.com",
    date: new Date(2025, 10, 14), // Nov 14
    time: "11:00 AM",
    duration: "45m",
    service: "consultation",
    status: "pending",
    notes: "Interested in highlight packages",
  },
  {
    id: 4,
    customerName: "Lisa Anderson",
    phone: "+353 86 778 2188",
    email: "lisa.anderson@example.com",
    date: new Date(2025, 10, 14), // Nov 14
    time: "4:00 PM",
    duration: "2h",
    service: "treatment",
    status: "confirmed",
    notes: "Regular customer - platinum tier",
  },
  {
    id: 5,
    customerName: "Robert Brown",
    phone: "+353 83 301 8877",
    email: "robert.brown@example.com",
    date: new Date(2025, 10, 15), // Nov 15
    time: "2:00 PM",
    duration: "30m",
    service: "haircut",
    status: "confirmed",
    notes: "Beard trim - regular every 4 weeks",
  },
];

const serviceColors: Record<ServiceType, string> = {
  haircut: "bg-blue-500",
  color: "bg-purple-500",
  consultation: "bg-amber-500",
  treatment: "bg-emerald-500",
};

const serviceLabels: Record<ServiceType, string> = {
  haircut: "Haircut",
  color: "Color",
  consultation: "Consultation",
  treatment: "Treatment",
};

const statusColors: Record<AppointmentStatus, string> = {
  confirmed: "bg-emerald-500/10 text-emerald-400",
  pending: "bg-amber-500/10 text-amber-400",
  completed: "bg-neutral-500/10 text-neutral-400",
};

const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay();
};

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CalendarPage() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | null>(today);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const previousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(
      (apt) =>
        apt.date.getDate() === date.getDate() &&
        apt.date.getMonth() === date.getMonth() &&
        apt.date.getFullYear() === date.getFullYear()
    );
  };

  const selectedDateAppointments = selectedDate ? getAppointmentsForDate(selectedDate) : [];

  const isToday = (day: number) => {
    return (
      day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()
    );
  };

  const isSelectedDate = (day: number) => {
    if (!selectedDate) return false;
    return (
      day === selectedDate.getDate() &&
      currentMonth === selectedDate.getMonth() &&
      currentYear === selectedDate.getFullYear()
    );
  };

  const hasAppointments = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    return getAppointmentsForDate(date).length > 0;
  };

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex h-full w-full overflow-hidden rounded-2xl border border-neutral-800/80 bg-neutral-950/60"
    >
      {/* Calendar Grid */}
      <div className="flex flex-1 flex-col border-r border-neutral-800/70">
        {/* Header */}
        <header className="shrink-0 border-b border-neutral-800/70 px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-white">Calendar</h1>
              <p className="mt-0.5 text-xs text-neutral-400">Appointment scheduling and management</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={previousMonth}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-800/60 bg-neutral-900/60 text-neutral-300 transition hover:border-neutral-700 hover:text-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="min-w-[140px] text-center text-sm font-semibold text-white">
                {monthNames[currentMonth]} {currentYear}
              </div>
              <button
                onClick={nextMonth}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-800/60 bg-neutral-900/60 text-neutral-300 transition hover:border-neutral-700 hover:text-white"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Calendar Grid */}
        <div className="flex-1 overflow-y-auto p-5" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          {/* Day Names */}
          <div className="mb-2 grid grid-cols-7 gap-2">
            {dayNames.map((day) => (
              <div key={day} className="text-center text-xs font-semibold uppercase text-neutral-500">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="aspect-square" />;
              }

              const date = new Date(currentYear, currentMonth, day);
              const dayAppointments = getAppointmentsForDate(date);

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(date)}
                  className={`group relative aspect-square rounded-lg border p-2 text-left transition ${
                    isSelectedDate(day)
                      ? "border-blue-500 bg-blue-500/10"
                      : isToday(day)
                        ? "border-blue-500/50 bg-blue-500/5"
                        : "border-neutral-800/60 bg-neutral-900/20 hover:border-neutral-700 hover:bg-neutral-900/40"
                  }`}
                >
                  <span
                    className={`text-sm font-semibold ${
                      isSelectedDate(day) || isToday(day) ? "text-white" : "text-neutral-300"
                    }`}
                  >
                    {day}
                  </span>

                  {/* Appointment Indicators */}
                  {dayAppointments.length > 0 && (
                    <div className="absolute bottom-2 left-2 right-2 flex gap-1">
                      {dayAppointments.slice(0, 3).map((apt) => (
                        <div
                          key={apt.id}
                          className={`h-1 flex-1 rounded-full ${serviceColors[apt.service]}`}
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sidebar - Selected Day Details */}
      <aside className="flex w-96 shrink-0 flex-col bg-neutral-900/20">
        {selectedDate ? (
          <>
            {/* Sidebar Header */}
            <div className="shrink-0 border-b border-neutral-800/70 px-5 py-4">
              <div className="flex items-center gap-2 text-neutral-400">
                <CalendarIcon className="h-4 w-4" />
                <span className="text-xs font-medium">
                  {selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <h2 className="mt-2 text-lg font-semibold text-white">
                {selectedDateAppointments.length} Appointment{selectedDateAppointments.length !== 1 ? "s" : ""}
              </h2>
            </div>

            {/* Appointments List */}
            <div className="min-h-0 flex-1 overflow-y-auto p-5" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
              <style jsx>{`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}</style>

              {selectedDateAppointments.length === 0 ? (
                <div className="flex h-full items-center justify-center text-center">
                  <div>
                    <CalendarIcon className="mx-auto h-12 w-12 text-neutral-700" />
                    <p className="mt-3 text-sm font-medium text-neutral-300">No appointments</p>
                    <p className="mt-1 text-xs text-neutral-500">This day is available</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDateAppointments.map((appointment) => (
                    <motion.div
                      key={appointment.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-xl border border-neutral-800/60 bg-neutral-900/40 p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <div className={`h-3 w-3 rounded-full ${serviceColors[appointment.service]}`} />
                            <span className="text-sm font-semibold text-white">{appointment.customerName}</span>
                          </div>
                          <p className="mt-1 text-xs text-neutral-400">{serviceLabels[appointment.service]}</p>
                        </div>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${statusColors[appointment.status]}`}
                        >
                          {appointment.status}
                        </span>
                      </div>

                      <div className="mt-3 space-y-2 text-xs text-neutral-400">
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          <span>
                            {appointment.time} • {appointment.duration}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3" />
                          <span>{appointment.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3" />
                          <span>{appointment.email}</span>
                        </div>
                      </div>

                      {appointment.notes && (
                        <div className="mt-3 rounded-lg bg-neutral-950/60 p-2">
                          <p className="text-xs text-neutral-400">
                            <span className="font-medium text-neutral-300">Note:</span> {appointment.notes}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center p-5 text-center">
            <div>
              <CalendarIcon className="mx-auto h-12 w-12 text-neutral-700" />
              <p className="mt-3 text-sm font-medium text-neutral-300">Select a date</p>
              <p className="mt-1 text-xs text-neutral-500">Click on a day to view appointments</p>
            </div>
          </div>
        )}
      </aside>
    </motion.div>
  );
}

