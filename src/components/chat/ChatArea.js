import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Message from "./Message";
import MessageInput from "./MessageInput";
import GetUserInfo from "../../utils/getUserInfo";
import ChatHeader from "./ChatHeader";
import { fetchMessages } from "../../redux/slices/chat/chatSlice";
import {
  useGetMessagesQuery,
  useSendMessageMutation,
} from "../../redux/services/chat/chat-api";

const ChatArea = ({ data, onBackClick }) => {
  const messagesEndRef = useRef(null);
  const userInfo = GetUserInfo(data);
  const [message, setMessage] = useState("");
  const dispacth = useDispatch();

  const { user } = useSelector((state) => state.user);
  const { messages } = useSelector((state) => state.chats);

  const {
    data: messageData,
    error,
    isLoading,
  } = useGetMessagesQuery(data.conversation?._id);
  const [sendMessage, { isSending }] = useSendMessageMutation();

  useEffect(() => {
    if (messageData) {
      dispacth(fetchMessages(messageData));
    }
  }, [messageData]);

  // Scroll to the bottom of the message list whenever new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // handle sending message
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim() === "") return;

    try {
      const res = await sendMessage({
        text: message,
        sender: user?.id,
        conversationId: data.conversation?._id,
      });
      setMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Fixed Chat Header */}
      <div className="sticky">
        <ChatHeader userInfo={userInfo} onBackClick={onBackClick} />
      </div>
      <div className="flex-1 overflow-y-auto p-4 bg-white">
        {messages.map((message, index) => (
          <Message key={index} data={message} />
        ))}
        {/* Dummy div to help scroll to the bottom */}
        <div ref={messagesEndRef} />
      </div>
      <div className="sticky bottom-0 bg-white">
        <MessageInput
          handleSubmit={handleSubmit}
          message={message}
          setMessage={setMessage}
          isSending={isSending}
        />
      </div>
    </div>
  );
};

export default ChatArea;
