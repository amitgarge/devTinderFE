import { useParams, useNavigate } from "react-router-dom";
import useChat from "../hooks/useChat";
import { useEffect, useRef } from "react";

const Chat = () => {
  const containerRef = useRef(null);
  const bottomRef = useRef(null);
  const loadingOlderRef = useRef(false);
  const prevScrollHeightRef = useRef(0);

  const { targetUserId } = useParams();

  const navigate = useNavigate();

  const {
    currentUser,
    targetUser,
    messages,
    message,
    setMessage,
    sendMessage,
    isTyping,
    isOnline,
    lastSeen,
    loadOlderMessages,
    hasMore,
  } = useChat(targetUserId);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    // CASE 1: loading older messages → preserve position
    if (loadingOlderRef.current) {
      const newScrollHeight = container.scrollHeight;

      const prevHeight = prevScrollHeightRef.current;

      container.scrollTop = newScrollHeight - prevHeight;

      loadingOlderRef.current = false;
    }

    // CASE 2: new realtime message → scroll bottom
    else {
      bottomRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div className="min-h-screen bg-base-200 flex justify-center py-6">
      <div className="w-full max-w-3xl h-[80vh] bg-base-100 shadow-xl rounded-xl flex flex-col">
        {/* Header */}
        <div className="navbar border-b">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}>
            ← Back
          </button>

          <div className="ml-4 flex items-center gap-3">
            {targetUser?.photoURL && (
              <img src={targetUser.photoURL} className="w-8 h-8 rounded-full" />
            )}

            <div className="flex flex-col">
              <span className="font-semibold">
                {targetUser
                  ? `${targetUser.firstName} ${targetUser.lastName}`
                  : "Loading..."}
              </span>

              <span className="text-xs flex items-center gap-2">
                {isTyping ? (
                  "Typing..."
                ) : isOnline ? (
                  <>
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Online
                  </>
                ) : lastSeen ? (
                  `Last seen ${new Date(lastSeen).toLocaleString()}`
                ) : null}
              </span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div
          ref={containerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          {/* Load older button */}
          {hasMore && (
            <div className="text-center">
              <button
                onClick={() => {
                  const container = containerRef.current;

                  loadingOlderRef.current = true;

                  prevScrollHeightRef.current = container.scrollHeight;

                  loadOlderMessages();
                }}
                className="btn btn-sm btn-outline"
              >
                Load older messages
              </button>
            </div>
          )}

          {messages.map((msg) => {
            const isMe = msg.senderId === currentUser?._id;

            return (
              <div
                key={msg._id}
                className={`chat ${isMe ? "chat-end" : "chat-start"}`}
              >
                {!isMe && (
                  <div className="chat-image avatar">
                    <div className="w-8 rounded-full">
                      <img src={targetUser?.photoURL} />
                    </div>
                  </div>
                )}

                <div className="chat-bubble">{msg.text}</div>
              </div>
            );
          })}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="border-t p-3 flex gap-2">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            className="input input-bordered flex-1"
          />

          <button onClick={sendMessage} className="btn btn-primary">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
