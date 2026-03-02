import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import axiosInstance from "../services/axiosInstance";
import { connectSocket, disconnectSocket } from "../services/socket";
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

    const handleConnect = () => {
      socket.emit("join_room", { targetUserId });
    };

    const handleReceive = (msg) => {
      setMessages((prev) => {
        const exists = prev.some((m) => m._id === msg._id);

        if (exists) return prev;

        return [...prev, msg];
      });
    };

    socket.on("connect", handleConnect);

    socket.on("receive_message", handleReceive);

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
      if (userId === targetUserId) setIsOnline(true);
    });

    socket.on("user_offline", ({ userId, lastSeen }) => {
      if (userId === targetUserId) {
        setIsOnline(false);

        setSocketLastSeen(lastSeen);
      }
    });

    return () => {
      socket.off("connect", handleConnect);

      socket.off("receive_message", handleReceive);

      socket.off("user_typing");

      socket.off("user_stop_typing");

      socket.off("online_users");

      socket.off("user_online");

      socket.off("user_offline");

      disconnectSocket();
    };
  }, [targetUserId]);

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

    setMessages((prev) => {
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
