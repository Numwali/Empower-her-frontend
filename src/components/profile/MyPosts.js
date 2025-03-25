import axios from "axios";
import { useState, useEffect, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import formattingDate from "../../utils/dateFormator";
import img1 from "../../assets/images/profile.png";
import ReactionModal from "../../components/reactionModal";
import { fetchUserPosts, selectingPost, selectingPostToEdit } from "../../redux/slices/post/post";
import { useNavigate } from "react-router-dom";
import { Menu, Transition } from "@headlessui/react";
import { toast } from "react-toastify";
import EditPostModel from "../editPostModal";
import { useDeletePostMutation, useMyPostsQuery } from "../../redux/services/post/post-api";

const MyPosts = () => {
  const { userPosts, selectedPost, selectedPostToEdit } = useSelector((state) => state.posts);
  const { data: myPostsData, isLoading: isMyPostLoading } = useMyPostsQuery();
  const [deletePost, { isLoading }] = useDeletePostMutation();

  const { user } = useSelector((state) => state.user);
  const [showEdit, setShowEdit] = useState(false);

  const handleEditModel = () => setShowEdit(!showEdit);
  const handleShowReaction = () => setShowReaction(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLiking, setIsLiking] = useState(false);
  const [isLikingId, setIsLikingId] = useState(null);
  const [showReaction, setShowReaction] = useState(false);

  const [users, setUsers] = useState([]);

  const handleCloseReaction = () => setShowReaction(false);

  const like = (id) => {
    setIsLiking(true);
    setIsLikingId(id);
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
          url: `${process.env.REACT_APP_BACKEND_URL}/v1/post/my-posts`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        axios(config).then((res) => {
          dispatch(fetchUserPosts(res.data.posts));
          setIsLiking(false);
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

  useEffect(() => {
    if (myPostsData) {
      dispatch(fetchUserPosts(myPostsData.posts));
    }
  }, [dispatch, myPostsData]);

  const handleDelete = async (postId) => {
    try {
      const { post, message } = await deletePost(postId).unwrap();
      if (message) {
        toast.success(`Resource Deleted`);
      } else if (post) {
        toast.success(`${post.name} deleted`);
      }
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong.");
    }
  };

  const setPost = (post) => {
    dispatch(selectingPostToEdit(post));
  };

  return (
    <>
      <ReactionModal
        showReaction={showReaction}
        handleCloseReaction={handleCloseReaction}
        users={users}
      />
      <EditPostModel selectedPost={selectedPost} show={showEdit} handleClose={handleEditModel} />
      <div>
        {isMyPostLoading && (
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

        {userPosts &&
          userPosts.map((post, index) => (
            <div className="blog" Key={index}>
              <div className="flex gap-2 justify-between items-center w-11/12">
                <div className="flex gap-2">
                  <img
                    src={
                      post?.user?.profileImage
                        ? post?.user?.profileImage
                        : img1
                    }
                    alt="profile image"
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex flex-col">
                    <span>
                      {" "}
                      <b className="text-[14px] text-black font-bold">
                        {post?.user ? `${post.user.firstname} ${post.user.lastname}` : "Unknown User"}
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

                <span className="mr-10">
                  <Menu
                    as="div"
                    className="relative inline-block text-left"
                  >
                    <div>
                      <Menu.Button
                        className="inline-flex justify-center w-full px-4 py-2 rounded-md "
                        onClick={() => setPost(post)}
                      >
                        <i
                          onClick={() => setPost(post)}
                          className="fa fa-ellipsis-v w-5 h-5 text-black"
                          aria-hidden="true"
                        ></i>
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="-top-2 transform -translate-y-full absolute right-0 w-56 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="px-1 py-1 ">
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={
                                  () => {
                                    setPost(post)
                                    setShowEdit(true)
                                  }
                                }
                                className={`
                    text-black group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                              >
                                {active ? (
                                  <EditActiveIcon
                                    className="w-5 h-5 mr-2"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <EditInactiveIcon
                                    className="w-5 h-5 mr-2"
                                    aria-hidden="true"
                                  />
                                )}
                                Edit
                              </button>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={() => handleDelete(post?._id)}
                                className={`${"text-black"} group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                              >
                                {active ? (
                                  <DeleteActiveIcon
                                    className="w-5 h-5 mr-2 "
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <DeleteActiveIcon
                                    className="w-5 h-5 mr-2"
                                    aria-hidden="true"
                                  />
                                )}
                                {
                                  isLoading ? <i className="fa fa-spinner fa-spin"></i> : "Delete"
                                }

                              </button>
                            )}
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </span>
              </div>
              <div
                className="content"
                onClick={() => selectPost(post)}
              >
                <p className="context">{post?.content}</p>
                {post?.image && <img src={post?.image} alt="post" />}
              </div>

              <div className="likes">
                {post?.likes?.length > 0 && (
                  <>
                    {post?.likes[post?.likes?.length - 1].user?._id ===
                      user?.id ? (
                      <span
                        onClick={() => {
                          setUsers(post?.likes);
                          handleShowReaction();
                        }}
                      >
                        You{" "}
                        {post?.likes.length - 1 > 0
                          ? `and ${post.likes.length - 1} ${post.likes.length - 1 > 1
                            ? "others"
                            : "other"
                          } liked this`
                          : "liked this"}
                      </span>
                    ) : (
                      <span
                        onClick={() => {
                          setUsers(post.likes);
                          handleShowReaction();
                        }}
                      >
                          {post.likes.length > 0 && post.likes[post.likes.length - 1].user
                            ? `${post.likes[post.likes.length - 1].user.firstname} ${post.likes[post.likes.length - 1].user.lastname}`
                            : "Unknown User"
                          }
                        {post.likes.length - 1 > 0
                          ? `and ${post.likes.length - 1} ${post.likes.length - 1 > 1
                            ? "others"
                            : "other"
                          } liked this`
                          : " liked this"}
                      </span>
                    )}
                  </>
                )}
              </div>

              <div className="footer">
                <span
                  onClick={() => selectPost(post)}
                  style={{ cursor: "pointer" }}
                >
                  {" "}
                  <i className="fa-regular fa-comment primary-color"></i>{" "}
                  {post.comments.length}
                </span>

                {isLiking && isLikingId === post?._id ? (
                  <span>
                    <i className="fa fa-spinner fa-spin"></i>
                  </span>
                ) : (
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => like(post?._id)}
                  >
                    {post.likes.some(
                      (like) => like.user?._id === user?.id
                    ) ? (
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
                <span>
                  <i className="fa-solid fa-arrow-up-from-bracket"></i>
                </span>
              </div>
            </div>
          ))}

      </div>
    </>
  );
};

function EditInactiveIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 13V16H7L16 7L13 4L4 13Z"
        fill="#EDE9FE"
        stroke="#A78BFA"
        strokeWidth="2"
      />
    </svg>
  );
}

function EditActiveIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 13V16H7L16 7L13 4L4 13Z"
        fill="#8B5CF6"
        stroke="#C4B5FD"
        strokeWidth="2"
      />
    </svg>
  );
}


function DeleteActiveIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="5"
        y="6"
        width="10"
        height="10"
        fill="#8B5CF6"
        stroke="#C4B5FD"
        strokeWidth="2"
      />
      <path d="M3 6H17" stroke="#C4B5FD" strokeWidth="2" />
      <path d="M8 6V4H12V6" stroke="#C4B5FD" strokeWidth="2" />
    </svg>
  );
}

export default MyPosts;
