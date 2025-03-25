import axios from "axios";
import React, { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import img1 from "../assets/images/profile.png";
import { fetchPosts, selectingPost } from "../redux/slices/post/post";
import SocketContext from "../utils/SocketContext.js";
import formattingDate from "../utils/dateFormator";

const Post = ({ post, setUsers, setShowReaction }) => {
  const socket = useContext(SocketContext);
  const [isLiking, setIsLiking] = useState(false);
  const handleShowReaction = () => setShowReaction(true);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const dispatch = useDispatch();

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
        let config = {
          method: "get",
          maxBodyLength: Infinity,
          url: `${process.env.REACT_APP_BACKEND_URL}/v1/post`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        axios(config).then((res) => {
          dispatch(fetchPosts(res.data.posts));
          setIsLiking(false);
          if (socket) {
            socket.emit("sendLikeNotification", {
              userId: user?.id,
              contentId: id,
            });
          }
        });
      })
      .catch((err) => {
        console.log(err);
        setIsLiking(false);
      });
  };

  const selectPost = (post) => {
    dispatch(selectingPost(post));
    navigate("/resource");
    localStorage.setItem("selectedPost", JSON.stringify(post));
  };

  return (
    <div className="bg-white w-full rounded-lg my-4 ">
      <div className="flex flex-row items-center gap-2 p-3">
        <img
          src={post?.user?.profileImage ? post?.user?.profileImage : img1}
          alt="profile image"
          className="w-10 h-10 rounded-full"
        />
        <div className="flex flex-col">
          <span>
            {" "}
            <b className="text-[14px] ">
              {post?.user?.firstname} {post?.user?.lastname} <span className="text-Secondary font-black">[{post?.user?.role}]</span>
            </b>{" "}
            <span className="text-[11px] text-gray-600/80">
              {" "}
              {post?.user?.address !== "default"
                ? post?.user?.address
                : "N/A"}
            </span>
          </span>
          <span className="text-[11px] text-gray-600 font-bold">
            @
            {post?.user?.username !== "default"
              ? post?.user?.username
              : post?.user?.lastname}{" "}
            . {formattingDate(post.postedDate)}
          </span>
        </div>
      </div>
      <div className="cursor-pointer" onClick={() => selectPost(post)}>
        <p className="text-[14px] antialiased px-3 pb-2">{post.content}</p>
        {post.image && (
          <img src={post.image} alt="post image" className="w-full" />
        )}
        {post.video && (
          <video
            width="100%"
            style={{
              objectFit: "cover",
            }}
            controls
          >
            <source src={post.video} type="video/mp4" />
          </video>
        )}
      </div>
      <div className="my-1 px-3">
        {post.likes.length > 0 && (
          <>
            {post.likes[post.likes.length - 1].user?._id === user?.id ? (
              <span
                onClick={() => {
                  setUsers(post.likes);
                  handleShowReaction();
                }}
                className="text-[13px] text-gray-600"
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
                className="text-[13px] text-gray-600"
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
      <hr className="mx-3 opacity-10 my-1" />
      <div className="px-3 flex flex-row items-center gap-3">
        <span
          onClick={() => selectPost(post)}
          style={{ cursor: "pointer" }}
          className="text-[15px]"
        >
          {" "}
          <i className="fa-regular fa-comment primary-color"></i>{" "}
          <span className="text-[13px] text-gray-600">
            {post.comments.length}
          </span>
        </span>

        {isLiking ? (
          <span>
            <i className="fa fa-spinner fa-spin"></i>
          </span>
        ) : (
          <span style={{ cursor: "pointer" }} onClick={() => like(post?._id)}>
            {post.likes.some((like) => like.user?._id === user?.id) ? (
              <i
                className="fa-solid fa-heart"
                style={{ color: " #ae041e" }}
              ></i>
            ) : (
              <i className="fa-regular fa-heart text-gray-600"></i>
            )}{" "}
            <span className="text-[13px] text-gray-600">
              {" "}
              {post.likes.length}
            </span>
          </span>
        )}
        <span className="text-gray-600">
          <i className="fa-solid fa-arrow-up-from-bracket"></i>
        </span>
      </div>
    </div>
  );
};

export default Post;
