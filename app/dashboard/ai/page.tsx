"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, TrendingUp, Users, Phone, MessageSquare, Calendar, Loader2 } from "lucide-react";
import ClisteAIInput from "@/components/ui/cliste-ai-input";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface QuickAction {
  icon: React.ReactNode;
  label: string;
  query: string;
}

export default function ClisteAIPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickActions: QuickAction[] = [
    {
      icon: <TrendingUp className="h-4 w-4" />,
      label: "Business Performance",
      query: "Show me an overview of my business performance this month"
    },
    {
      icon: <Users className="h-4 w-4" />,
      label: "Customer Insights",
      query: "What are the key customer insights from recent interactions?"
    },
    {
      icon: <Phone className="h-4 w-4" />,
      label: "Call Analytics",
      query: "Analyze my recent voice call data"
    },
    {
      icon: <MessageSquare className="h-4 w-4" />,
      label: "Chat Summary",
      query: "Summarize recent chat conversations"
    },
    {
      icon: <Calendar className="h-4 w-4" />,
      label: "Booking Trends",
      query: "Show me booking trends and patterns"
    },
  ];

  const handleSubmit = async (value: string) => {
    if (!value.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: value,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `I'm analyzing your business data for: "${value}". This is a demo response. In production, I'll connect to your n8n workflows and provide real insights about your business performance, customer interactions, and operational metrics.`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleQuickAction = (query: string) => {
    handleSubmit(query);
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
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30">
            <Sparkles className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white">Cliste AI Assistant</h1>
            <p className="mt-0.5 text-xs text-neutral-400">
              Ask me anything about your business performance and analytics
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-5 relative" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {/* Empty State */}
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex h-full flex-col items-center justify-center"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 mb-6">
              <Sparkles className="h-10 w-10 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Welcome to Cliste AI</h2>
            <p className="text-sm text-neutral-400 text-center max-w-md mb-8">
              I can help you understand your business performance, analyze customer interactions,
              and provide insights from your data. Try asking me something!
            </p>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 w-full max-w-3xl">
              {quickActions.map((action, index) => (
                <motion.button
                  key={action.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleQuickAction(action.query)}
                  className="flex items-center gap-3 rounded-xl border border-neutral-800/60 bg-neutral-900/40 p-4 text-left transition hover:border-neutral-700 hover:bg-neutral-900/60 cursor-pointer group"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 transition">
                    {action.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{action.label}</p>
                    <p className="text-xs text-neutral-500 mt-0.5 line-clamp-1">{action.query}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Messages */}
        {messages.length > 0 && (
          <div className="space-y-6 pb-32">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 text-white"
                        : "bg-neutral-900/60 border border-neutral-800/60 text-neutral-200"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="h-4 w-4 text-purple-400" />
                        <span className="text-xs font-medium text-purple-400">Cliste AI</span>
                      </div>
                    )}
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    <p className="mt-2 text-[10px] text-neutral-500">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Loading Indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-neutral-900/60 border border-neutral-800/60">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-purple-400" />
                    <span className="text-xs font-medium text-purple-400">Cliste AI</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-400">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Analyzing your data...</span>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="shrink-0 pb-6">
        <ClisteAIInput
          placeholder="Ask ClisteAI"
          onSubmit={handleSubmit}
          disabled={isLoading}
          glowIntensity={0.6}
          expandOnFocus={true}
          textColor="#FFFFFF"
          backgroundOpacity={0.15}
          showEffects={true}
          menuOptions={["Auto", "Max", "Search", "Plan"]}
        />
      </div>
    </motion.div>
  );
}

