"use client";

import React, { useState, useMemo } from "react";
import { MessageSquare, Phone, Calendar, Clock, User, Mail, CheckCheck, Bell, Filter } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

type NotificationType = "new_message" | "missed_call" | "booking_confirmed" | "appointment_reminder" | "follow_up";
type NotificationSource = "whatsapp" | "messenger" | "instagram" | "sms" | "website" | "phone";

type Notification = {
  id: number;
  type: NotificationType;
  source: NotificationSource;
  customerName: string;
  message: string;
  preview: string;
  timestamp: string;
  date: Date;
  isRead: boolean;
  link: string;
};

const notifications: Notification[] = [
  {
    id: 1,
    type: "new_message",
    source: "whatsapp",
    customerName: "Sarah Johnson",
    message: "New message received",
    preview: "Thanks! I'll be there at 10 AM tomorrow.",
    timestamp: "2 min ago",
    date: new Date(Date.now() - 2 * 60 * 1000),
    isRead: false,
    link: "/dashboard/chats",
  },
  {
    id: 2,
    type: "booking_confirmed",
    source: "phone",
    customerName: "Emma Wilson",
    message: "Booking confirmed via phone call",
    preview: "Color consultation scheduled for Thursday at 2 PM",
    timestamp: "15 min ago",
    date: new Date(Date.now() - 15 * 60 * 1000),
    isRead: false,
    link: "/dashboard/calls",
  },
  {
    id: 3,
    type: "new_message",
    source: "messenger",
    customerName: "Michael Chen",
    message: "New message received",
    preview: "Great, thank you for the pricing information!",
    timestamp: "1 hour ago",
    date: new Date(Date.now() - 60 * 60 * 1000),
    isRead: true,
    link: "/dashboard/chats",
  },
  {
    id: 4,
    type: "appointment_reminder",
    source: "website",
    customerName: "Lisa Anderson",
    message: "Appointment in 2 hours",
    preview: "Haircut appointment at 4:00 PM today",
    timestamp: "2 hours ago",
    date: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isRead: true,
    link: "/dashboard/chats",
  },
  {
    id: 5,
    type: "new_message",
    source: "sms",
    customerName: "Robert Brown",
    message: "New message received",
    preview: "Thanks for confirming my appointment!",
    timestamp: "3 hours ago",
    date: new Date(Date.now() - 3 * 60 * 60 * 1000),
    isRead: true,
    link: "/dashboard/chats",
  },
  {
    id: 6,
    type: "booking_confirmed",
    source: "phone",
    customerName: "Sarah Johnson",
    message: "Booking confirmed via phone call",
    preview: "Haircut appointment scheduled for tomorrow at 10 AM",
    timestamp: "Yesterday",
    date: new Date(Date.now() - 24 * 60 * 60 * 1000),
    isRead: true,
    link: "/dashboard/calls",
  },
  {
    id: 7,
    type: "follow_up",
    source: "instagram",
    customerName: "Emma Wilson",
    message: "Follow-up needed",
    preview: "Customer inquired about color services, awaiting response",
    timestamp: "Yesterday",
    date: new Date(Date.now() - 26 * 60 * 60 * 1000),
    isRead: true,
    link: "/dashboard/chats",
  },
  {
    id: 8,
    type: "missed_call",
    source: "phone",
    customerName: "David Martinez",
    message: "Missed call",
    preview: "Attempted to reach you at 3:45 PM",
    timestamp: "2 days ago",
    date: new Date(Date.now() - 48 * 60 * 60 * 1000),
    isRead: true,
    link: "/dashboard/calls",
  },
];

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case "new_message":
      return <MessageSquare className="h-4 w-4" />;
    case "missed_call":
      return <Phone className="h-4 w-4" />;
    case "booking_confirmed":
      return <CheckCheck className="h-4 w-4" />;
    case "appointment_reminder":
      return <Calendar className="h-4 w-4" />;
    case "follow_up":
      return <Bell className="h-4 w-4" />;
  }
};

const getNotificationColor = (type: NotificationType) => {
  switch (type) {
    case "new_message":
      return "bg-blue-500/10 text-blue-400";
    case "missed_call":
      return "bg-rose-500/10 text-rose-400";
    case "booking_confirmed":
      return "bg-emerald-500/10 text-emerald-400";
    case "appointment_reminder":
      return "bg-purple-500/10 text-purple-400";
    case "follow_up":
      return "bg-amber-500/10 text-amber-400";
  }
};

const getSourceLabel = (source: NotificationSource) => {
  switch (source) {
    case "whatsapp":
      return "WhatsApp";
    case "messenger":
      return "Messenger";
    case "instagram":
      return "Instagram";
    case "sms":
      return "SMS";
    case "website":
      return "Website";
    case "phone":
      return "Phone";
  }
};

const getSourceIcon = (source: NotificationSource) => {
  switch (source) {
    case "phone":
      return <Phone className="h-3 w-3" />;
    default:
      return <MessageSquare className="h-3 w-3" />;
  }
};

const groupNotificationsByDate = (notifications: Notification[]) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const thisWeek = new Date(today);
  thisWeek.setDate(thisWeek.getDate() - 7);

  const groups: { [key: string]: Notification[] } = {
    Today: [],
    Yesterday: [],
    "This Week": [],
    Older: [],
  };

  notifications.forEach((notification) => {
    const notifDate = new Date(notification.date);
    if (notifDate >= today) {
      groups.Today.push(notification);
    } else if (notifDate >= yesterday) {
      groups.Yesterday.push(notification);
    } else if (notifDate >= thisWeek) {
      groups["This Week"].push(notification);
    } else {
      groups.Older.push(notification);
    }
  });

  return groups;
};

export default function InboxPage() {
  const [filter, setFilter] = useState<"all" | "unread" | "chats" | "calls">("all");
  const [notificationsState, setNotificationsState] = useState(notifications);

  const filteredNotifications = useMemo(() => {
    return notificationsState.filter((notification) => {
      if (filter === "unread") return !notification.isRead;
      if (filter === "chats") return notification.source !== "phone";
      if (filter === "calls") return notification.source === "phone";
      return true;
    });
  }, [filter, notificationsState]);

  const groupedNotifications = useMemo(() => {
    return groupNotificationsByDate(filteredNotifications);
  }, [filteredNotifications]);

  const unreadCount = notificationsState.filter((n) => !n.isRead).length;

  const markAllAsRead = () => {
    setNotificationsState((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const markAsRead = (id: number) => {
    setNotificationsState((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex h-full w-full max-h-full flex-col overflow-hidden rounded-2xl border border-neutral-800/80 bg-neutral-950/60"
    >
      {/* Header */}
      <header className="shrink-0 border-b border-neutral-800/70 px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white">Inbox</h1>
            <p className="mt-0.5 text-xs text-neutral-400">Unified notifications from all channels</p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="rounded-lg bg-blue-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-blue-600"
            >
              Mark all as read
            </button>
          )}
        </div>
      </header>

      {/* Filters */}
      <div className="shrink-0 border-b border-neutral-800/70 bg-neutral-900/30 px-5 py-3">
        <div className="flex items-center gap-2">
          {(["all", "unread", "chats", "calls"] as const).map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium capitalize transition ${
                filter === filterOption
                  ? "bg-blue-500 text-white"
                  : "bg-neutral-800/60 text-neutral-400 hover:bg-neutral-800 hover:text-white"
              }`}
            >
              {filterOption === "all" && <Filter className="h-3.5 w-3.5" />}
              {filterOption === "unread" && <Bell className="h-3.5 w-3.5" />}
              {filterOption === "chats" && <MessageSquare className="h-3.5 w-3.5" />}
              {filterOption === "calls" && <Phone className="h-3.5 w-3.5" />}
              {filterOption}
              {filterOption === "unread" && unreadCount > 0 && (
                <span className="rounded-full bg-blue-600 px-1.5 py-0.5 text-[10px] font-semibold">{unreadCount}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="min-h-0 flex-1 overflow-y-auto p-5" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {filteredNotifications.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <Bell className="mx-auto h-12 w-12 text-neutral-700" />
              <p className="mt-3 text-sm font-medium text-neutral-300">No notifications</p>
              <p className="mt-1 text-xs text-neutral-500">You're all caught up!</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedNotifications).map(([group, items]) => {
              if (items.length === 0) return null;

              return (
                <div key={group}>
                  <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">{group}</h2>
                  <div className="space-y-2">
                    {items.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Link
                          href={notification.link}
                          onClick={() => markAsRead(notification.id)}
                          className={`block rounded-xl border p-4 transition hover:border-neutral-700 ${
                            notification.isRead
                              ? "border-neutral-800/60 bg-neutral-900/20"
                              : "border-blue-500/30 bg-blue-500/5"
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            {/* Icon */}
                            <div
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${getNotificationColor(notification.type)}`}
                            >
                              {getNotificationIcon(notification.type)}
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <h3
                                      className={`text-sm font-semibold ${notification.isRead ? "text-neutral-300" : "text-white"}`}
                                    >
                                      {notification.customerName}
                                    </h3>
                                    {!notification.isRead && (
                                      <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                                    )}
                                  </div>
                                  <p
                                    className={`mt-0.5 text-xs ${notification.isRead ? "text-neutral-500" : "text-neutral-400"}`}
                                  >
                                    {notification.message}
                                  </p>
                                  <p
                                    className={`mt-1 text-sm ${notification.isRead ? "text-neutral-400" : "text-neutral-300"}`}
                                  >
                                    {notification.preview}
                                  </p>
                                  <div className="mt-2 flex items-center gap-3 text-xs text-neutral-500">
                                    <span className="flex items-center gap-1">
                                      {getSourceIcon(notification.source)}
                                      {getSourceLabel(notification.source)}
                                    </span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {notification.timestamp}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}

