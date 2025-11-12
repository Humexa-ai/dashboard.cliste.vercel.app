"use client";

import React, { useState, useMemo } from "react";
import { Calendar, Clock, User, Phone, Mail, MessageSquare, ChevronDown, ChevronUp, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type BookingStatus = "upcoming" | "completed" | "cancelled" | "no-show";
type ServiceType = "haircut" | "color" | "consultation" | "treatment" | "styling";
type BookingSource = "phone" | "whatsapp" | "messenger" | "instagram" | "website" | "sms";

type Booking = {
  id: number;
  customerName: string;
  phone: string;
  email: string;
  date: Date;
  time: string;
  duration: string;
  service: ServiceType;
  status: BookingStatus;
  source: BookingSource;
  agent: string;
  notes: string;
  price: string;
};

const bookings: Booking[] = [
  {
    id: 1,
    customerName: "Sarah Johnson",
    phone: "+353 87 204 3321",
    email: "sarah.johnson@example.com",
    date: new Date(2025, 10, 12),
    time: "10:00 AM",
    duration: "1h",
    service: "haircut",
    status: "upcoming",
    source: "phone",
    agent: "AI Agent",
    notes: "Prefers quieter seats in the salon. Regular customer.",
    price: "€45",
  },
  {
    id: 2,
    customerName: "Emma Wilson",
    phone: "+353 89 991 0444",
    email: "emma.wilson@example.com",
    date: new Date(2025, 10, 13),
    time: "2:00 PM",
    duration: "1.5h",
    service: "color",
    status: "upcoming",
    source: "whatsapp",
    agent: "AI Agent",
    notes: "Color consultation for engagement photos. Interested in balayage.",
    price: "€120",
  },
  {
    id: 3,
    customerName: "Michael Chen",
    phone: "+353 85 277 0909",
    email: "michael.chen@example.com",
    date: new Date(2025, 10, 11),
    time: "11:00 AM",
    duration: "45m",
    service: "consultation",
    status: "completed",
    source: "messenger",
    agent: "AI Agent",
    notes: "Discussed highlight packages. Booked follow-up appointment.",
    price: "€0",
  },
  {
    id: 4,
    customerName: "Lisa Anderson",
    phone: "+353 86 778 2188",
    email: "lisa.anderson@example.com",
    date: new Date(2025, 10, 14),
    time: "4:00 PM",
    duration: "2h",
    service: "treatment",
    status: "upcoming",
    source: "website",
    agent: "AI Agent",
    notes: "Deep conditioning treatment. Platinum tier customer.",
    price: "€85",
  },
  {
    id: 5,
    customerName: "Robert Brown",
    phone: "+353 83 301 8877",
    email: "robert.brown@example.com",
    date: new Date(2025, 10, 15),
    time: "2:00 PM",
    duration: "30m",
    service: "haircut",
    status: "upcoming",
    source: "sms",
    agent: "AI Agent",
    notes: "Beard trim. Regular every 4 weeks.",
    price: "€25",
  },
  {
    id: 6,
    customerName: "Jennifer Davis",
    phone: "+353 87 555 1234",
    email: "jennifer.davis@example.com",
    date: new Date(2025, 10, 10),
    time: "3:00 PM",
    duration: "1h",
    service: "styling",
    status: "completed",
    source: "instagram",
    agent: "AI Agent",
    notes: "Blowout for special event. Very satisfied with results.",
    price: "€55",
  },
  {
    id: 7,
    customerName: "David Martinez",
    phone: "+353 89 444 5678",
    email: "david.martinez@example.com",
    date: new Date(2025, 10, 9),
    time: "10:00 AM",
    duration: "1h",
    service: "haircut",
    status: "no-show",
    source: "phone",
    agent: "AI Agent",
    notes: "Did not show up. No call to cancel.",
    price: "€45",
  },
  {
    id: 8,
    customerName: "Amanda White",
    phone: "+353 86 333 9876",
    email: "amanda.white@example.com",
    date: new Date(2025, 10, 8),
    time: "1:00 PM",
    duration: "1.5h",
    service: "color",
    status: "cancelled",
    source: "whatsapp",
    agent: "AI Agent",
    notes: "Customer cancelled 2 days in advance. Rescheduled for next month.",
    price: "€120",
  },
];

const serviceLabels: Record<ServiceType, string> = {
  haircut: "Haircut",
  color: "Color",
  consultation: "Consultation",
  treatment: "Treatment",
  styling: "Styling",
};

const serviceColors: Record<ServiceType, string> = {
  haircut: "bg-blue-500/10 text-blue-400",
  color: "bg-purple-500/10 text-purple-400",
  consultation: "bg-amber-500/10 text-amber-400",
  treatment: "bg-emerald-500/10 text-emerald-400",
  styling: "bg-pink-500/10 text-pink-400",
};

const statusLabels: Record<BookingStatus, string> = {
  upcoming: "Upcoming",
  completed: "Completed",
  cancelled: "Cancelled",
  "no-show": "No-show",
};

const statusColors: Record<BookingStatus, string> = {
  upcoming: "bg-blue-500/10 text-blue-400",
  completed: "bg-emerald-500/10 text-emerald-400",
  cancelled: "bg-neutral-500/10 text-neutral-400",
  "no-show": "bg-rose-500/10 text-rose-400",
};

const sourceLabels: Record<BookingSource, string> = {
  phone: "Phone",
  whatsapp: "WhatsApp",
  messenger: "Messenger",
  instagram: "Instagram",
  website: "Website",
  sms: "SMS",
};

export default function BookingsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | BookingStatus>("all");
  const [serviceFilter, setServiceFilter] = useState<"all" | ServiceType>("all");
  const [expandedBooking, setExpandedBooking] = useState<number | null>(null);

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesSearch =
        searchTerm.length === 0 ||
        booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.phone.includes(searchTerm) ||
        booking.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
      const matchesService = serviceFilter === "all" || booking.service === serviceFilter;

      return matchesSearch && matchesStatus && matchesService;
    });
  }, [searchTerm, statusFilter, serviceFilter]);

  const metrics = useMemo(() => {
    const totalBookings = bookings.length;
    const upcoming = bookings.filter((b) => b.status === "upcoming").length;
    const completed = bookings.filter((b) => b.status === "completed").length;
    const cancelled = bookings.filter((b) => b.status === "cancelled" || b.status === "no-show").length;

    return { totalBookings, upcoming, completed, cancelled };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-neutral-800/80 bg-neutral-950/60"
    >
      {/* Header */}
      <header className="shrink-0 border-b border-neutral-800/70 px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white">Bookings</h1>
            <p className="mt-0.5 text-xs text-neutral-400">Appointment booking management</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-4 rounded-lg bg-neutral-900/60 px-4 py-2">
              <div className="text-center">
                <p className="text-xs text-neutral-500">Total</p>
                <p className="text-lg font-semibold text-white">{metrics.totalBookings}</p>
              </div>
              <div className="h-8 w-px bg-neutral-800"></div>
              <div className="text-center">
                <p className="text-xs text-neutral-500">Upcoming</p>
                <p className="text-lg font-semibold text-blue-400">{metrics.upcoming}</p>
              </div>
              <div className="h-8 w-px bg-neutral-800"></div>
              <div className="text-center">
                <p className="text-xs text-neutral-500">Completed</p>
                <p className="text-lg font-semibold text-emerald-400">{metrics.completed}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="shrink-0 border-b border-neutral-800/70 bg-neutral-900/30 px-5 py-3">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name..."
              className="w-full rounded-lg border border-neutral-800/60 bg-neutral-900/60 py-2 pl-10 pr-3 text-sm text-white placeholder-neutral-500 focus:border-neutral-700 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-500">Status:</span>
            {(["all", "upcoming", "completed", "cancelled"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`rounded-lg px-3 py-2 text-xs font-medium capitalize transition cursor-pointer ${
                  statusFilter === status
                    ? "bg-blue-500 text-white"
                    : "bg-neutral-800/60 text-neutral-400 hover:bg-neutral-800 hover:text-white"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-500">Service:</span>
            {(["all", "haircut", "color", "consultation", "treatment"] as const).map((service) => (
              <button
                key={service}
                onClick={() => setServiceFilter(service)}
                className={`rounded-lg px-3 py-2 text-xs font-medium capitalize transition cursor-pointer ${
                  serviceFilter === service
                    ? "bg-blue-500 text-white"
                    : "bg-neutral-800/60 text-neutral-400 hover:bg-neutral-800 hover:text-white"
                }`}
              >
                {service}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="min-h-0 flex-1 overflow-y-auto p-5" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {filteredBookings.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <Calendar className="mx-auto h-12 w-12 text-neutral-700" />
              <p className="mt-3 text-sm font-medium text-neutral-300">No bookings found</p>
              <p className="mt-1 text-xs text-neutral-500">Try adjusting your filters</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredBookings.map((booking) => {
              const isExpanded = expandedBooking === booking.id;

              return (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="overflow-hidden rounded-xl border border-neutral-800/60 bg-neutral-900/40 transition hover:border-neutral-700"
                >
                  {/* Booking Header */}
                  <div className="flex items-start gap-4 p-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-base font-bold text-white">
                      {booking.customerName.split(" ").map((n) => n[0]).join("")}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-semibold text-white">{booking.customerName}</h3>
                            <span className={`rounded px-2 py-0.5 text-[10px] font-medium capitalize ${serviceColors[booking.service]}`}>
                              {serviceLabels[booking.service]}
                            </span>
                            <span className={`rounded px-2 py-0.5 text-[10px] font-medium capitalize ${statusColors[booking.status]}`}>
                              {statusLabels[booking.status]}
                            </span>
                          </div>
                          <div className="mt-1 flex items-center gap-3 text-xs text-neutral-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {booking.date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {booking.time} ({booking.duration})
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="h-3 w-3" />
                              {sourceLabels[booking.source]}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {booking.agent}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-lg font-semibold text-white">{booking.price}</span>
                          <button
                            onClick={() => setExpandedBooking(isExpanded ? null : booking.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-800/60 text-neutral-400 transition hover:bg-neutral-800 hover:text-white cursor-pointer"
                          >
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden border-t border-neutral-800/60"
                      >
                        <div className="bg-neutral-950/60 p-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Contact Information</h4>
                              <div className="mt-2 space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-neutral-300">
                                  <Phone className="h-3.5 w-3.5 text-neutral-500" />
                                  <span>{booking.phone}</span>
                                </div>
                                <div className="flex items-center gap-2 text-neutral-300">
                                  <Mail className="h-3.5 w-3.5 text-neutral-500" />
                                  <span>{booking.email}</span>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Booking Details</h4>
                              <div className="mt-2 space-y-2 text-sm text-neutral-300">
                                <div>
                                  <span className="text-neutral-500">Service:</span> {serviceLabels[booking.service]}
                                </div>
                                <div>
                                  <span className="text-neutral-500">Duration:</span> {booking.duration}
                                </div>
                                <div>
                                  <span className="text-neutral-500">Price:</span> {booking.price}
                                </div>
                              </div>
                            </div>
                          </div>

                          {booking.notes && (
                            <div className="mt-4">
                              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Notes</h4>
                              <p className="mt-2 text-sm text-neutral-300">{booking.notes}</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}

