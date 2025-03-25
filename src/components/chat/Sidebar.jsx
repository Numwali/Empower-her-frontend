import React, { useState } from "react";
import Conversation from "./Conversation";
import NewConversation from "./NewConversation";
import { useSelector } from "react-redux";

function Sidebar({ onSelectConversation, data }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewConversation, setShowNewConversation] = useState(false);
  const { user } = useSelector((state) => state.user);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredConversations = data.filter((item) => {
    const participantName = item.conversation.members
      .map((p) => p?.firstname.toLowerCase() + " " + p?.lastname.toLowerCase())
      .join(" ");

    // Role-based filtering
    if (user?.role === "therapist") {
      // Therapist sees only users
      return (
        participantName.includes(searchQuery) &&
        item.conversation.members.some((m) => m?._id !== user?.id && m?.role === "user")
      );
    } else if (user?.role === "admin") {
      // Admin sees everyone
      return participantName.includes(searchQuery);
    } else if (user?.role === "user") {
      // User sees only therapists
      return (
        participantName.includes(searchQuery) &&
        item.conversation.members.some((m) => m?._id !== user?.id && m?.role === "therapist")
      );
    }
    return false;
  });

  const handleAddNewConversation = () => {
    setShowNewConversation(true);
  };

  return (
    <div>
      {showNewConversation ? (
        <NewConversation
          onClose={() => setShowNewConversation(false)}
          onSelect={onSelectConversation}
        />
      ) : (
        <>
          <div className="flex flex-row items-center justify-between mb-1">
            <h1 className="text-lg font-semibold"> Chats</h1>
            <button
              className="bg-primary text-white rounded-full py-1 px-2"
              onClick={handleAddNewConversation}
            >
              <i className="fa fa-plus-circle" aria-hidden="true"></i>
            </button>
          </div>

          <div className="mb-3">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full border rounded-md p-1 outline-none"
            />
          </div>

          {user?.role === "user" && (
            <p className="text-Accent font-semibold text-xs">
              Chat with therapists or start a new conversation.
            </p>
          )}

          {user?.role === "therapist" && (
            <p className="text-Accent font-semibold text-xs">
              Chat with users or start a new conversation.
            </p>
          )}

          {filteredConversations.length > 0 ? (
            filteredConversations.map((item) => (
              <Conversation
                key={item.conversation?._id}
                data={item}
                onSelect={onSelectConversation}
              />
            ))
          ) : (
            <p className="text-gray-500">No conversations found.</p>
          )}
        </>
      )}
    </div>
  );
}

export default Sidebar;