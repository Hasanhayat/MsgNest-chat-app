import React, { useEffect } from 'react';
import { useChatStore } from '../store/useChatStore';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageSkeleton from './skeletons/MessageSkeleton';

const ChatContainer = () => {
  const { messages, isMessagesLoading, getMessages, selectedUser , setSelectedUser  } = useChatStore();

  useEffect(() => {
    if (selectedUser ) {
      const unsubscribe = getMessages(selectedUser.id); // Pass the selected user's ID
      return () => unsubscribe(); // Cleanup the listener on unmount
    }
  }, [selectedUser , getMessages]);

  if (isMessagesLoading) return <MessageSkeleton />;

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className='flex-1 overflow-y-auto p-4 space-y-4'>
        {
          messages.map((message) => (
            <div key={message.id} className={`chat ${message.senderId === selectedUser .id ? "chat-end" : "chat-start"}`}>
              <div className='chat-image avatar'>
                <div className="size-10 rounded-full border">
                  <img src={message.senderId === selectedUser .id ? selectedUser .profilePic || "/avatar.png" : "/avatar.png"} alt="profile pic" />
                </div>
              </div>

              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">
                  {new Date(message.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}
                </time>
              </div>

              <div className="chat-bubble flex flex-col">
                {message.image && <img src={message.image} alt='Attachment' className='sm:max-w-[200px] rounded-md mb-2' />}
                {message.text && <p>{message.text}</p>}
              </div>
            </div>
          ))
        }
      </div>

      <MessageInput />
    </div>
  )
}

export default ChatContainer;