import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetAllUsersQuery } from "../../redux/services/users/users-apis";
import { fetchUsers } from "../../redux/slices/users/userSlice";
import {
  useCreateConversationMutation,
  useGetConversationQuery,
} from "../../redux/services/chat/chat-api";

function NewConversation({ onClose, onSelect }) {
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.users);
  const { user } = useSelector((state) => state.user);

  const { data, error, isLoading } = useGetAllUsersQuery();
  const { data: conversationsData } = useGetConversationQuery(user?.id);
  const { conversations } = conversationsData || {};

  useEffect(() => {
    if (data) {
      dispatch(fetchUsers(data));
    }
  }, [data, dispatch]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredUsers = users
    .filter((u) => u?._id !== user?.id)
    .filter((u) => {
      const fullName = `${u?.firstname?.toLowerCase()} ${u?.lastname?.toLowerCase()}`;
      return fullName.includes(searchQuery);
    })
    .filter((u) => {
      if (user?.role === "user") {
        return u?.role === "therapist"; // User can only see therapists
      } else if (user?.role === "therapist") {
        return u?.role === "user"; // Therapist can only see users
      } else if (user?.role === "admin") {
        return true; // Admin can see everyone
      }
      return false;
    });

  const [createConversation] = useCreateConversationMutation();

  const handleStartConversation = async (selectedUser) => {
    const existingConversation = conversations?.find((conversation) =>
      conversation.conversation.members.some(
        (member) => member?._id === selectedUser?._id
      ) &&
      conversation.conversation.members.some(
        (member) => member?._id === user?.id
      )
    );

    if (!existingConversation) {
      const res = await createConversation({
        senderId: user?.id,
        receiverId: selectedUser?._id,
      });
      const conversation = {
        conversation: {
          _id: res.data.conversation?._id,
          members: [
            {
              _id: selectedUser?._id,
              firstname: selectedUser?.firstname,
              lastname: selectedUser?.lastname,
              profileImage: selectedUser?.profileImage,
            },
            {
              _id: user?.id,
              firstname: user?.firstname,
              lastname: user?.lastname,
              profileImage: user?.profileImage,
            },
          ],
        },
      };
      onSelect(conversation);
    } else {
      onSelect(existingConversation);
    }
    onClose();
  };

  filteredUsers.sort((a, b) => a?.firstname.localeCompare(b?.firstname));

  if (isLoading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Error loading users. Please try again later.</div>;
  }

  return (
    <div>
      <div className="flex flex-row items-center gap-2 justify-start mb-1">
        <button
          className="text-primary hover:text-black"
          onClick={onClose}
          aria-label="Go back"
        >
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        <h1 className="text-sm font-semibold">New Conversation</h1>
      </div>

      <div className="mb-3">
        <input
          type="text"
          placeholder="Search users"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e)}
          className="w-full border rounded-md p-1 outline-none"
        />
      </div>

      <div className="overflow-y-auto h-full">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user?._id}
              className="flex flex-row items-center p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleStartConversation(user)}
            >
              <div className="flex flex-row items-center gap-2 ">
                <img
                  src={
                    user.profileImage
                      ? user.profileImage
                      : `https://ui-avatars.com/api/?name=${user?.firstname || "User"}+${user?.lastname || "Name"}`
                  }
                  alt={user?.firstname}
                  width={35}
                  height={35}
                  className="rounded-full"
                />
                <div className="ml-3">
                  <div className="font-semibold text-sm">
                    {user?.firstname} {user?.lastname}
                  </div>
                  {user?.role === "therapist" && (
                    <div className="text-xs text-gray-500">Therapist</div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">
            {searchQuery.trim() ? "No users match your search." : "No users available to chat."}
          </p>
        )}
      </div>
    </div>
  );
}

export default NewConversation;