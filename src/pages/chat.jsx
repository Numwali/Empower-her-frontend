import React, { useEffect, useState } from "react";
import Sidebar from "../components/chat/Sidebar";
import ChatArea from "../components/chat/ChatArea";
import { useSelector, useDispatch } from "react-redux";
import { fetchConversations } from "../redux/slices/chat/chatSlice";
import {
  useGetConversationQuery,
} from "../redux/services/chat/chat-api";
import { setSelectedTherapist } from "../redux/slices/users/userSlice";

function Chat() {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true); // state for sidebar visibility

  const { conversations } = useSelector((state) => state.chats);
  const { user } = useSelector((state) => state.user);
  const { selectedTherapist } = useSelector((state) => state.users);
  const dispatch = useDispatch();

  const { data, error, isLoading } = useGetConversationQuery(user?.id);

  useEffect(() => {
    if (data) {
      dispatch(fetchConversations(data.conversations));
    }
    if (selectedTherapist !== null) {
      setSelectedConversation(selectedTherapist);
      setIsSidebarVisible(false);
    }
  }, [data, selectedTherapist]);

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    setIsSidebarVisible(false); // Hide sidebar on phone view
    dispatch(setSelectedTherapist(null));
  };

  const handleBackClick = () => {
    setIsSidebarVisible(true); // Show sidebar when back button is clicked
  };


  return (
    <div className="flex w-full bg-white h-[94vh] p-2 md:h-[85vh]">
      {/* Sidebar */}
      <div
        className={`w-full h-full bg-gray-100 p-4 overflow-y-auto ${isSidebarVisible ? "block" : "hidden"
          } md:block md:w-2/6`}
      >
        <Sidebar
          onSelectConversation={handleSelectConversation}
          data={conversations}
        />
      </div>

      {/* Chat Area */}
      {selectedConversation ? (
        <div
          className={`flex-1  flex-col h-full ${!isSidebarVisible ? "flex" : "hidden"
            } md:flex justify-between md:w-4/6`}
        >
          {/* Chat Messages and Input */}
          <ChatArea data={selectedConversation} onBackClick={handleBackClick} />
        </div>
      ) : (
        <div className="flex-1 hidden justify-center items-center text-gray-400 md:flex">
          Select a conversation to start chatting
        </div>
      )}
    </div>
  );
}

export default Chat;
