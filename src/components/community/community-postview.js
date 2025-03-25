import { useContext, useEffect, useState } from "react";
import { MdDeleteForever, MdOutlineUpdateDisabled } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import img1 from "../../assets/images/profile.png";
import {
  useDeleteCommunityPostMutation,
  useGetCommunityPostsQuery,
} from "../../redux/services/community/community-api.js";
import { fetchCommunityPosts } from "../../redux/slices/community/community.js";

import { Popover } from "antd";
import { toast } from "react-toastify";
import { selectingPost } from "../../redux/slices/post/post.js";
import SocketContext from "../../utils/SocketContext.js";
import formattingDate from "../../utils/dateFormator.js";
import { loggedInUser } from "../../utils/handlers.js";
import CommentCard from "../commentCard.js";
import CreateCommunityPostModel from "./create-community-post.jsx";

import {
  useCommentOnAPostMutation,
  useLikePostMutation,
} from "../../redux/services/post/post-api.js";

export default function CommunityPostView() {
  const dispatch = useDispatch();
  let { communityId } = useParams();
  const socket = useContext(SocketContext);

  // Get data stored in states
  const { user } = useSelector((state) => state.user);
  const { selectedPost } = useSelector((state) => state.posts);
  const post = selectedPost;

  const [show, setShow] = useState(false);
  const [showReaction, setShowReaction] = useState(false);
  const [comment, setComment] = useState("");
  const [users, setUsers] = useState([]);
  const [popoverOpen, setPopoverOpen] = useState({});

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleShowReaction = () => setShowReaction(true);

  // Redux query fetch Community posts
  const { data: communityPosts } = useGetCommunityPostsQuery(communityId);

  // Redux mutation -like a community post,  delete a community post
  const [deleteCommunityPost] = useDeleteCommunityPostMutation();
  const [likePost, { isLoading: isLiking }] = useLikePostMutation();
  const [commentOnAPost, { isLoading: isCommenting }] =
    useCommentOnAPostMutation();

  // Store fetched data in state
  useEffect(() => {
    if (communityPosts) {
      dispatch(fetchCommunityPosts(communityPosts));
    }
  }, [communityPosts, dispatch]);

  const like = async (id) => {
    try {
      const likedPost = await likePost(id).unwrap();
      dispatch(selectingPost(likedPost.post));
      localStorage.setItem("selectedPost", JSON.stringify(likedPost.post));
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong.");
    }
  };

  const commentPost = async () => {
    const reqObj = { id: post?._id, comment };

    try {
      const commentedPost = await commentOnAPost(reqObj).unwrap();
      setComment("");
      dispatch(selectingPost(commentedPost.post));
      if (socket) {
        socket.emit("sendCommentNotification", {
          userId: user?.id,
          contentId: post?._id,
        });
      }
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong.");
    }
  };

  const handlePopoverOpen = (postId) => {
    setPopoverOpen((prevState) => ({
      ...prevState,
      [postId]: true,
    }));
  };

  const handlePopoverClose = (postId) => {
    setPopoverOpen((prevState) => ({
      ...prevState,
      [postId]: false,
    }));
  };

  const handleDeleteCommunityPost = async (postId) => {
    try {
      const { post, message } = await deleteCommunityPost(postId).unwrap();
      (message && toast.success(`${message}`)) ||
        (post && toast.success(`${post.name} deleted`));
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong.");
    }
  };

  const handleUpdateCommunity = (postId) => {
    // Update logic
  };

  const handleShareSCommunityPost = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard.");
  };

  const loggedUser = JSON.parse(loggedInUser());

  return (
    <>
      <div className="w-full rounded-md px-1 tablet:px-8 laptop:px-12 desktop:px-20">
        <CreateCommunityPostModel show={show} handleClose={handleClose} />

        <section>
          <div className="">

            {post && (
              <div className="bg-white w-full rounded-lg my-4">
                <div className="flex flex-row items-center justify-between">
                  <div className="flex flex-row items-center gap-2 p-3">
                    <img
                      src={
                        post?.user?.profileImage
                          ? post?.user?.profileImage
                          : img1
                      }
                      alt="profile image"
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex flex-col">
                      <span>
                        {" "}
                        <b className="text-[14px] text-black">
                          {post?.user?.firstname} {post?.user?.lastname}
                        </b>{" "}
                        <span className="text-[11px] text-gray-600/80">
                          {" "}
                          {post?.user?.address !== "default"
                            ? post?.user?.address
                            : "Rwanda"}
                        </span>
                      </span>
                      <span className="text-[11px] text-gray-600/80">
                        @
                        {post?.user?.username !== "default"
                          ? post?.user?.username
                          : post?.user?.lastname}{" "}
                        .{formattingDate(post.postedDate)}
                      </span>
                    </div>
                  </div>

                  {
                    <Popover
                      content={
                        <div className="text-gray-600 flex flex-col gap-2">
                          {loggedUser?.id === post.user?._id && (
                            <div className="flex flex-col gap-2 ">
                              <button
                                onClick={() =>
                                  handleDeleteCommunityPost(post?._id)
                                }
                                className="bg-gray-300 hover:bg-Accent duration-300 p-2 rounded-md text-gray-600 flex flex-row items-center gap-2"
                              >
                                <MdDeleteForever />
                                Delete
                              </button>
                              <button
                                onClick={() => handleUpdateCommunity(post?._id)}
                                className="bg-gray-300 hover:bg-Accent duration-300 p-2 rounded-md text-gray-600 flex flex-row items-center gap-2"
                              >
                                <MdOutlineUpdateDisabled />
                                Update
                              </button>
                            </div>
                          )}
                          <button
                            onClick={() => handleShareSCommunityPost()}
                            className="bg-gray-300 hover:bg-Accent duration-300 p-2 rounded-md text-gray-600 flex flex-row items-center gap-2"
                          >
                            <MdOutlineUpdateDisabled />
                            Share
                          </button>
                        </div>
                      }
                      title="Options"
                      trigger="click"
                      visible={popoverOpen[post?._id]}
                      onVisibleChange={(visible) =>
                        visible
                          ? handlePopoverOpen(post?._id)
                          : handlePopoverClose(post?._id)
                      }
                    >
                      <button className="text-gray-600 px-[16px] py-[8px] border-none rounded-[4px] font-medium cursor-pointer text-sm antialiased">
                        <i className="fa-solid fa-ellipsis"></i>
                      </button>
                    </Popover>
                  }
                </div>

                <div className="">
                  <p className="text-[14px] antialiased px-3 pb-2">
                    {post.content}
                  </p>
                  {post.image && <img src={post.image} alt="post image" />}
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
                      {post.likes[post.likes.length - 1].user?._id ===
                        user?.id ? (
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
                  <span style={{ cursor: "pointer" }} className="text-[15px]">
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
                    <span
                      style={{ cursor: "pointer" }}
                      onClick={() => like(post?._id)}
                    >
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
                <div className="px-3 py-2">
                  <h4 className="text-sm font-semibold mt-4">Comments</h4>
                  {post.comments.map((comment, index) => (
                    <CommentCard key={index} commentContainer={comment} />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <br></br>
            <div className="w-full flex flex-row items-center phone:gap-1 phone:p-1 gap-2 p-2 bg-white shadow-sm rounded-lg">
              <img
                src={user.profileImage ? user.profileImage : img1}
                alt=""
                className="w-10 h-10 rounded-full"
              />{" "}
              <textarea
                placeholder="Add a comment..."
                onChange={(e) => setComment(e.target.value)}
                value={comment}
                className="flex-1 border-none outline-none text-[15px] h-10 phone:h-8 focus:h-auto bg-gray-100 px-3 py-2 rounded-xl"
              >
                {comment}
              </textarea>
              {!isCommenting ? (
                <button
                  onClick={commentPost}
                  className="bg-Accent text-white rounded text-base py-2 px-3 text-center"
                >
                  Send
                </button>
              ) : (
                <button
                  disabled
                  className="bg-Accent text-white rounded text-base py-2 px-3 text-center"
                >
                  <i className="fa fa-spinner fa-spin"></i>
                </button>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
