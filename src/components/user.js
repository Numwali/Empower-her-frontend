import React, { useEffect, useState } from "react";
import img1 from "../assets/images/profile.png";
import { useSelector } from "react-redux";

const User = ({ userInfor }) => {
  const { onlineUsers } = useSelector((state) => state.users);
  const { user } = useSelector((state) => state.user);
  return (
    <>
      <div className="flex p-[6px] w-full flex-row cursor-pointer">
        <div className="w-[15%] flex  mr-[1rem]">
          <img
            src={userInfor.profileImage ? userInfor.profileImage : img1}
            alt="user avatar"
            className="w-[52px] rounded-[50%] border-2 border-Accent"
          />
          {onlineUsers.some((u) => u.userId === userInfor?._id) && (
            <div className="w-[15px] h-[15px] bg-white rounded-[50px] p-[5px] -ml-[8px] mt-[30px] z-10">
              <div className="rounded-[50px] -ml-[4px] -mt-[4px] w-[12px] h-[12px] bg-[#21c634]"></div>
            </div>
          )}
        </div>
        <div className="w-[85%] flex pl-[10px] flex-col content-between text-gray-600">
          <div className="w-full flex text-center self-center content-between">
            {userInfor?._id === user?.id ? (
              <span className="first:text-left first:text-[16px] font-bold text-end text-[11px]">
                You
              </span>
            ) : (
              <span className="first:text-left first:text-[16px] font-bold text-end text-[11px]">
                {userInfor?.firstname} {userInfor?.lastname}
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default User;
