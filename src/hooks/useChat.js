import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import axiosInstance from "../services/axiosInstance";
import { connectSocket } from "../services/socket";
import { addConnection } from "../utils/slices/connectionSlice";

const useChat = (targetUserId) => {
  const dispatch = useDispatch();

  const currentUser = useSelector((store) => store.user);

  const connections = useSelector((store) => store.connection);

  const targetUser = connections?.find((user) => user._id === targetUserId);

  const [messages, setMessages] = useState([]);

  const [message, setMessage] = useState("");

  const [isTyping, setIsTyping] = useState(false);

  const typingTimeoutRef = useRef(null);

  const [isOnline, setIsOnline] = useState(false);

  // realtime lastSeen only
  const [socketLastSeen, setSocketLastSeen] = useState(null);

  const [cursor, setCursor] = useState(null);

  const [hasMore, setHasMore] = useState(true);

  // FINAL lastSeen (derived safely)
  const lastSeen = socketLastSeen || targetUser?.lastSeen || null;

  // Load connections if missing
  useEffect(() => {
    const fetchConnections = async () => {
      if (connections && connections.length > 0) return;

      const res = await axiosInstance.get("/user/connections");

      dispatch(addConnection(res.data.data));
    };

    fetchConnections();
  }, [connections, dispatch]);

  // Load latest messages
  useEffect(() => {
    if (!targetUserId) return;

    const fetchMessages = async () => {
      const res = await axiosInstance.get(`/messages/${targetUserId}?limit=10`);

      setMessages(res.data.data || []);
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

    const handleReceive = (msg) => {
      setMessages((prev = []) => {
        const exists = prev.some((m) => m._id === msg._id);
        if (exists) return prev;
        return [...prev, msg];
      });
    };

    const handleMessagesSeen = ({ seenBy }) => {
      if (seenBy !== targetUserId) return;

      setMessages((prev = []) => {
        return prev.map((msg) => {
          if (msg.senderId === currentUser._id) {
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

    const handleMessageDelivered = ({ messageId }) => {
      console.log("DELIVERED EVENT RECEIVED:", messageId);
      setMessages((prev = []) =>
        prev.map((msg) =>
          msg._id.toString() === messageId.toString()
            ? { ...msg, delivered: true }
            : msg,
        ),
      );
    };

    const handleBulkDelivered = ({ deliveredTo }) => {
      if (deliveredTo !== targetUserId) return;

      setMessages((prev = []) =>
        prev.map((msg) =>
          msg.senderId.toString() === currentUser._id.toString()
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

    socket.on("user_typing", () => {
      setIsTyping(true);
    });

    socket.on("user_stop_typing", () => {
      setIsTyping(false);
    });

    socket.on("online_users", (users) => {
      setIsOnline(users.includes(targetUserId));
    });

    socket.on("user_online", ({ userId }) => {
      if (userId === targetUserId) {
        setIsOnline(true);
      }
    });

    socket.on("user_offline", ({ userId, lastSeen }) => {
      if (userId === targetUserId) {
        setIsOnline(false);
        setSocketLastSeen(lastSeen);
      }
    });

    // If socket just connected
    socket.on("connect", joinRoomAndSync);

    // If socket is ALREADY connected
    if (socket.connected) {
      joinRoomAndSync();
    }

    return () => {
      socket.off("connect", joinRoomAndSync);
      socket.off("receive_message", handleReceive);
      socket.off("user_typing");
      socket.off("user_stop_typing");
      socket.off("online_users");
      socket.off("user_online");
      socket.off("user_offline");
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
          const res = await axiosInstance.get(
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

  const handleTyping = (value) => {
    setMessage(value);

    const socket = connectSocket();

    socket.emit("typing", { targetUserId });

    clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop_typing", {
        targetUserId,
      });
    }, 1000);
  };

  const sendMessage = () => {
    if (!message.trim()) return;

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

    const res = await axiosInstance.get(
      `/messages/${targetUserId}?limit=10&cursor=${cursor}`,
    );

    setMessages((prev = []) => {
      const combined = [...(res.data.data || []), ...prev];

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
