import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import img1 from "../../assets/images/profile.png";
import { useGetCommunityPostsQuery } from "../../redux/services/community/community-api";
import { fetchCommunityPosts } from "../../redux/slices/community/community";
import CommunityPost from "./community-post";
import CreateCommunityPostModel from "./create-community-post";
import { PlusCircle } from "lucide-react"

export default function CommunityPosts({ children }) {
  const dispatch = useDispatch();
  let { communityId } = useParams();

  // Get data stored in states
  const { user } = useSelector((state) => state.user);
  const { posts } = useSelector((state) => state.communities);

  const [users, setUsers] = useState([]);
  const [show, setShow] = useState(false);
  const [showReaction, setShowReaction] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Redux query fetch Community posts
  const {
    data: communityPosts,
    isLoading,
    isFetching,
  } = useGetCommunityPostsQuery(communityId);

  // Store fetched community post in state
  useEffect(() => {
    if (communityPosts) {
      dispatch(fetchCommunityPosts(communityPosts));
    }
  }, [communityPosts, dispatch]);

  return (
    <>
      <div className="w-full rounded-md px-3 tablet:px-8 laptop:px-12 desktop:px-20">
        <div className="">
          <div>
            <CreateCommunityPostModel show={show} handleClose={handleClose} />
            <div className="bg-white w-full p-2 rounded-lg">
              <div className="flex md:flex-row flex-col items-center justify-center gap-2">
                <img
                  src={user.profileImage ? user.profileImage : img1}
                  alt=""
                  className="w-10 h-10 rounded-full"
                />
                <span
                  className=" bg-gray-300 py-2 px-2 rounded-3xl text-gray-600 text-[12px] cursor-pointer" onClick={handleShow}
                >
                  what's on your mind?.......
                </span>
                <button
                  onClick={handleShow}
                  className="flex flex-row items-center gap-1.5 bg-Accent hover:bg-Accent/90 text-white py-1.5 px-3 rounded-md text-xs font-medium transition-colors"
                >
                  <PlusCircle size={16} />
                  <span>Create Post</span>
                </button>
              </div>
              <hr className="opacity-10 my-3 text-gray-300" />
            </div>
          </div>

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

          {posts &&
            posts?.posts?.map((post) => (
              <CommunityPost
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
      </div>
    </>
  );
}
