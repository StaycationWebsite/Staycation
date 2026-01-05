"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import {
  Search,
  Phone,
  Video,
  Info,
  Send,
  Plus,
  Image as ImageIcon,
  Smile,
  X,
  Loader2,
} from "lucide-react";
import {
  useGetConversationsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useMarkMessagesAsReadMutation,
} from "@/redux/api/messagesApi";
import toast from "react-hot-toast";

interface MessagePageProps {
  onClose?: () => void;
}

export default function MessagePage({ onClose }: MessagePageProps) {
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id;

  const [search, setSearch] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch conversations
  const {
    data: conversationsData,
    isLoading: isLoadingConversations,
    refetch: refetchConversations,
  } = useGetConversationsQuery(
    { userId: userId || "" },
    { skip: !userId, pollingInterval: 5000 }
  );

  // Fetch messages for active conversation
  const {
    data: messagesData,
    isLoading: isLoadingMessages,
    refetch: refetchMessages,
  } = useGetMessagesQuery(
    { conversationId: activeId || "" },
    { skip: !activeId, pollingInterval: 3000 }
  );

  // Mutations
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  const [markAsRead] = useMarkMessagesAsReadMutation();

  const conversations = conversationsData?.data || [];
  const messages = messagesData?.data || [];

  // Set first conversation as active on load
  useEffect(() => {
    if (conversations.length > 0 && !activeId) {
      setActiveId(conversations[0].id);
    }
  }, [conversations, activeId]);

  // Mark messages as read when opening a conversation
  useEffect(() => {
    if (activeId && userId) {
      markAsRead({ conversation_id: activeId, user_id: userId });
    }
  }, [activeId, userId, markAsRead]);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeId) ?? conversations[0],
    [activeId, conversations]
  );

  const filteredConversations = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return conversations;
    return conversations.filter((c) => {
      return (
        c.name.toLowerCase().includes(term) ||
        (c.last_message && c.last_message.toLowerCase().includes(term)) ||
        c.type.toLowerCase().includes(term)
      );
    });
  }, [search, conversations]);

  const handleSendMessage = async () => {
    const text = draft.trim();
    if (!text || !activeId || !userId) return;

    try {
      await sendMessage({
        conversation_id: activeId,
        sender_id: userId,
        sender_name: session?.user?.name || "CSR",
        message_text: text,
      }).unwrap();

      setDraft("");
      refetchMessages();
      refetchConversations();
    } catch (error: any) {
      console.error("Failed to send message:", error);
      toast.error(error?.data?.error || "Failed to send message");
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h`;
    return date.toLocaleDateString();
  };

  const formatMessageTime = (timestamp: string) => {
    // Convert UTC timestamp to Philippine time (UTC+8)
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-PH", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: "Asia/Manila",
      hour12: true,
    });
  };

  const getActiveStatus = (lastMessageTime: string | undefined, type: string) => {
    if (!lastMessageTime || type !== "internal") {
      return { isActive: false, statusText: type === "internal" ? "Offline" : "Guest" };
    }

    const now = new Date();
    const lastActive = new Date(lastMessageTime);
    const diffMs = now.getTime() - lastActive.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    // Active if last message was within 3 minutes
    if (diffMins < 3) {
      return { isActive: true, statusText: "Active now" };
    }

    // Show last active time
    if (diffMins < 60) {
      return { isActive: false, statusText: `Active ${diffMins}m ago` };
    }

    if (diffMins < 1440) {
      const hours = Math.floor(diffMins / 60);
      return { isActive: false, statusText: `Active ${hours}h ago` };
    }

    return { isActive: false, statusText: "Offline" };
  };

  if (isLoadingConversations) {
    return (
      <div className="flex items-center justify-center h-[72vh]">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Messages</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Review and respond to guest and internal chat updates.</p>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr]">
          <div className="border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col h-[72vh]">
            <div className="h-16 px-4 flex items-center gap-3 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-brand-primaryLighter to-white dark:from-gray-900 dark:to-gray-900">
              <p className="text-base font-bold text-gray-900 dark:text-gray-100">Chats</p>
              <div className="ml-auto flex items-center gap-2">
                <button
                  type="button"
                  className="p-2 rounded-full hover:bg-brand-primaryLighter transition-colors"
                  title="New message"
                >
                  <Plus className="w-5 h-5 text-gray-600" />
                </button>
                {onClose && (
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-brand-primaryLighter transition-colors"
                    title="Close"
                    type="button"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                )}
              </div>
            </div>

            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search Messenger"
                  className="w-full pl-10 pr-3 py-2.5 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-100 dark:border-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary/30"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((c) => {
                const isActive = c.id === activeId;
                const activeStatus = getActiveStatus(c.last_message_time, c.type);
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setActiveId(c.id)}
                    className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors ${
                      isActive
                        ? "bg-brand-primaryLighter dark:bg-gray-800"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    }`}
                  >
                    <div className="relative">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-brand-primary to-brand-primaryDark text-white font-bold flex items-center justify-center">
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      {activeStatus.isActive && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{c.name}</p>
                        <span className="text-xs text-gray-400">•</span>
                        <p className="text-xs text-gray-400 whitespace-nowrap">
                          {c.last_message_time ? formatTime(c.last_message_time) : ""}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {activeStatus.statusText}
                      </p>
                    </div>

                    {(c.unread_count || 0) > 0 && (
                      <div className="w-6 flex justify-end">
                        <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-brand-primary text-white text-xs font-bold">
                          {c.unread_count}
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 flex flex-col h-[72vh]">
            {activeConversation ? (
              <>
                <div className="h-16 px-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-10">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-primary to-brand-primaryDark text-white font-bold flex items-center justify-center flex-shrink-0">
                      {activeConversation.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">{activeConversation.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {getActiveStatus(activeConversation.last_message_time, activeConversation.type).statusText}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button type="button" className="p-2 rounded-full hover:bg-brand-primaryLighter transition-colors" title="Call">
                      <Phone className="w-5 h-5 text-brand-primary" />
                    </button>
                    <button type="button" className="p-2 rounded-full hover:bg-brand-primaryLighter transition-colors" title="Video">
                      <Video className="w-5 h-5 text-brand-primary" />
                    </button>
                    <button type="button" className="p-2 rounded-full hover:bg-brand-primaryLighter transition-colors" title="Info">
                      <Info className="w-5 h-5 text-brand-primary" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 px-4 py-4 space-y-3">
                  {isLoadingMessages ? (
                    <div className="flex items-center justify-center h-full">
                      <Loader2 className="w-6 h-6 animate-spin text-brand-primary" />
                    </div>
                  ) : messages.length > 0 ? (
                    messages.map((m) => {
                      const isMe = m.sender_id === userId;
                      return (
                        <div key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[75%] ${isMe ? "items-end" : "items-start"} flex flex-col gap-1`}>
                            <div
                              className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                isMe
                                  ? "bg-gradient-to-r from-brand-primary to-brand-primaryDark text-white rounded-br-md"
                                  : "bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-800 rounded-bl-md"
                              }`}
                            >
                              {m.message_text}
                            </div>
                            <span className="text-[11px] text-gray-400">{formatMessageTime(m.created_at)}</span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex items-center justify-center h-full text-center">
                      <p className="text-gray-500">No messages yet. Start the conversation!</p>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3">
                  <div className="flex items-end gap-2">
                    <button type="button" className="p-2 rounded-full hover:bg-brand-primaryLighter transition-colors" title="Add">
                      <Plus className="w-5 h-5 text-brand-primary" />
                    </button>
                    <button type="button" className="p-2 rounded-full hover:bg-brand-primaryLighter transition-colors" title="Attach">
                      <ImageIcon className="w-5 h-5 text-brand-primary" />
                    </button>
                    <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-2 flex items-center gap-2 border border-gray-100 dark:border-gray-800 focus-within:bg-white dark:focus-within:bg-gray-900 focus-within:border-brand-primary/30 focus-within:ring-2 focus-within:ring-brand-primary/20">
                      <input
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !isSending) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        placeholder="Aa"
                        disabled={isSending}
                        className="flex-1 bg-transparent outline-none text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
                      />
                      <button type="button" className="p-1.5 rounded-full hover:bg-brand-primaryLighter transition-colors" title="Emoji">
                        <Smile className="w-5 h-5 text-brand-primary" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleSendMessage}
                      disabled={isSending || !draft.trim()}
                      className="p-2 rounded-full hover:bg-brand-primaryLighter transition-colors disabled:opacity-50"
                      title="Send"
                    >
                      {isSending ? (
                        <Loader2 className="w-5 h-5 text-brand-primary animate-spin" />
                      ) : (
                        <Send className="w-5 h-5 text-brand-primary" />
                      )}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Select a conversation to start messaging</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
