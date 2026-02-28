import { useParams, useNavigate } from "react-router-dom";
import { connectSocket, disconnectSocket } from "../services/socket";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Chat = () => {
  const { targetUserId } = useParams();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();

  const currentUser = useSelector((store) => store.user);
  const connections = useSelector((store) => store.connection);

  const targetUser = connections?.find((user) => user._id === targetUserId);

  useEffect(() => {
    const socket = connectSocket();

    const handleConnect = () => {
      console.log("Connected: ", socket.id);

      socket.emit("join_room", {
        targetUserId,
      });
    };

    const handleReceiveMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("connect", handleConnect);
    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("receive_message", handleReceiveMessage);
      disconnectSocket();
    };
  }, [targetUserId]);

  const handleSend = () => {
    if (!message.trim()) return;

    const socket = connectSocket();

    socket.emit("send_message", {
      targetUserId,
      text: message,
    });

    setMessage("");
  };

  return (
    <div className="min-h-screen bg-base-200 flex justify-center items-start py-6">
      <div className="w-full max-w-3xl h-[80vh] bg-base-100 shadow-xl rounded-xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="navbar bg-base-100 border-b px-4">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}>
            ← Back
          </button>

          <div className="ml-4 font-semibold flex items-center gap-3">
            {targetUser?.photoURL && (
              <img src={targetUser.photoURL} className="w-8 h-8 rounded-full" />
            )}

            <span>
              {targetUser
                ? `${targetUser.firstName} ${targetUser.lastName}`
                : "Chat"}
            </span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => {
            const isMe = msg.senderId === currentUser?._id;

            return (
              <div
                key={index}
                className={`chat ${isMe ? "chat-end" : "chat-start"}`}
              >
                {!isMe && (
                  <div className="chat-image avatar">
                    <div className="w-8 rounded-full">
                      <img src={targetUser?.photoURL} />
                    </div>
                  </div>
                )}
                <div className="chat-bubble chat-bubble-primary">
                  {msg.text}
                </div>
              </div>
            );
          })}
        </div>

        {/* Input */}
        <div className="border-t p-3 flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type message..."
            className="input input-bordered flex-1"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />

          <button onClick={handleSend} className="btn btn-primary">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
