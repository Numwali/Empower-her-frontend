import avatar from "../../assets/images/profile.png";
import formattingDate from "../../utils/dateFormator";

const ChatHeader = ({ userInfo, onBackClick }) => {
  
  return (
    <div className="flex flex-row px-3 py-2 justify-between items-center border-b mt-2">
      <div className="flex flex-row ">
        <button
          onClick={onBackClick}
          className="text-black pr-3 md:hidden"
        >
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        <img
          src={
            userInfo && userInfo.profileImage ? userInfo?.profileImage : avatar
          }
          alt={userInfo?.firstname}
          width={35}
          height={35}
          className="rounded-full"
        />
        <div className="pl-2">
          <div className="font-semibold text-sm">
            {userInfo?.firstname + " "} {userInfo?.lastname}
          </div>
          <div className="text-xs text-gray-500">
            last seen: {userInfo?.lastSeen && formattingDate(userInfo?.lastSeen)}
          </div>
        </div>
      </div>
      <i className="fa-solid fa-circle-info"></i>
    </div>
  );
};

export default ChatHeader;
