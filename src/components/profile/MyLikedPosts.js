import axios from "axios";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import formattingDate from "../../utils/dateFormator";
import img1 from "../../assets/images/profile.png";
import ReactionModal from "../../components/reactionModal";
import { fetchLikedPosts, selectingPost } from "../../redux/slices/post/post";
import { useNavigate } from "react-router-dom";

const MyLikedPosts = () => {
  const { likedPosts } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.user);
  const handleShowReaction = () => setShowReaction(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLiking, setIsLiking] = useState(false);
  const [isLikingId, setIsLikingId] = useState(null);
  const [showReaction, setShowReaction] = useState(false);

  const [isFetching, setIsFetching] = useState(false);

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
          url: `${process.env.REACT_APP_BACKEND_URL}/v1/post/my-like-posts`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        axios(config).then((res) => {
          dispatch(fetchLikedPosts(res.data.posts));
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
    if (!likedPosts.length) {
      setIsFetching(true);
    }
    const token = localStorage.getItem("token");
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BACKEND_URL}/v1/post/my-like-posts`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios(config)
      .then((res) => {
        dispatch(fetchLikedPosts(res.data.posts));
        setIsFetching(false);
      })
      .catch((err) => { });
  }, [dispatch, likedPosts.length]);

  return (
    <>
      <ReactionModal
        showReaction={showReaction}
        handleCloseReaction={handleCloseReaction}
        users={users}
      />
      <div>
        {isFetching && (
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
        {likedPosts &&
          likedPosts.map((post, index) => (
            <div className="blog" Key={index}>
              <div className="flex gap-2 justify-between items-center w-11/12">
                <div className="flex gap-2">
                  <img
                    src={post.user.profileImage ? post.user.profileImage : img1}
                    alt="profile image"
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex flex-col ">
                    <span>
                      {" "}
                      <b>
                        {post.user?.firstname} {post.user?.lastname}
                      </b>{" "}
                      <span className="small"> {post.user.address}</span>
                    </span>
                    <span className="small">
                      @{post.user.username} .{formattingDate(post.postedDate)}
                    </span>
                  </div>
                </div>
                <span>
                  <i
                    className="fa fa-ellipsis-v w-5 h-5"
                    aria-hidden="true"
                  ></i>
                </span>
              </div>
              <div className="content" onClick={() => selectPost(post)}>
                <p className="context">{post.content}</p>
                {post.image && <img src={post.image} alt="post" />}
              </div>
              <div className="likes">
                {post.likes.length > 0 && (
                  <>
                    {post.likes[post.likes.length - 1].user?._id === user?.id ? (
                      <span
                        onClick={() => {
                          setUsers(post.likes);
                          handleShowReaction();
                        }}
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

export default MyLikedPosts;
