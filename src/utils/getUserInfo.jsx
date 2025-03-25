import { useSelector } from "react-redux";

const GetUserInfo = (data) => {
  const { user } = useSelector((state) => state.user);
  const userInfo = data.conversation.members.find((m) => m?._id !== user?.id);
  return { ...userInfo, role: user?.role };
};
export default GetUserInfo;