import img1 from "../assets/images/profile.png";
import formattingDate from "../utils/dateFormator";

const CommentCard = ({ commentContainer }) => {
  const { user, comment } = commentContainer;

  return (
    <div className="shadow-sm rounded-md border-opacity-10 my-1 p-3">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-2">
          <img
            src={user.profileImage ? user.profileImage : img1}
            alt=""
            className="w-6 h-6 rounded-full"
          />
          <span className="text-[13px] font-semibold">
            {user?.firstname} {user?.lastname}
          </span>
          <span className="text-[10px] text-gray-600 font-light flex flex-row items-center gap-1">
            <i className="fa fa-clock-o" aria-hidden="true"></i>
            {formattingDate(commentContainer.postedDate)}
          </span>
        </div>
        {/* {loggedUser} */}
        <button className="bg-white text-gray-600/70 border-none font-medium cursor-pointer text-sm antialiased">
          <i className="fa-solid fa-ellipsis"></i>
        </button>
      </div>

      <div className="my-2">
        <p className="text-[14px] font-normal">{comment}</p>
      </div>

    </div>
  );
};

export default CommentCard;
