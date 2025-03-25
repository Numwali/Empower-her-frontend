import React, { useEffect, useState } from "react";
import img1 from "../assets/images/profile.png";
import formattingDate from "../utils/dateFormator";
import { useSelector } from "react-redux";

const ChatUser = ({ data, currentUser }) => {
  const { onlineUsers } = useSelector((state) => state.users);
  const userInfo = data.conversation.members.find(
    (m) => m?._id !== currentuser?.id
  );

  return (
    <>
      <div className="chatUser">
        <div className="img">
          <img
            src={
              userInfo && userInfo.profileImage ? userInfo.profileImage : img1
            }
            alt="user avatar"
            className="w-[52px] rounded-[50%] border-2 border-Accent"
          />
          {onlineUsers.some((u) => u.userId === userInfo ??._id) && (
            <div className="online">
              <div className="onlineIcon"></div>
            </div>
          )}
        </div>
        <div className="textChat">
          <div className="nameTime">
            <span>
              {userInfo && userInfo?.firstname}{" "}
              {userInfo && userInfo?.lastname.charAt(0).toUpperCase()}.{" "}
            </span>
            {data?.lastMessage && (
              <span className="time">
                {formattingDate(data?.lastMessage?.createdAt)}
              </span>
            )}
          </div>
          {data?.lastMessage && data?.lastMessage?.sender === currentuser?.id ? (
            <p className="lat-message">You: {data?.lastMessage?.text}</p>
          ) : (
            <p className="lat-message">{data?.lastMessage?.text}</p>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatUser;
