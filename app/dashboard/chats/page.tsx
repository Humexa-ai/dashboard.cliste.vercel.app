"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  type LucideIcon,
  AlertCircle,
  Check,
  CheckCheck,
  Clock4,
  Facebook,
  Globe,
  Instagram,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Search,
  Send,
  Sparkles,
  Tag,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type MessageStatus = "read" | "delivered" | "sent";
type MessageSender = "agent" | "customer";

type Message = {
  id: number;
  text: string;
  sender: MessageSender;
  time: string;
  status: MessageStatus;
};

type ConversationStatus = "active" | "new" | "resolved";
type ConversationPriority = "low" | "medium" | "high";
type ConversationSentiment = "positive" | "neutral" | "negative";
type TimelineItemType = "note" | "status" | "reply";

type TimelineItem = {
  id: number;
  time: string;
  type: TimelineItemType;
  title: string;
  description?: string;
  actor: string;
};

type CustomerProfile = {
  email: string;
  phone: string;
  location: string;
  memberSince: string;
  lifetimeValue: string;
  lastAppointment: string;
  loyaltyTier: string;
  segments: string[];
};

type Conversation = {
  id: number;
  name: string;
  channel: "whatsapp" | "messenger" | "instagram" | "sms" | "website";
  lastMessage: string;
  timestamp: string;
  unread: number;
  status: ConversationStatus;
  avatar: string;
  priority: ConversationPriority;
  sentiment: ConversationSentiment;
  tags: string[];
  assignee: string;
  responseTimeMinutes: number;
  slaMinutes: number;
  notes: string;
  insights: string[];
  customer: CustomerProfile;
  timeline: TimelineItem[];
  messages: Message[];
};

type ChannelOption = {
  label: string;
  value: "all" | Conversation["channel"];
  icon: LucideIcon;
};

type StatusOption = {
  label: string;
  value: "all" | ConversationStatus;
};

const conversations: Conversation[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    channel: "whatsapp",
    lastMessage: "Thanks! I'll be there at 10 AM tomorrow.",
    timestamp: "2m ago",
    unread: 0,
    status: "active",
    avatar: "SJ",
    priority: "high",
    sentiment: "positive",
    tags: ["Booking", "Colour"],
    assignee: "Layla McKenna",
    responseTimeMinutes: 3,
    slaMinutes: 30,
    notes: "Confirmed cut and colour. Prefers quieter seats in the salon.",
    insights: [
      "Send automated reminder one hour before the appointment.",
      "Offer add-on gloss treatment — mentioned interest last visit.",
    ],
    customer: {
      email: "sarah.johnson@example.com",
      phone: "+1 (555) 204-3321",
      location: "Dublin, IE",
      memberSince: "Aug 2021",
      lifetimeValue: "EUR 2,480",
      lastAppointment: "Sep 14, 2025",
      loyaltyTier: "Gold",
      segments: ["VIP", "Colour enthusiast"],
    },
    timeline: [
      {
        id: 1,
        time: "10:32 AM",
        type: "reply",
        title: "Inbound: Appointment request",
        actor: "Sarah Johnson",
        description: "Asked to confirm availability for tomorrow morning.",
      },
      {
        id: 2,
        time: "10:33 AM",
        type: "reply",
        title: "Agent reply sent",
        actor: "Layla McKenna",
        description: "Confirmed 10 AM slot and shared calendar invite.",
      },
      {
        id: 3,
        time: "10:36 AM",
        type: "status",
        title: "Status changed to Active",
        actor: "Automation",
        description: "Workflow moved conversation from New to Active.",
      },
    ],
    messages: [
      { id: 1, text: "Hi! I'd like to book a haircut appointment.", sender: "customer", time: "10:32 AM", status: "read" },
      { id: 2, text: "Of course! When would you like to come in?", sender: "agent", time: "10:33 AM", status: "read" },
      { id: 3, text: "Is tomorrow at 10 AM available?", sender: "customer", time: "10:35 AM", status: "read" },
      { id: 4, text: "Yes, that works perfectly! I've booked you in for tomorrow at 10 AM.", sender: "agent", time: "10:36 AM", status: "read" },
      { id: 5, text: "Thanks! I'll be there at 10 AM tomorrow.", sender: "customer", time: "10:38 AM", status: "delivered" },
    ],
  },
  {
    id: 2,
    name: "Emma Wilson",
    channel: "messenger",
    lastMessage: "Perfect! See you then 😊",
    timestamp: "15m ago",
    unread: 2,
    status: "new",
    avatar: "EW",
    priority: "medium",
    sentiment: "neutral",
    tags: ["Consultation"],
    assignee: "Unassigned",
    responseTimeMinutes: 7,
    slaMinutes: 45,
    notes: "Interested in a colour change before an engagement shoot later this month.",
    insights: [
      "Share consultation availability along with recent colour transformations.",
      "Suggest toner add-on for upsell once consultation is booked.",
    ],
    customer: {
      email: "emma.wilson@example.com",
      phone: "+1 (555) 991-0444",
      location: "Galway, IE",
      memberSince: "Jan 2023",
      lifetimeValue: "EUR 860",
      lastAppointment: "Jun 02, 2025",
      loyaltyTier: "Silver",
      segments: ["Colour curious"],
    },
    timeline: [
      {
        id: 1,
        time: "9:45 AM",
        type: "reply",
        title: "Inbound: Consultation enquiry",
        actor: "Emma Wilson",
        description: "Asked about availability for a colour consultation.",
      },
      {
        id: 2,
        time: "9:48 AM",
        type: "note",
        title: "Note added • needs colourist",
        actor: "Layla McKenna",
        description: "Assign to colour specialist before Thursday afternoon.",
      },
    ],
    messages: [
      { id: 1, text: "Hey! Do you have availability for a colour consultation?", sender: "customer", time: "9:45 AM", status: "read" },
      { id: 2, text: "Hi Emma! Yes, we have slots available this week. What day works for you?", sender: "agent", time: "9:47 AM", status: "read" },
      { id: 3, text: "How about Thursday afternoon?", sender: "customer", time: "9:50 AM", status: "read" },
      { id: 4, text: "Perfect! See you then 😊", sender: "customer", time: "9:52 AM", status: "sent" },
    ],
  },
  {
    id: 3,
    name: "Michael Chen",
    channel: "instagram",
    lastMessage: "Great, thank you!",
    timestamp: "1h ago",
    unread: 0,
    status: "resolved",
    avatar: "MC",
    priority: "low",
    sentiment: "positive",
    tags: ["Pricing"],
    assignee: "Layla McKenna",
    responseTimeMinutes: 5,
    slaMinutes: 45,
    notes: "Considering highlight package for mid-November. Asked to follow up closer to the date.",
    insights: ["Send price list follow-up email with highlight packages."],
    customer: {
      email: "michael.chen@example.com",
      phone: "+1 (555) 277-0909",
      location: "Cork, IE",
      memberSince: "Nov 2022",
      lifetimeValue: "EUR 1,120",
      lastAppointment: "Jul 28, 2025",
      loyaltyTier: "Silver",
      segments: ["Highlight loyalist"],
    },
    timeline: [
      {
        id: 1,
        time: "8:15 AM",
        type: "reply",
        title: "Inbound: Pricing question",
        actor: "Michael Chen",
        description: "Asked about highlight pricing tiers.",
      },
      {
        id: 2,
        time: "8:20 AM",
        type: "reply",
        title: "Agent reply sent",
        actor: "Layla McKenna",
        description: "Shared pricing and suggested consultation.",
      },
      {
        id: 3,
        time: "8:25 AM",
        type: "status",
        title: "Marked as resolved",
        actor: "Layla McKenna",
        description: "Conversation closed after customer confirmation.",
      },
    ],
    messages: [
      { id: 1, text: "What are your prices for highlights?", sender: "customer", time: "8:15 AM", status: "read" },
      { id: 2, text: "Our highlights start at EUR 120 depending on hair length and technique. Would you like to book a consultation?", sender: "agent", time: "8:20 AM", status: "read" },
      { id: 3, text: "Great, thank you!", sender: "customer", time: "8:22 AM", status: "read" },
    ],
  },
  {
    id: 4,
    name: "Lisa Anderson",
    channel: "website",
    lastMessage: "Thanks! A later afternoon works best.",
    timestamp: "2h ago",
    unread: 1,
    status: "active",
    avatar: "LA",
    priority: "medium",
    sentiment: "neutral",
    tags: ["Scheduling"],
    assignee: "Andre Doyle",
    responseTimeMinutes: 12,
    slaMinutes: 60,
    notes: "Needs to reschedule due to travel delay. Usually books Saturday afternoons.",
    insights: [
      "Send reschedule link with late afternoon availability.",
      "Offer complimentary conditioning treatment for inconvenience.",
    ],
    customer: {
      email: "lisa.anderson@example.com",
      phone: "+1 (555) 778-2188",
      location: "Dublin, IE",
      memberSince: "May 2020",
      lifetimeValue: "EUR 1,540",
      lastAppointment: "Aug 30, 2025",
      loyaltyTier: "Platinum",
      segments: ["Weekend regular"],
    },
    timeline: [
      {
        id: 1,
        time: "7:30 AM",
        type: "reply",
        title: "Inbound: Reschedule request",
        actor: "Lisa Anderson",
      },
      {
        id: 2,
        time: "7:42 AM",
        type: "note",
        title: "Note added • awaiting schedule",
        actor: "Andre Doyle",
        description: "Hold 4 PM slot on Saturday until Lisa confirms.",
      },
    ],
    messages: [
      { id: 1, text: "Can I reschedule my appointment?", sender: "customer", time: "7:30 AM", status: "delivered" },
      { id: 2, text: "Absolutely! We can move it to later in the day or another time that suits. What works for you?", sender: "agent", time: "7:34 AM", status: "sent" },
      { id: 3, text: "Thanks! A later afternoon works best.", sender: "customer", time: "7:36 AM", status: "delivered" },
    ],
  },
  {
    id: 5,
    name: "Robert Brown",
    channel: "sms",
    lastMessage: "Thanks for confirming!",
    timestamp: "3h ago",
    unread: 0,
    status: "active",
    avatar: "RB",
    priority: "low",
    sentiment: "positive",
    tags: ["Confirmation"],
    assignee: "Andre Doyle",
    responseTimeMinutes: 4,
    slaMinutes: 45,
    notes: "Regular beard trim client. Appreciates quick confirmations.",
    insights: ["Schedule recurring reminder every 4 weeks."],
    customer: {
      email: "robert.brown@example.com",
      phone: "+1 (555) 301-8877",
      location: "Waterford, IE",
      memberSince: "Feb 2019",
      lifetimeValue: "EUR 980",
      lastAppointment: "Aug 25, 2025",
      loyaltyTier: "Gold",
      segments: ["Grooming loyalist"],
    },
    timeline: [
      {
        id: 1,
        time: "6:45 AM",
        type: "reply",
        title: "Inbound: Appointment confirmation",
        actor: "Robert Brown",
      },
      {
        id: 2,
        time: "6:50 AM",
        type: "reply",
        title: "Agent reply sent",
        actor: "Andre Doyle",
        description: "Confirmed the 2 PM slot.",
      },
    ],
    messages: [
      { id: 1, text: "Just confirming my appointment for today at 2 PM.", sender: "customer", time: "6:45 AM", status: "read" },
      { id: 2, text: "Yes, you're all set for 2 PM today! See you soon.", sender: "agent", time: "6:50 AM", status: "read" },
      { id: 3, text: "Thanks for confirming!", sender: "customer", time: "6:52 AM", status: "read" },
    ],
  },
];

const channelOptions: ChannelOption[] = [
  { label: "All channels", value: "all", icon: MessageSquare },
  { label: "WhatsApp", value: "whatsapp", icon: Phone },
  { label: "Messenger", value: "messenger", icon: Facebook },
  { label: "Instagram", value: "instagram", icon: Instagram },
  { label: "SMS", value: "sms", icon: Phone },
  { label: "Website", value: "website", icon: Globe },
];

const statusOptions: StatusOption[] = [
  { label: "All statuses", value: "all" },
  { label: "New", value: "new" },
  { label: "Active", value: "active" },
  { label: "Resolved", value: "resolved" },
];

const quickReplies = [
  "Thanks for the update — you're all set on our side.",
  "Happy to help! I've gone ahead and booked that for you.",
  "Looping in our specialist for a second opinion.",
  "Could you share a quick photo so I can recommend the best option?",
];

const channelLabel: Record<Conversation["channel"], string> = {
  whatsapp: "WhatsApp",
  messenger: "Messenger",
  instagram: "Instagram",
  sms: "SMS",
  website: "Website",
};

const priorityLabel: Record<ConversationPriority, string> = {
  high: "High priority",
  medium: "Medium priority",
  low: "Low priority",
};

const sentimentLabel: Record<ConversationSentiment, string> = {
  positive: "Positive sentiment",
  neutral: "Neutral sentiment",
  negative: "Needs attention",
};

const statusLabel: Record<ConversationStatus, string> = {
  new: "New",
  active: "Active",
  resolved: "Resolved",
};

const priorityBadgeClasses: Record<ConversationPriority, string> = {
  high: "bg-rose-500/10 text-rose-200 ring-1 ring-rose-500/30",
  medium: "bg-amber-500/10 text-amber-200 ring-1 ring-amber-500/25",
  low: "bg-emerald-500/10 text-emerald-200 ring-1 ring-emerald-500/25",
};

const sentimentBadgeClasses: Record<ConversationSentiment, string> = {
  positive: "bg-emerald-500/10 text-emerald-200 ring-1 ring-emerald-500/25",
  neutral: "bg-neutral-800 text-neutral-300 ring-1 ring-neutral-700",
  negative: "bg-rose-500/10 text-rose-200 ring-1 ring-rose-500/25",
};

const statusBadgeClasses: Record<ConversationStatus, string> = {
  new: "bg-blue-500/10 text-blue-200 ring-1 ring-blue-500/25",
  active: "bg-neutral-800 text-neutral-200 ring-1 ring-neutral-700",
  resolved: "bg-emerald-500/10 text-emerald-200 ring-1 ring-emerald-500/25",
};

const timelineAccent: Record<TimelineItemType, string> = {
  reply: "bg-blue-400",
  status: "bg-neutral-500",
  note: "bg-purple-400",
};

const getChannelIcon = (channel: Conversation["channel"]) => {
  switch (channel) {
    case "whatsapp":
      return <Phone className="h-3.5 w-3.5" />;
    case "messenger":
      return <Facebook className="h-3.5 w-3.5" />;
    case "instagram":
      return <Instagram className="h-3.5 w-3.5" />;
    case "sms":
      return <Phone className="h-3.5 w-3.5" />;
    case "website":
      return <Globe className="h-3.5 w-3.5" />;
    default:
      return <MessageSquare className="h-3.5 w-3.5" />;
  }
};

const formatMinutes = (value: number) => {
  if (value <= 0) {
    return "<1m";
  }

  if (value < 60) {
    return `${Math.round(value)}m`;
  }

  const hours = value / 60;
  if (hours < 10) {
    return `${hours.toFixed(1)}h`;
  }

  return `${Math.round(hours)}h`;
};

function ConversationDetails({ conversation, isCompact = false }: { conversation: Conversation; isCompact?: boolean }) {
  return (
    <div className={`space-y-5 ${isCompact ? "" : "lg:space-y-6"}`}>
      <section className="rounded-2xl border border-neutral-800/60 bg-neutral-950/60 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-white">Customer profile</h3>
            <p className="mt-1 text-xs text-neutral-400">Key context to personalise your response.</p>
          </div>
          <span className="rounded-full bg-neutral-900 px-3 py-1 text-xs font-medium text-neutral-300">
            {conversation.customer.loyaltyTier} tier
          </span>
        </div>
        <div className="mt-4 space-y-3 text-sm text-neutral-300">
          <div className="flex items-center gap-3 text-neutral-300">
            <Mail className="h-4 w-4 text-neutral-500" />
            <span>{conversation.customer.email}</span>
          </div>
          <div className="flex items-center gap-3 text-neutral-300">
            <Phone className="h-4 w-4 text-neutral-500" />
            <span>{conversation.customer.phone}</span>
          </div>
          <div className="flex items-center gap-3 text-neutral-300">
            <MapPin className="h-4 w-4 text-neutral-500" />
            <span>{conversation.customer.location}</span>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-neutral-400">
          <div>
            <p className="font-medium text-neutral-300">Member since</p>
            <p>{conversation.customer.memberSince}</p>
          </div>
          <div>
            <p className="font-medium text-neutral-300">Last appointment</p>
            <p>{conversation.customer.lastAppointment}</p>
          </div>
          <div>
            <p className="font-medium text-neutral-300">Lifetime value</p>
            <p>{conversation.customer.lifetimeValue}</p>
          </div>
          <div>
            <p className="font-medium text-neutral-300">SLA target</p>
            <p>{formatMinutes(conversation.slaMinutes)}</p>
          </div>
        </div>
        <div className="mt-4">
          <h4 className="text-xs font-medium uppercase tracking-wide text-neutral-500">Segments</h4>
          <div className="mt-2 flex flex-wrap gap-2">
            {conversation.customer.segments.map((segment) => (
              <span key={segment} className="rounded-full bg-neutral-900 px-3 py-1 text-xs text-neutral-300">
                {segment}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-neutral-800/60 bg-neutral-950/60 p-5">
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-neutral-500" />
          <h3 className="text-sm font-semibold text-white">Conversation context</h3>
        </div>
        <p className="mt-3 text-sm text-neutral-300">{conversation.notes}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {conversation.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-neutral-900 px-3 py-1 text-xs text-neutral-300">
              {tag}
            </span>
          ))}
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${priorityBadgeClasses[conversation.priority]}`}>
            {priorityLabel[conversation.priority]}
          </span>
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${sentimentBadgeClasses[conversation.sentiment]}`}>
            {sentimentLabel[conversation.sentiment]}
          </span>
        </div>
      </section>

      <section className="rounded-2xl border border-neutral-800/60 bg-neutral-950/60 p-5">
        <h3 className="text-sm font-semibold text-white">Conversation timeline</h3>
        <div className="mt-4 space-y-5">
          {conversation.timeline.map((item, index) => (
            <div key={item.id} className="relative pl-6">
              <span className={`absolute left-0 top-1 h-2.5 w-2.5 rounded-full ${timelineAccent[item.type]}`} />
              {index !== conversation.timeline.length - 1 ? (
                <span className="absolute left-[5px] top-3 h-full w-px bg-neutral-800" />
              ) : null}
              <p className="text-xs uppercase tracking-wide text-neutral-500">{item.time}</p>
              <p className="mt-1 text-sm font-medium text-white">{item.title}</p>
              {item.description ? <p className="mt-1 text-xs text-neutral-400">{item.description}</p> : null}
              <p className="mt-1 text-xs text-neutral-500">{item.actor}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-neutral-800/60 bg-neutral-950/60 p-5">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-emerald-300" />
          <h3 className="text-sm font-semibold text-white">Next best actions</h3>
        </div>
        <ul className="mt-4 space-y-3 text-sm text-neutral-300">
          {conversation.insights.map((insight) => (
            <li key={insight} className="rounded-xl border border-neutral-800/60 bg-neutral-900/60 px-3 py-2">
              {insight}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default function ChatsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [channelFilter, setChannelFilter] = useState<ChannelOption["value"]>("all");
  const [statusFilter, setStatusFilter] = useState<StatusOption["value"]>("all");
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(conversations[0]?.id ?? null);
  const [messageInput, setMessageInput] = useState("");
  const [conversationsState, setConversationsState] = useState(conversations);

  const filteredConversations = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return conversationsState.filter((conversation) => {
      const matchesChannel = channelFilter === "all" || conversation.channel === channelFilter;
      const matchesStatus = statusFilter === "all" || conversation.status === statusFilter;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        conversation.name.toLowerCase().includes(normalizedSearch) ||
        conversation.lastMessage.toLowerCase().includes(normalizedSearch) ||
        conversation.tags.some((tag) => tag.toLowerCase().includes(normalizedSearch)) ||
        conversation.messages.some((message) => message.text.toLowerCase().includes(normalizedSearch));

      return matchesChannel && matchesStatus && matchesSearch;
    });
  }, [channelFilter, statusFilter, searchTerm, conversationsState]);

  useEffect(() => {
    if (filteredConversations.length === 0) {
      if (selectedConversationId !== null) {
        setSelectedConversationId(null);
      }
      return;
    }

    const stillVisible = filteredConversations.some((conversation) => conversation.id === selectedConversationId);
    if (!stillVisible) {
      setSelectedConversationId(filteredConversations[0].id);
    }
  }, [filteredConversations, selectedConversationId]);

  const selectedConversation = useMemo(
    () => conversationsState.find((conversation) => conversation.id === selectedConversationId) ?? null,
    [selectedConversationId, conversationsState],
  );

  const handleSelectConversation = (conversationId: number) => {
    setSelectedConversationId(conversationId);
    // Mark conversation as read by setting unread to 0
    setConversationsState((prev) =>
      prev.map((conv) =>
        conv.id === conversationId ? { ...conv, unread: 0 } : conv
      )
    );
  };

  const metrics = useMemo(() => {
    const open = conversations.filter((conversation) => conversation.status !== "resolved").length;
    const awaiting = conversations.filter((conversation) => conversation.unread > 0).length;
    const highPriority = conversations.filter((conversation) => conversation.priority === "high").length;
    const averageResponseMinutes =
      conversations.reduce((total, conversation) => total + conversation.responseTimeMinutes, 0) / conversations.length;

    return {
      open,
      awaiting,
      highPriority,
      averageResponseMinutes,
    };
  }, []);

  const summaryCards = [
    {
      label: "Open conversations",
      value: metrics.open.toString(),
      helper: "+3 vs yesterday",
      accent: "bg-blue-500/10 text-blue-200",
      icon: MessageSquare,
    },
    {
      label: "Awaiting response",
      value: metrics.awaiting.toString(),
      helper: "Respond within SLA",
      accent: "bg-amber-500/10 text-amber-200",
      icon: AlertCircle,
    },
    {
      label: "High priority",
      value: metrics.highPriority.toString(),
      helper: "Escalate if overdue",
      accent: "bg-rose-500/10 text-rose-200",
      icon: AlertCircle,
    },
    {
      label: "Avg response time",
      value: formatMinutes(Math.round(metrics.averageResponseMinutes)),
      helper: "Goal < 5m",
      accent: "bg-emerald-500/10 text-emerald-200",
      icon: Clock4,
    },
  ];

  const handleSendMessage = () => {
    if (!messageInput.trim()) {
      return;
    }

    setMessageInput("");
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
          <h1 className="text-xl font-semibold text-white">Messages</h1>
          <p className="mt-0.5 text-xs text-neutral-400">AI agent chat logs across all platforms</p>
        </div>
      </header>

      {/* Filters */}
      <div className="shrink-0 border-b border-neutral-800/70 bg-neutral-900/30 px-5 py-3">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by name..."
              className="w-full rounded-lg border border-neutral-800/60 bg-neutral-900/60 py-2 pl-10 pr-3 text-sm text-white placeholder-neutral-500 focus:border-neutral-700 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            {channelOptions.map((option) => {
              const count =
                option.value === "all"
                  ? conversations.length
                  : conversations.filter((conversation) => conversation.channel === option.value).length;
              const isActive = channelFilter === option.value;
              const Icon = option.icon;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setChannelFilter(option.value)}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition ${
                    isActive
                      ? "bg-blue-500 text-white"
                      : "bg-neutral-800/60 text-neutral-400 hover:bg-neutral-800 hover:text-white"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{option.label}</span>
                  <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${isActive ? "bg-blue-600" : "bg-neutral-700"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content - 2 Column Layout */}
      <div className="flex min-h-0 flex-1">
        {/* Conversations List */}
        <aside className="flex w-96 shrink-0 flex-col border-r border-neutral-800/70 bg-neutral-900/20">
          <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            {filteredConversations.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
                <MessageSquare className="h-8 w-8 text-neutral-700" />
                <p className="text-sm font-medium text-neutral-300">No conversations found</p>
                <p className="text-xs text-neutral-500">Try adjusting your filters</p>
              </div>
            ) : (
              filteredConversations.map((conversation) => {
                const isSelected = selectedConversationId === conversation.id;

                return (
                  <button
                    key={conversation.id}
                    type="button"
                    onClick={() => handleSelectConversation(conversation.id)}
                    className={`relative flex w-full items-start gap-3 border-b border-neutral-800/40 px-4 py-3 text-left transition hover:bg-neutral-800/30 ${
                      isSelected ? "bg-neutral-800/50" : ""
                    }`}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-neutral-700 to-neutral-800 text-sm font-semibold text-white">
                      {conversation.avatar}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-semibold text-white">{conversation.name}</span>
                        <span className="shrink-0 text-xs text-neutral-500">{conversation.timestamp}</span>
                      </div>
                      <div className="mt-0.5 flex items-center gap-2">
                        <span className="flex items-center gap-1 text-[10px] text-neutral-500">
                          {getChannelIcon(conversation.channel)}
                          {channelLabel[conversation.channel]}
                        </span>
                      </div>
                      <p className="mt-1 line-clamp-1 text-xs text-neutral-400">{conversation.lastMessage}</p>
                      {conversation.unread > 0 && (
                        <div className="absolute right-4 top-1/2 mt-1 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full bg-blue-500 text-[10px] font-semibold text-white">
                          {conversation.unread}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* Chat View */}
        <main className="flex min-h-0 flex-1 flex-col">
          <AnimatePresence mode="wait">
            {selectedConversation ? (
              <motion.div
                key={selectedConversation.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="flex h-full flex-col"
              >
                {/* Chat Header */}
                <div className="shrink-0 border-b border-neutral-800/70 bg-neutral-900/20 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-neutral-700 to-neutral-800 text-sm font-semibold text-white">
                      {selectedConversation.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-semibold text-white">{selectedConversation.name}</h2>
                        <span className="flex items-center gap-1 text-xs text-neutral-400">
                          {getChannelIcon(selectedConversation.channel)}
                          {channelLabel[selectedConversation.channel]}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-neutral-500">
                        {selectedConversation.customer.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages - Read Only */}
                <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  <style jsx>{`
                    div::-webkit-scrollbar {
                      display: none;
                    }
                  `}</style>
                  {selectedConversation.messages.map((message, index) => {
                    const isAgent = message.sender === "agent";

                    return (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className={`flex ${isAgent ? "justify-end" : "justify-start"}`}
                      >
                        <div className="max-w-[65%]">
                          <div className="mb-1 text-xs text-neutral-500">
                            {isAgent ? "Agent" : selectedConversation.name} • {message.time}
                          </div>
                          <div
                            className={`rounded-2xl px-4 py-3 text-sm ${
                              isAgent
                                ? "bg-blue-500 text-white"
                                : "border border-neutral-800 bg-neutral-900/70 text-neutral-200"
                            }`}
                          >
                            <p className="leading-relaxed">{message.text}</p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-1 items-center justify-center"
              >
                <div className="text-center">
                  <MessageSquare className="mx-auto h-12 w-12 text-neutral-700" />
                  <p className="mt-3 text-sm font-medium text-neutral-300">Select a conversation</p>
                  <p className="mt-1 text-xs text-neutral-500">Choose a conversation from the list to view messages</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </motion.div>
  );
}

