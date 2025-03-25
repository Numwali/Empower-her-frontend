import axios from "axios";
import { useContext, useState } from "react";
import img1 from "../assets/images/profile.png";

import { useDispatch, useSelector } from "react-redux";
import CommentCard from "../components/commentCard";
import { selectingPost } from "../redux/slices/post/post";
import SocketContext from "../utils/SocketContext";
import formattingDate from "../utils/dateFormator";

const Post = () => {
  const socket = useContext(SocketContext);
  const [showReaction, setShowReaction] = useState(false);
  const [comment, setComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [users, setUsers] = useState([]);


  const handleShowReaction = () => setShowReaction(true);

  const [isLiking, setIsLiking] = useState(false);

  const { selectedPost } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const post = selectedPost;

  const like = (id) => {
    setIsLiking(true);
    const token = localStorage.getItem("token");
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BACKEND_URL}/v1/post/like/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios(config)
      .then((res) => {
        dispatch(selectingPost(res.data.post));
        setIsLiking(false);
        localStorage.setItem("selectedPost", JSON.stringify(res.data.post));
      })
      .catch((err) => {
        console.log(err);
        setIsLiking(false);
      });
  };

  const commentPost = () => {
    setIsCommenting(true);
    if (!comment) {
      setIsCommenting(false);
      return false;
    }
    const token = localStorage.getItem("token");
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BACKEND_URL}/v1/post/comment/${post?._id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        comment,
      },
    };

    axios(config)
      .then((res) => {
        setComment("");
        dispatch(selectingPost(res.data.post));
        setIsCommenting(false);
        if (socket) {
          socket.emit("sendCommentNotification", {
            userId: user?.id,
            contentId: post?._id,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <div className="w-full mt-3">
        {post && (
          <div className="">
            <div className="bg-white p-3 rounded-lg">
              <div className="flex flex-row">
                <img
                  src={post.user.profileImage ? post.user.profileImage : img1}
                  alt=""
                  width="50"
                  className="rounded-full"
                />

                <div className="flex flex-col ml-4">
                  <div>
                    <span className="text-base font-semibold ">
                      {post?.user?.firstname} {post?.user?.lastname} <span className="text-Secondary font-black">[{post?.user?.role}]</span>
                    </span>
                    <span className="text-sm text-gray-600/70"> {post.user.address}</span>
                  </div>
                  <span className="text-sm text-gray-600 font-bold">
                    @{post.user.username} . {formattingDate(post.postedDate)}
                  </span>
                </div>
              </div>
              <div className="mt-3">
                <p>{post.content}</p>
                {post.image && <img src={post.image} alt="post image" />}
                {post.video && (
                  <video width="100%" controls>
                    <source src={post.video} type="video/mp4" />
                  </video>
                )}
              </div>
              <div className="mt-4">
                {post.likes.length > 0 && (
                  <>
                    {post.likes[post.likes.length - 1].user?._id === user?.id ? (
                      <span
                        onClick={() => {
                          setUsers(post.likes);
                          handleShowReaction();
                        }}
                        className="text-Accent text-sm cursor-pointer"
                      >
                        You{" "}
                        {post.likes.length - 1 > 0
                          ? `and ${post.likes.length - 1} ${post.likes.length - 1 > 1 ? "others" : "other"
                          } liked this`
                          : "liked this"}
                      </span>
                    ) : (
                      <span
                        onClick={() => {
                          setUsers(post.likes);
                          handleShowReaction();
                        }}
                        className="text-Accent text-sm cursor-pointer"
                      >
                        {post.likes[post.likes.length - 1].user?.firstname}{" "}
                        {post.likes[post.likes.length - 1].user?.lastname}{" "}
                        {post.likes.length - 1 > 0
                          ? `and ${post.likes.length - 1} ${post.likes.length - 1 > 1 ? "others" : "other"
                          } liked this`
                          : " liked this"}
                      </span>
                    )}
                  </>
                )}
              </div>
              <div className="flex flex-row gap-3">
                <span className="cursor-pointer">
                  <i className="fa-regular fa-comment primary-color"></i>{" "}
                  {post.comments.length}
                </span>
                {isLiking ? (
                  <span>
                    <i className="fa fa-spinner fa-spin"></i>
                  </span>
                ) : (
                  <span
                    className="cursor-pointer"
                    onClick={() => like(post?._id)}
                  >
                    {post.likes.some((like) => like.user?._id === user?.id) ? (
                      <i
                        className="fa-solid fa-heart"
                        style={{ color: " #ae041e" }}
                      ></i>
                    ) : (
                      <i className="fa-regular fa-heart"></i>
                    )}{" "}
                    {post.likes.length}
                  </span>
                )}
                <span className="cursor-pointer">
                  <i className="fa-solid fa-arrow-up-from-bracket"></i>
                </span>
              </div>
              <br />
              <h4 className="text-lg font-semibold">Comments</h4>
              {post.comments.map((comment, index) => (
                <CommentCard key={index} commentContainer={comment} />
              ))}
            </div>
            <br></br>

            <div className="bg-white flex flex-row gap-1 p-1 justify-between items-center rounded-lg">
              <img
                src={user.profileImage ? user.profileImage : img1}
                alt="Profile Avatar"
                className="w-10 h-10 rounded-full"
              />
              <textarea
                placeholder="Add a comment..."
                onChange={(e) => setComment(e.target.value)}
                value={comment}
                className="w-full bg-gray-200 outline-none  rounded-lg  pt-3 pl-2"
              >
                {comment}
              </textarea>
              {!isCommenting ? (
                <button
                  onClick={commentPost}
                  className="bg-Accent text-white rounded text-lg py-2 px-3 text-center"
                >
                  Send
                </button>
              ) : (
                <button
                  disabled
                  className="bg-Accent text-white rounded text-lg py-2 px-3 text-center"
                >
                  <i className="fa fa-spinner fa-spin"></i>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Post;
