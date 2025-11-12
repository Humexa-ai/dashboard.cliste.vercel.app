"use client";

import React, { useState, useMemo } from "react";
import { Phone, Clock, User, MessageSquare, Calendar, ChevronDown, ChevronUp, Search, TrendingUp, TrendingDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type CallType = "inbound" | "outbound";
type CallOutcome = "answered" | "missed" | "voicemail";
type CallCategory = "booking" | "faq" | "general";
type CallSentiment = "positive" | "neutral" | "negative";

type CallRecord = {
  id: number;
  customerName: string;
  phone: string;
  date: string;
  time: string;
  duration: string;
  durationSeconds: number;
  type: CallType;
  outcome: CallOutcome;
  category: CallCategory;
  sentiment: CallSentiment;
  agent: string;
  topic: string;
  notes: string;
  transcript: string;
  resolved: boolean;
};

const callLogs: CallRecord[] = [
  {
    id: 1,
    customerName: "Sarah Johnson",
    phone: "+353 87 204 3321",
    date: "Nov 11, 2025",
    time: "10:32 AM",
    duration: "12m 34s",
    durationSeconds: 754,
    type: "inbound",
    outcome: "answered",
    category: "booking",
    sentiment: "positive",
    agent: "AI Agent",
    topic: "Haircut appointment booking",
    notes: "Customer requested appointment for tomorrow morning",
    transcript: "Customer: Hi, I'd like to book a haircut appointment.\nAgent: Of course! I'd be happy to help you book an appointment. What day works best for you?\nCustomer: Is tomorrow at 10 AM available?\nAgent: Let me check our availability... Yes, tomorrow at 10 AM is available. Would you like me to book that for you?\nCustomer: Yes, please.\nAgent: Perfect! I've booked you in for tomorrow at 10 AM. You'll receive a confirmation email shortly. Is there anything else I can help you with?\nCustomer: No, that's all. Thank you!\nAgent: You're welcome! We look forward to seeing you tomorrow.",
    resolved: true,
  },
  {
    id: 2,
    customerName: "Emma Wilson",
    phone: "+353 89 991 0444",
    date: "Nov 11, 2025",
    time: "09:45 AM",
    duration: "8m 12s",
    durationSeconds: 492,
    type: "inbound",
    outcome: "answered",
    category: "faq",
    sentiment: "neutral",
    agent: "AI Agent",
    topic: "Color consultation inquiry",
    notes: "Asked about pricing and availability",
    transcript: "Customer: Hey! Do you have availability for a color consultation?\nAgent: Hi! Yes, we have slots available this week. Color consultations typically take 30 minutes. What day works for you?\nCustomer: How about Thursday afternoon?\nAgent: Thursday afternoon works great. Our colorist is available at 2 PM or 4 PM. Which time suits you better?\nCustomer: 2 PM would be perfect.\nAgent: Excellent! I've scheduled your color consultation for Thursday at 2 PM. Is there anything specific you'd like to discuss during the consultation?",
    resolved: true,
  },
  {
    id: 3,
    customerName: "Michael Chen",
    phone: "+353 85 277 0909",
    date: "Nov 11, 2025",
    time: "08:15 AM",
    duration: "5m 43s",
    durationSeconds: 343,
    type: "inbound",
    outcome: "answered",
    category: "faq",
    sentiment: "positive",
    agent: "AI Agent",
    topic: "Pricing question",
    notes: "Asked about highlight pricing",
    transcript: "Customer: What are your prices for highlights?\nAgent: Our highlight services start at EUR 120, though the final price depends on hair length and the technique used. We offer partial highlights, full highlights, and balayage. Would you like more details about a specific service?\nCustomer: That's helpful, thank you.\nAgent: You're welcome! Would you like to book a consultation to discuss which option would work best for you?\nCustomer: Not right now, but I'll call back later. Thanks!",
    resolved: true,
  },
  {
    id: 4,
    customerName: "Lisa Anderson",
    phone: "+353 86 778 2188",
    date: "Nov 11, 2025",
    time: "07:30 AM",
    duration: "6m 18s",
    durationSeconds: 378,
    type: "inbound",
    outcome: "answered",
    category: "booking",
    sentiment: "neutral",
    agent: "AI Agent",
    topic: "Reschedule appointment",
    notes: "Customer needs to move appointment to later time",
    transcript: "Customer: Can I reschedule my appointment?\nAgent: Absolutely! I can help you with that. What time works better for you?\nCustomer: I need to move it to later in the day.\nAgent: No problem. We have availability at 2 PM, 4 PM, or 5:30 PM. Which would you prefer?\nCustomer: 4 PM would be great.\nAgent: Perfect! I've moved your appointment to 4 PM. You'll receive an updated confirmation shortly.",
    resolved: true,
  },
  {
    id: 5,
    customerName: "Robert Brown",
    phone: "+353 83 301 8877",
    date: "Nov 10, 2025",
    time: "06:45 PM",
    duration: "4m 21s",
    durationSeconds: 261,
    type: "inbound",
    outcome: "answered",
    category: "faq",
    sentiment: "positive",
    agent: "AI Agent",
    topic: "Appointment confirmation",
    notes: "Customer confirming existing appointment",
    transcript: "Customer: Just confirming my appointment for tomorrow at 2 PM.\nAgent: Let me check that for you... Yes, you're all set for tomorrow at 2 PM. Your appointment is confirmed.\nCustomer: Perfect, thank you!\nAgent: You're welcome! See you tomorrow at 2 PM.",
    resolved: true,
  },
];

export default function CallsPage() {
  const [selectedCall, setSelectedCall] = useState<CallRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | CallCategory>("all");
  const [expandedTranscript, setExpandedTranscript] = useState<number | null>(null);

  const filteredCalls = useMemo(() => {
    return callLogs.filter((call) => {
      const matchesSearch =
        searchTerm.length === 0 ||
        call.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        call.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        call.phone.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = categoryFilter === "all" || call.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, categoryFilter]);

  const metrics = useMemo(() => {
    const totalCalls = callLogs.length;
    const avgDuration = Math.round(callLogs.reduce((sum, call) => sum + call.durationSeconds, 0) / totalCalls);
    const bookingCalls = callLogs.filter((c) => c.category === "booking").length;
    const faqCalls = callLogs.filter((c) => c.category === "faq").length;
    const resolvedRate = Math.round((callLogs.filter((c) => c.resolved).length / totalCalls) * 100);

    return {
      totalCalls,
      avgDuration,
      bookingCalls,
      faqCalls,
      resolvedRate,
    };
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-neutral-800/80 bg-neutral-950/60"
    >
      {/* Header */}
      <header className="shrink-0 border-b border-neutral-800/70 px-5 py-4">
        <div>
          <h1 className="text-xl font-semibold text-white">Voice Calls</h1>
          <p className="mt-0.5 text-xs text-neutral-400">AI agent call logs and transcripts</p>
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
            {(["all", "booking", "faq", "general"] as const).map((category) => (
              <button
                key={category}
                onClick={() => setCategoryFilter(category)}
                className={`rounded-lg px-4 py-2 text-xs font-medium capitalize transition ${
                  categoryFilter === category
                    ? "bg-blue-500 text-white"
                    : "bg-neutral-800/60 text-neutral-400 hover:bg-neutral-800 hover:text-white"
                }`}
              >
                {category === "all" ? "All Calls" : category}
                {category !== "all" && (
                  <span className="ml-2 text-[10px]">
                    ({category === "booking" ? metrics.bookingCalls : category === "faq" ? metrics.faqCalls : 0})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Call Logs */}
      <div className="flex-1 overflow-y-auto p-5" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {filteredCalls.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <Phone className="mx-auto h-12 w-12 text-neutral-700" />
              <p className="mt-3 text-sm font-medium text-neutral-300">No calls found</p>
              <p className="mt-1 text-xs text-neutral-500">Try adjusting your filters</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredCalls.map((call) => {
              const isExpanded = expandedTranscript === call.id;

              return (
                <motion.div
                  key={call.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="overflow-hidden rounded-xl border border-neutral-800/60 bg-neutral-900/40 transition hover:border-neutral-700"
                >
                  {/* Call Header */}
                  <div className="flex items-start gap-4 p-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-base font-bold text-white">
                      {call.customerName.split(' ').map(n => n[0]).join('')}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-semibold text-white">{call.customerName}</h3>
                            <span
                              className={`rounded px-2 py-0.5 text-[10px] font-medium capitalize ${
                                call.category === "booking"
                                  ? "bg-blue-500/10 text-blue-400"
                                  : "bg-purple-500/10 text-purple-400"
                              }`}
                            >
                              {call.category}
                            </span>
                          </div>
                          <p className="mt-0.5 text-xs text-neutral-400">{call.topic}</p>
                          <div className="mt-1 flex items-center gap-3 text-xs text-neutral-500">
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {call.phone}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {call.date} at {call.time}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {call.duration}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {call.agent}
                            </span>
                          </div>
                        </div>

                      </div>

                      {call.notes && (
                        <p className="mt-2 text-xs text-neutral-400">
                          <span className="font-medium text-neutral-300">Note:</span> {call.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Transcript Section */}
                  <div className="border-t border-neutral-800/60">
                    <button
                      onClick={() => setExpandedTranscript(isExpanded ? null : call.id)}
                      className="flex w-full items-center justify-between bg-neutral-900/60 px-4 py-3 text-left transition hover:bg-neutral-900"
                    >
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-neutral-400" />
                        <span className="text-sm font-medium text-white">Call Transcript</span>
                        <span className="text-xs text-neutral-500">
                          ({call.transcript.split("\n").length} exchanges)
                        </span>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-neutral-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-neutral-400" />
                      )}
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="bg-neutral-950/60 p-4">
                            <div className="space-y-2 rounded-lg bg-neutral-900/60 p-4 font-mono text-sm">
                              {call.transcript.split("\n").map((line, idx) => {
                                const isCustomer = line.startsWith("Customer:");
                                const isAgent = line.startsWith("Agent:");
                                
                                if (isCustomer) {
                                  const text = line.replace(/^Customer:\s*/, "");
                                  return (
                                    <div key={idx} className="flex gap-3">
                                      <span className="shrink-0 font-semibold text-blue-400">{call.customerName}:</span>
                                      <span className="text-neutral-300">{text}</span>
                                    </div>
                                  );
                                }
                                
                                if (isAgent) {
                                  const text = line.replace(/^Agent:\s*/, "");
                                  return (
                                    <div key={idx} className="flex gap-3">
                                      <span className="shrink-0 font-semibold text-emerald-400">Agent:</span>
                                      <span className="text-neutral-300">{text}</span>
                                    </div>
                                  );
                                }
                                
                                return null;
                              })}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}

