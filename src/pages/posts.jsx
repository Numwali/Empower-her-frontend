import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import img1 from "../assets/images/profile.png";
import Post from "../components/Post";
import CreatePostModel from "../components/createPostModal";
import ReactionModal from "../components/reactionModal";
import { fetchPosts } from "../redux/slices/post/post";
import { setOnlineUsers } from "../redux/slices/users/userSlice";
import SocketContext from "../utils/SocketContext";
import { PlusCircle } from "lucide-react"

const Posts = () => {
  const socket = useContext(SocketContext);
  const [show, setShow] = useState(false);
  const [showReaction, setShowReaction] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [limit, setLimit] = useState(10);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMorePosts, setHasMorePosts] = useState(true); // Track if there are more posts available

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleCloseReaction = () => setShowReaction(false);

  const { posts } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.user);


  const dispatch = useDispatch();

  const [users, setUsers] = useState([]);

  useEffect(() => {
    setIsFetching(true);
    const token = localStorage.getItem("token");
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_BACKEND_URL}/v1/post?limit=${limit}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios(config)
      .then((res) => {
        dispatch(fetchPosts(res.data.posts));
        if (res.data.currentPage === res.data.totalPages) {
          setHasMorePosts(false);
        }
        setIsFetching(false);
        setLoadingMore(false);
      })
      .catch((err) => { });
  }, [limit, dispatch]);

  useEffect(() => {
    if (socket) {
      socket.emit("addUser", user?.id);
      socket.on("getUsers", (users) => {
        const filterdUsers = users.filter((u) => u.userId !== user?.id);
        dispatch(setOnlineUsers(filterdUsers));
      });
    }
  }, [socket, dispatch, user?.id]);

  useEffect(() => {
    function handleScroll() {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const scrolledPercentage =
        (scrollTop / (documentHeight - windowHeight)) * 100;

      if (
        scrolledPercentage >= 90 &&
        !isFetching &&
        !loadingMore &&
        hasMorePosts // Check if there are more posts available
      ) {
        setLoadingMore(true);
        setLimit((prevLimit) => prevLimit + 10);
      }
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isFetching, loadingMore, hasMorePosts]);

  return (
    <>
      <CreatePostModel show={show} handleClose={handleClose} />
      <ReactionModal
        showReaction={showReaction}
        handleCloseReaction={handleCloseReaction}
        users={users}
      />

      <div className="w-full">
        {(user?.role === "therapist" || user?.role === "admin") &&
          <div className="bg-white w-full px-3 py-5 rounded-lg">
            <h2 className="text-base text-center font-black text-primary mb-3">Create a Resource</h2>
            <div className="flex md:flex-row flex-col items-center justify-center gap-2">
              <img
                src={user.profileImage ? user.profileImage : img1}
                alt=""
                className="w-10 h-10 rounded-full"
              />{" "}
              <span
                className="bg-gray-300 py-2 px-4 rounded-3xl text-gray-600 text-[12px] cursor-pointer"
                onClick={handleShow}
                title="Click to Share Resources"
              >
                Share Resources......
              </span>
              <button
                onClick={handleShow}
                className="flex flex-row items-center gap-1.5 bg-Accent hover:bg-Accent/90 text-white py-1.5 px-3 rounded-md text-xs font-medium transition-colors"
              >
                <PlusCircle size={16} />
                <span>Add a Resource</span>
              </button>
            </div>
            <hr className="opacity-10 my-3" />
          </div>
        }

        <h3 className="text-Secondary font-black text-center mt-4 bg-primary-foreground p-4">Meditation & Wellness Resources</h3>
        {posts.length === 0 && isFetching && (
          <div className="w-full px-2 pt-2">
            <div className="w-10/ flex flex-col mb-8 ">
              <div className="animate-pulse h-10 w-72 bg-gray-200 rounded mb-2.5"></div>
              <div className="animate-pulse h-72 bg-gray-200 rounded mb-5"></div>
              <div className="animate-pulse h-24 w-full bg-gray-200 rounded"></div>
            </div>

            <div className="w-10/ flex flex-col mb-8 ">
              <div className="animate-pulse h-10 w-72 bg-gray-200 rounded mb-2.5"></div>
              <div className="animate-pulse h-72 bg-gray-200 rounded mb-5"></div>
              <div className="animate-pulse h-24 w-full bg-gray-200 rounded"></div>
            </div>
          </div>
        )}

        {posts &&
          posts.map((post) => (
            <Post
              post={post}
              key={post?._id}
              setUsers={setUsers}
              setShowReaction={setShowReaction}
            />
          ))}

        {loadingMore && (
          <center>
            <i className="fa fa-spinner fa-spin bg-green"></i>
          </center>
        )}
      </div>
    </>
  );
};

export default Posts;
