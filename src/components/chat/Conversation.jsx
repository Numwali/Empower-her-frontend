import avatar from "../../assets/images/profile.png";
import formattingDate from "../../utils/dateFormator";
import GetUserInfo from "../../utils/getUserInfo";

const Conversation = ({ data, onSelect }) => {
  const userInfo = GetUserInfo(data);

  return (
    <div
      className="flex flex-row justify-between mb-3 mt-2 cursor-pointer"
      onClick={() => onSelect(data)}
    >
      <div className="flex flex-row">
        <img
          src={
            userInfo && userInfo?.profileImage ? userInfo?.profileImage : avatar
          }
          alt={userInfo?.firstname}
          width={35}
          height={35}
          className="rounded-full"
        />
        <div className="ml-3">
          <div className="font-semibold text-sm">
            {userInfo?.firstname}{" "}
            {userInfo && userInfo?.lastname.charAt(0).toUpperCase()}.
          </div>
          <div className="text-xs text-gray-500">
            {data?.lastMessage && data?.lastMessage?.sender != userInfo?._id ? (
              <>You: {data?.lastMessage?.text}</>
            ) : (
              <>{data?.lastMessage?.text}</>
            )}
          </div>
        </div>
      </div>
      <div className="text-[10px]">
        {data?.lastMessage && formattingDate(data?.lastMessage?.createdAt)}
      </div>
    </div>
  );
};
export default Conversation;
