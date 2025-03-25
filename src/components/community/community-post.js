import { useContext, useEffect, useState } from "react";
import { MdDeleteForever, MdOutlineUpdateDisabled } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import img1 from "../../assets/images/profile.png";
import {
  useDeleteCommunityPostMutation,
  useGetCommunityPostsQuery,
} from "../../redux/services/community/community-api";
import { fetchCommunityPosts } from "../../redux/slices/community/community";

import { Popover } from "antd";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { selectingPost } from "../../redux/slices/post/post";
import SocketContext from "../../utils/SocketContext.js";
import formattingDate from "../../utils/dateFormator";
import { loggedInUser } from "../../utils/handlers.js";
import { useLikePostMutation } from "../../redux/services/post/post-api.js";

export default function CommunityPost({ post, setUsers, setShowReaction }) {
  const dispatch = useDispatch();
  let { communityId } = useParams();
  const navigate = useNavigate();
  const socket = useContext(SocketContext);

  // Get data stored in states
  const { user } = useSelector((state) => state.user);
  const { posts } = useSelector((state) => state.communities);

  // Redux query fetch all community post
  const { data: communityPosts, isFetching } =
    useGetCommunityPostsQuery(communityId);

  // Redux mutation -like a community post,  delete a community
  const [deleteCommunityPost] = useDeleteCommunityPostMutation();
  const [likePost, { isLoading: isLiking }] = useLikePostMutation();

  // Store fetched data in state
  useEffect(() => {
    if (communityPosts) {
      dispatch(fetchCommunityPosts(communityPosts));
    }
  }, [communityPosts, dispatch]);

  const handleShowReaction = () => setShowReaction(true);

  const like = async (id) => {
    try {
      await likePost(id).unwrap();
      if (socket) {
        socket.emit("sendLikeNotification", {
          userId: user?.id,
          contentId: id,
        });
      }
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong.");
    }
  };

  const selectPost = (post) => {
    dispatch(selectingPost(post));
    navigate(`/community/${communityId}/post`);
    localStorage.setItem("selectedPost", JSON.stringify(post));
  };
  const [popoverOpen, setPopoverOpen] = useState({});

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
      <div className="w-full rounded-md px-3 tablet:px-8 laptop:px-12 desktop:px-20">
        <div className="">
          {posts?.posts?.length === 0 && isFetching && (
            <div className="blog">
              <div className="article-skeleton ">
                <div className="title-skeleton"></div>
                <div className="image-skeleton"></div>
                <div className="text-skeleton"></div>
              </div>
              <div className="article-skeleton ">
                <div className="title-skeleton"></div>
                <div className="image-skeleton"></div>
                <div className="text-skeleton"></div>
              </div>
            </div>
          )}

          <div className="bg-white dark:!bg-dark-primary w-full rounded-lg my-4">
            <div className="flex flex-row justify-between items-center">
              <div className="flex flex-row items-center gap-2 p-3">
                <img
                  src={
                    post?.user?.profileImage ? post?.user?.profileImage : img1
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
                    <span className="text-[11px] text-gray-600/80 dark:text-dark-gray-300">
                      {" "}
                      {post?.user?.address !== "default"
                        ? post?.user?.address
                        : "Rwanda"}
                    </span>
                  </span>
                  <span className="text-[11px] text-gray-600/80 dark:text-dark-gray-300/80">
                    @
                    {post?.user?.username !== "default"
                      ? post?.user?.username
                      : post?.user?.lastname}{" "}
                    .{formattingDate(post?.postedDate)}
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
                            onClick={() => handleDeleteCommunityPost(post?._id)}
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
            <div className="content" onClick={() => selectPost(post)}>
              <p className="text-[14px] antialiased px-3 pb-2 text-gray-600">
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
                  {post.likes[post.likes.length - 1].user?._id === user?.id ? (
                    <span
                      onClick={() => {
                        setUsers(post.likes);
                        handleShowReaction();
                      }}
                      className="text-[13px] text-gray-600 dark:text-dark-gray-300"
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
                      className="text-[13px] text-gray-600 dark:text-dark-gray-300"
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
            <hr className="mx-3 opacity-10 my-1 dark:text-dark-gray-300" />
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
                <span className="dark:text-dark-gray-300">
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
          </div>
        </div>
      </div>
    </>
  );
}
