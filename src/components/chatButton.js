import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { fetchUser } from "../redux/slices/users/userSlice";
import User from "./user";

const ChatButton = ({ newConversation, toggleChat, isChatOpen, onlineUsers }) => {
  const dispatch = useDispatch();
  const [backup, setBackup] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/v1/user/allUsers`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const sortedUsers = res.data.sort((a, b) =>
          a?.firstname.toLowerCase().localeCompare(b?.firstname.toLowerCase())
        );
        dispatch(fetchUser(sortedUsers));
        setBackup(sortedUsers);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    getUsers();
  }, [dispatch]);

  const { users } = useSelector((state) => state.users);

  const searchHandler = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearch(searchTerm);
    const filteredUsers = users.filter(
      (user) =>
        user?.firstname.toLowerCase().includes(searchTerm) ||
        user?.lastname.toLowerCase().includes(searchTerm)
    );
    setBackup(filteredUsers);
  };

  const handleClose = () => {
    toggleChat();
    setSearch("");
    setBackup(users);
  };

  return (
    <>
      <FloatingActionButton onClick={toggleChat}>
        <i className="fa fa-plus" />
      </FloatingActionButton>
      {isChatOpen && (
        <ChatModal className="px-4 py-2">
          <div className="flex items-center justify-between p-2">
            <h5 className="header-title">New Chat</h5>
            <button className="text-Accent text-2xl" onClick={handleClose}>
              <i className="fa fa-times" />
            </button>
          </div>
          <div>
            <input
              type="text"
              placeholder="Search"
              onChange={searchHandler}
              className="w-full border-2 border-Accent outline-none p-2 rounded-md"
            />
          </div>
          <div className="p-2 overflow-y-auto h-4/5">
            {loading ? (
              <p>Loading...</p>
            ) : backup.length ? (
              backup.map((user) => (
                <div key={user?._id} onClick={() => newConversation(user)}>
                  <User userInfor={user} onlineUsers={onlineUsers} />
                </div>
              ))
            ) : (
              <p>No users found</p>
            )}
          </div>
        </ChatModal>
      )}
    </>
  );
};

const FloatingActionButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  background-color: #02ac9f;
  color: #fff;
  border: none;
  border-radius: 50%;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
`;

const ChatModal = styled.div`
  position: fixed;
  bottom: 100px;
  right: 20px;
  width: 400px;
  height: 600px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.25);
  z-index: 9999;
`;

export default ChatButton;
