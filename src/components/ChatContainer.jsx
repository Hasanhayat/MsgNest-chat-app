import React, { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import moment from "moment";
import { getAuth } from "firebase/auth";

const ChatContainer = () => {
  const {
    messages,
    isMessagesLoading,
    getMessages,
    selectedUser,
  } = useChatStore();

  const auth = getAuth(); // Firebase Auth se current user lana
  const messagesEndRef = useRef(null); // Scroll reference

  // ✅ Scroll to bottom function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // ✅ Jab selectedUser ya messages update hon to neeche scroll karo
  useEffect(() => {
    if (selectedUser) {
      const unsubscribe = getMessages(selectedUser.id);
      return () => unsubscribe();
    }
  }, [selectedUser, getMessages]);

  useEffect(() => {
    scrollToBottom(); // Messages update hone par neeche scroll
  }, [messages]);

  // ✅ Message ka time format karna
  function formatMessageTime(timestamp) {
    if (!timestamp) return "Just Now";

    let date;

    // Firestore timestamp ko handle karo
    if (typeof timestamp === "object" && timestamp.seconds) {
      date = moment.unix(timestamp.seconds);
    }
    // Agar milliseconds me hai to use karo
    else if (typeof timestamp === "number") {
      date = moment(timestamp);
    } else {
      return "Just Now";
    }

    // Aaj ki date ho to "Today 2:34 PM"
    if (moment().isSame(date, "day")) {
      return `Today ${date.format("h:mm A")}`;
    }

    // Kal ki date ho to "Yesterday 2:34 PM"
    if (moment().subtract(1, "day").isSame(date, "day")) {
      return `Yesterday ${date.format("h:mm A")}`;
    }

    return date.format("D MMM YYYY, h:mm A");
  }

  if (isMessagesLoading) return <MessageSkeleton />;

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      {/* Chat Header */}
      <ChatHeader />

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`chat ${
              message.senderId === auth.currentUser.uid
                ? "chat-end"
                : "chat-start"
            }`}
          >
            {/* User Avatar */}
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === selectedUser.id
                      ? selectedUser.profilePic || "/avatar.png"
                      : "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>

            {/* Message Info */}
            <div className="chat-header mb-1 flex items-center gap-1">
              {message.senderId === auth.currentUser.uid && (
                <span className="text-xs font-semibold text-green-400">You</span>
              )}
              <time className="text-xs opacity-50">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>

            {/* Message Bubble */}
            <div
              className={`chat-bubble flex flex-col ${
                message.senderId === auth.currentUser.uid
                  ? "bg-base-300"
                  : "bg-base-200"
              }`}
            >
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
        {/* ✅ Scroll anchor for auto-scroll */}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
