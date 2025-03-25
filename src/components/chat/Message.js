import { useSelector, useDispatch } from "react-redux";
import { formattingMessageDate } from "../../utils/dateFormator";

const Message = ({ data }) => {
  const { user } = useSelector((state) => state.user);

  return (
    <div
      className={`flex flex-row ${data.sender != user?.id ? "justify-start" : "justify-end"
        } mb-2`}
    >
      <div
        className={`${data.sender != user?.id
          ? "bg-gray-300 text-gray-500 rounded-tr-3xl"
          : "bg-primary text-white rounded-tl-3xl"
          }  py-2 px-2  rounded-bl-3xl rounded-br-3xl`}
      >
        <span>{data.text}</span>
        <div className="text-[9px] text-right pl-6">{
          formattingMessageDate(data.createdAt)}</div>
      </div>
    </div>
  );
};
export default Message;
