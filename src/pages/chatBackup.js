import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import img1 from "../assets/images/profile.png";
import ChatButton from "../components/chatButton.js";
import ChatUser from "../components/chatUser.js";
import { fetchConversations } from "../redux/slices/chat/chatSlice.js";
import SocketContext from "../utils/SocketContext.js";
import formattingDate, {
  areSameDay,
  formattingMessageDate,
  formattingMessageGroupDate,
} from "../utils/dateFormator.js";

import {
  setOnlineUsers,
  setSelectedTherapist,
} from "../redux/slices/users/userSlice.js";

const Chat = () => {
  const socket = useContext(SocketContext);
  const { onlineUsers, selectedTherapist } = useSelector(
    (state) => state.users
  );

  const [show, setShow] = useState(true);

  const [collapse, setCollapse] = useState(false);
  const [collapseChat, setCollapseChat] = useState(false);

  const [width, setWidth] = useState(window.innerWidth);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const { user } = useSelector((state) => state.user);
  const scrollRef = useRef();
  const dispacth = useDispatch();

  const { conversations } = useSelector((state) => state.conversations);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const Chaton = () => {
    setCollapse(!collapse);
    const chatChat = document.querySelector(".chatChat");
    const recentChat = document.querySelector(".recentChat");

    if (recentChat && chatChat && width && width < 820) {
      if (!collapse) {
        chatChat.style.display = "none";
        recentChat.style.display = "none";
      } else {
        chatChat.style.display = "none";
        recentChat.style.display = "block";
      }
    }
  };

  const getSize = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    getSize();

    const chatChat = document.querySelector(".chatChat");
    const recentChat = document.querySelector(".recentChat");
    const timeoutId = setTimeout(() => {
      if (width) {
        if (width > 820) {
          setCollapse(true);
        }

        if (chatChat && width < 820 && collapse) {
          chatChat.style.display = "none";
        }

        if (collapse && width < 820) {
          setCollapseChat(true);
        }

        if (chatChat && recentChat && width > 820) {
          chatChat.style.display = "block";
          recentChat.style.display = "block";
        }
      }
    }, 1000); // Timeout set to 1 second (1000 milliseconds)

    // Clear the timeout to prevent any unexpected behavior if the component unmounts
    return () => clearTimeout(timeoutId);
  }, []);

  const showProfile = () => {
    if (show) {
      document.querySelector(".chatChat").style.width = "70%";
      document.querySelector(".profileChat").style.display = "flex";
    } else {
      document.querySelector(".chatChat").style.width = "100%";
      document.querySelector(".profileChat").style.display = "none";
    }
    setShow(!show);
  };

  useEffect(() => {
    if (socket) {
      socket.on("getMessage", (data) => {
        setArrivalMessage({
          sender: data.senderId,
          text: data.text,
          createdAt: Date.now(),
        });
      });
    }
  }, [socket]);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.some(
        (member) => member?._id.toString() === arrivalMessage.sender
      ) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    if (socket) {
      socket.emit("addUser", user?.id);
      socket.on("getUsers", (users) => {
        const filterdUsers = users.filter((u) => u.userId !== user?.id);
        dispacth(setOnlineUsers(filterdUsers));
      });
    }
  }, [socket]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/v1/conversations/${user?.id}`
        );
        dispacth(fetchConversations(res?.data?.conversations));
        if (selectedTherapist) selectChat(selectedTherapist);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [arrivalMessage, messages]);

  const selectChat = (c) => {
    setCurrentChat(c.conversation);
    setSelectedUser(c.conversation.members.find((m) => m?._id !== user?.id));
  };

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/v1/messages/${currentChat?._id}`
        );
        setMessages(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getMessages();
  }, [currentChat]);

  const handleSubmit = async (e) => {
    if (!newMessage) return false;
    setIsSending(true);
    e.preventDefault();
    const message = {
      sender: user?.id,
      text: newMessage,
      conversationId: currentChat?._id,
    };
    const receiverId = currentChat.members.find(
      (member) => member?._id !== user?.id
    )?._id;
    if (socket) {
      socket.emit("sendMessage", {
        senderId: user?.id,
        receiverId,
        text: newMessage,
      });
    }

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/v1/messages`,
        message
      );
      setMessages([...messages, res.data]);
      setNewMessage("");
      setIsSending(false);
    } catch (error) {
      setIsSending(false);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const newConversation = async (newUser) => {
    const existingConversation = userExistsInConversations(newUser);
    if (existingConversation) {
      setCurrentChat(existingConversation.conversation);
      setSelectedUser(newUser);
      toggleChat();
      return;
    }
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/v1/conversations`,
        {
          senderId: user?.id,
          receiverId: newUser?._id,
        }
      );
      const newConversation = {
        conversation: {
          _id: res.data.conversation?._id,
          members: [
            {
              _id: newUser?._id,
              firstname: newUser?.firstname,
              lastname: newUser?.lastname,
              profileImage: newUser?.profileImage,
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

      dispacth(fetchConversations([newConversation, ...conversations]));
      setSelectedUser(newUser);
      setCurrentChat(newConversation.conversation);
      toggleChat();
    } catch (error) {
      const res = error.response.data.conversation;
      const newConversation = {
        conversation: {
          _id: res?._id,
          members: [
            {
              _id: newUser?._id,
              firstname: newUser?.firstname,
              lastname: newUser?.lastname,
              profileImage: newUser?.profileImage,
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

      dispacth(fetchConversations([newConversation, ...conversations]));
      setSelectedUser(newUser);
      setCurrentChat(newConversation.conversation);
      toggleChat();
    }
  };

  const userExistsInConversations = (user) => {
    const conversation = conversations.find((conv) =>
      conv.conversation?.members.some((member) => member?._id === user?._id)
    );
    return conversation;
  };

  return (
    <>
      <div className="containerChat">
        <div className="containerChatTwo">
          <div className="recentChat">
            <div className="chat">
              {conversations.map((c) => (
                <div
                  onClick={() => {
                    selectChat(c);
                    Chaton();
                    dispacth(setSelectedTherapist(null));
                  }}
                  key={c?._id}
                >
                  <ChatUser data={c} currentUser={user} />
                </div>
              ))}
              {conversations.length === 0 && (
                <span className="noConversationText">
                  No conversation yet.{" "}
                  <span
                    onClick={() => {
                      toggleChat();
                      dispacth(setSelectedTherapist(null));
                    }}
                    className="start-chat"
                  >
                    Start a one.
                  </span>
                </span>
              )}
            </div>
            {/* <Button icon={"plus"} /> */}
            <ChatButton
              newConversation={newConversation}
              toggleChat={() => {
                toggleChat();
                dispacth(setSelectedTherapist(null));
              }}
              isChatOpen={isChatOpen}
              onlineUsers={onlineUsers}
            />
          </div>
          {!currentChat ? (
            <div className="chatChat">
              <div className="chat-container">
                <span className="noConversationText">
                  Open a conversation or{" "}
                  <span onClick={toggleChat} className="start-chat">
                    start new
                  </span>{" "}
                  to start a chat.
                </span>
              </div>
            </div>
          ) : (
            <>
              <div className="chatChat">
                <div className="chat-container">
                  <div className="chat-header">
                    <div className="chat-header-img">
                      <img
                        src={
                          selectedUser && selectedUser.profileImage
                            ? selectedUser.profileImage
                            : img1
                        }
                        alt="user avatar"
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="chat-header-name">
                        <h3>
                          {selectedUser && selectedUser?.firstname}{" "}
                          {selectedUser && selectedUser?.lastname}
                        </h3>
                        {onlineUsers.find(
                          (user) => user.userId === selectedUser?._id
                        ) ? (
                          <span>Online</span>
                        ) : (
                          <span>
                            {selectedUser?.lastSeen && (
                              <span>
                                last seen{" "}
                                {formattingDate(selectedUser?.lastSeen)}
                              </span>
                            )}
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="chat-header-icons-close">
                        <span onClick={() => Chaton()}>
                          <i className="fa-solid fa-circle-xmark"></i>
                        </span>
                      </div>
                      <div className="chat-header-icons">
                        <span onClick={() => showProfile()}>
                          <i className="fa-solid fa-circle-info"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* <div className="chat-messages">
                                {messages.map((m) => (
                                  <div
                                    ref={scrollRef}
                                    className="message-container"
                                  >
                                    <p
                                      key={m?._id}
                                      className={
                                        m.sender === user?.id
                                          ? "message-text"
                                          : "message-reply"
                                      }
                                    >
                                      {m.text}
                                      <p className="time">
                                        {formattingDate(m.createdAt)}
                                      </p>
                                    </p>
                                  </div>
                                ))}
                              </div> */}
                  <div className="chat-messages">
                    {messages.map((m, index) => (
                      <div
                        ref={scrollRef}
                        className="message-container"
                        key={m?._id}
                      >
                        {index === 0 ||
                          !areSameDay(
                            m.createdAt,
                            messages[index - 1].createdAt
                          ) ? (
                          <p className="group-date">
                            {formattingMessageGroupDate(m.createdAt)}
                          </p>
                        ) : null}
                        <p
                          className={
                            m.sender === user?.id
                              ? "message-text"
                              : "message-reply"
                          }
                        >
                          {m.text}
                          <p className="time">
                            {formattingMessageDate(m.createdAt)}
                          </p>
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="chat-input-container">
                    <input
                      type="text"
                      onChange={(e) => setNewMessage(e.target.value)}
                      value={newMessage}
                      placeholder="Type your message here..."
                    />
                    {isSending ? (
                      <button
                        disabled
                        className="bg-Accent text-white rounded text-2xl py-2 px-3 text-center"
                      >
                        <i className="fa fa-spinner fa-spin"></i>
                      </button>
                    ) : (
                      <button
                        onClick={handleSubmit}
                        className="bg-Accent text-white rounded text-2xl py-2 px-3 text-center"
                      >
                        <i className="fa fa-paper-plane"></i>
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="profileChat">
                <div className="partOne">
                  <div className="img">
                    <img
                      src={
                        selectedUser && selectedUser.profileImage
                          ? selectedUser.profileImage
                          : img1
                      }
                      alt="profile avatar"
                      className="w-12 h-12 rounded-full"
                    />
                    {onlineUsers.find(
                      (user) => user.userId === selectedUser?._id
                    ) && (
                        <div className="online">
                          <div className="onlineIcon"></div>
                        </div>
                      )}
                  </div>
                  <h5>
                    {selectedUser && selectedUser?.firstname}{" "}
                    {selectedUser && selectedUser?.lastname}
                  </h5>
                  <h6>{selectedUser && selectedUser.role}</h6>
                  <div className="line"></div>
                </div>
                <div className="partTwo">
                  <p>contact Details</p>
                  <div className="identification">
                    <div>
                      <span>
                        <i className="fa-solid fa-id-card"></i>
                      </span>
                    </div>
                    <div className="id">
                      <span>Phone</span>
                      <span>{selectedUser && selectedUser.phone}</span>
                    </div>
                  </div>
                  <div className="identification">
                    <div>
                      <span>
                        <i className="fa-solid fa-envelope"></i>
                      </span>
                    </div>
                    <div className="id">
                      <span>Email</span>
                      <span>{selectedUser && selectedUser.email}</span>
                    </div>
                  </div>
                  <div className="identification">
                    <div>
                      <span>
                        <i className="fa-solid fa-map-marker"></i>
                      </span>
                    </div>
                    <div className="id">
                      <span>Address</span>
                      <span>{selectedUser && selectedUser.address}</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Chat;
