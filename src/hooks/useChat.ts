import { useEffect, useState, useRef } from "react";
import { useAppSelector, useAppDispatch } from "@/utils/hooks";
import axiosInstance from "../services/axiosInstance";
import { connectSocket } from "../services/socket";
import { addConnection } from "../utils/slices/connectionSlice";
import type { LastSeenResponse, Message, MessagesResponse } from "@/types/message";
import type { ApiResponse } from "@/types/api";
import type { User } from "@/types/user";
import { MessageDeliveredPayload } from "@/types/socket";

const useChat = (targetUserId: string | undefined) => {
  const dispatch = useAppDispatch();

  const currentUser = useAppSelector((store) => store.user);

  const connections = useAppSelector((store) => store.connection);

  const targetUser = connections.find((user) => user._id === targetUserId);

  const [messages, setMessages] = useState<Message[]>([]);

  const [message, setMessage] = useState("");

  const [isTyping, setIsTyping] = useState(false);

  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isOnline, setIsOnline] = useState(false);

  // realtime lastSeen only
  const [socketLastSeen, setSocketLastSeen] = useState<string | Date | null>(null);

  const [cursor, setCursor] = useState<string | null>(null);

  const [hasMore, setHasMore] = useState(true);

  // FINAL lastSeen (derived safely)
  const lastSeen = socketLastSeen || targetUser?.lastSeen || null;

  // Load connections if missing
  useEffect(() => {
    const fetchConnections = async () => {
      if (connections.length > 0) return;

      const res = await axiosInstance.get<ApiResponse<User[]>>("/user/connections");

      dispatch(addConnection(res.data.data));
    };

    fetchConnections();
  }, [connections, dispatch]);

  // Load latest messages
  useEffect(() => {
    if (!targetUserId) return;

    const fetchMessages = async () => {
      const res = await axiosInstance.get<MessagesResponse>(`/messages/${targetUserId}?limit=10`);

      setMessages(res.data.data);
      setCursor(res.data.nextCursor);

      setHasMore(!!res.data.nextCursor);
    };

    fetchMessages();
  }, [targetUserId]);

  // Socket connection
  useEffect(() => {
    if (!targetUserId) return;

    const socket = connectSocket();

    const requestPresence = () => {
      socket.emit("get_online_users");
    };

    const joinRoomAndSync = () => {
      socket.emit("join_room", { targetUserId });
      requestPresence();
    };

    const handleReceive = (msg: Message) => {
      setMessages((prev) => {
        const exists = prev.some((m) => m._id === msg._id);
        if (exists) return prev;
        return [...prev, msg];
      });
    };

    const handleMessagesSeen = ({ seenBy }: { seenBy: string }) => {
      if (seenBy !== targetUserId) return;

      setMessages((prev) => {
        return prev.map((msg) => {
          if (msg.senderId === currentUser?._id) {
            return {
              ...msg,
              seen: true,
              seenAt: new Date(),
            };
          }
          return msg;
        });
      });
    };

    const handleMessageDelivered = ({
      messageId,
    }: MessageDeliveredPayload) => {
      console.log("DELIVERED EVENT RECEIVED:", messageId);

      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId
            ? { ...msg, delivered: true }
            : msg,
        ),
      );
    };

    const handleBulkDelivered = ({ deliveredTo }: { deliveredTo: string }) => {
      if (deliveredTo !== targetUserId) return;

      setMessages((prev) =>
        prev.map((msg) =>
          msg.senderId.toString() === currentUser?._id?.toString()
            ? { ...msg, delivered: true }
            : msg,
        ),
      );
    };

    // Attach listeners FIRST
    socket.on("receive_message", handleReceive);
    socket.on("messages_seen", handleMessagesSeen);
    socket.on("message_delivered", handleMessageDelivered);
    socket.on("message_delivered_bulk", handleBulkDelivered);

    const handleUserTyping = () => {
      setIsTyping(true);
    };

    const handleUserStopTyping = () => {
      setIsTyping(false);
    };

    const handleOnlineUsers = (users: string[]) => {
      setIsOnline(users.includes(targetUserId));
    };

    const handleUserOnline = ({ userId }: { userId: string }) => {
      if (userId === targetUserId) {
        setIsOnline(true);
      }
    };

    const handleUserOffline = ({
      userId,
      lastSeen,
    }: {
      userId: string;
      lastSeen: string;
    }) => {
      if (userId === targetUserId) {
        setIsOnline(false);
        setSocketLastSeen(lastSeen);
      }
    };

    socket.on("user_typing", handleUserTyping);
    socket.on("user_stop_typing", handleUserStopTyping);
    socket.on("online_users", handleOnlineUsers);
    socket.on("user_online", handleUserOnline);
    socket.on("user_offline", handleUserOnline);

    // If socket just connected
    socket.on("connect", joinRoomAndSync);

    // If socket is ALREADY connected
    if (socket.connected) {      
      joinRoomAndSync();
    }

    return () => {
      socket.off("connect", joinRoomAndSync);
      socket.off("receive_message", handleReceive);
      socket.off("user_typing", handleUserTyping);
      socket.off("user_stop_typing", handleUserStopTyping);
      socket.off("online_users", handleOnlineUsers);
      socket.off("user_online", handleUserOnline);
      socket.off("user_offline", handleUserOffline);
      socket.off("messages_seen", handleMessagesSeen);
      socket.off("message_delivered", handleMessageDelivered);
      socket.off("message_delivered_bulk", handleBulkDelivered);
    };
  }, [targetUserId, currentUser?._id]);

  //fallback lastseen fetch
  useEffect(() => {
    if (!targetUserId) return;

    // If user is offline and no realtime lastSeen yet
    if (!isOnline && !socketLastSeen) {
      const fetchLastSeen = async () => {
        try {
          const res = await axiosInstance.get<LastSeenResponse>(
            `/user/last-seen/${targetUserId}`,
          );
          setSocketLastSeen(res.data.lastSeen);
        } catch {
          console.error("Last seen fetch failed");
        }
      };

      fetchLastSeen();
    }
  }, [targetUserId, isOnline, socketLastSeen]);

  const handleTyping = (value: string) => {
    setMessage(value);

    if (!targetUserId) return;

    const socket = connectSocket();

    socket.emit("typing", { targetUserId });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop_typing", {
        targetUserId,
      });
    }, 1000);
  };

  const sendMessage = () => {
    if (!message.trim() || !targetUserId) return;

    const socket = connectSocket();

    socket.emit("send_message", {
      targetUserId,
      text: message,
    });

    socket.emit("stop_typing", { targetUserId });

    setMessage("");
  };

  const loadOlderMessages = async () => {
    if (!cursor) return;

    const res = await axiosInstance.get<MessagesResponse>(
      `/messages/${targetUserId}?limit=10&cursor=${cursor}`,
    );

    setMessages((prev = []) => {
      const combined = [...res.data.data, ...prev];

      const unique = Array.from(
        new Map(combined.map((m) => [m._id, m])).values(),
      );

      return unique;
    });

    setCursor(res.data.nextCursor);

    setHasMore(!!res.data.nextCursor);
  };

  return {
    currentUser,
    targetUser,
    messages,
    message,
    setMessage: handleTyping,
    sendMessage,
    isTyping,
    isOnline,
    lastSeen,
    loadOlderMessages,
    hasMore,
  };
};

export default useChat;
