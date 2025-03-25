import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import BatchImage from "../../assets/images/community.svg";
import creopa from "../../assets/images/community.png";
import { fetchMyCommunities } from "../../redux/slices/community/community";
import { useGetMyCommunitiesQuery } from "../../redux/services/community/community-api";

const SidebarCommunity = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  // Get data stored in states
  const { myCommunities } = useSelector((state) => state.communities);
  const { createdCommunities, joinedCommunities } = useSelector(
    (state) => state.communities
  );
  // Redux query fetch Communities
  const { data: mycommunitiesData } = useGetMyCommunitiesQuery();

  // Store fetched communities
  useEffect(() => {
    if (mycommunitiesData) {
      dispatch(fetchMyCommunities(mycommunitiesData));
    }
  }, [mycommunitiesData, dispatch]);

  const [subMenu, setSubmenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCommunities = myCommunities?.communities?.filter((community) =>
    community.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <>
      <div className="fixed phone:hidden w-[23%] tablet:w-[20%] laptop:w-[20%] desktop:w-[18%] shadow-sm mt-[2rem] pt-[45px] pb-[65px] px-3 bg-dark-primary h-screen  duration-300 ease-in-out">
        <div className="sticky bg-white/100">
          <h1 className="text-[20px] text-center mt-2 font-extrabold text-black">
            Communities
          </h1>

          <div className="flex items-center p-2 gap-2 border-none text-[14px] text-gray-600  bg-gray-300/40 dark:bg-dark-primary-100 rounded-2xl placeholder:text-base placeholder:ml-2 focus:outline-none my-2">
            <i className="fa-solid fa-magnifying-glass text-sm text-gray-600/55 "></i>
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearchChange}
              className="bg-transparent w-auto outline-none"
            />
          </div>

          <hr className="text-primary" />
        </div>

        {!searchTerm && (
          <nav className="text-black flex flex-col gap-2 cursor-pointer mt-2 overflow-y-auto no-scrollbar h-[80%] scrollbar-thumb-gray-300 scroll-smooth scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
            <Link to="/community/discover">
              <div
                className="flex items-center font-semibold mt-[10px] p-[3px] w-[90%] gap-2"
              >
                <div className="flex flex-col justify-center items-center w-[35px] h-[35px] bg-gray-300 rounded-[50px] p-[10px] hover:bg-Accent text-white duration-300 ease-in-out ">
                  <i className="fa fa-compass text-black"></i>
                </div>
                <span>Discover</span>
              </div>
            </Link>
            <Link to="/community/joins">
              <div
                className="flex font-semibold items-center mt-[6px] p-[3px] gap-2 cursor-pointer"
                onClick={() => setSubmenu(!subMenu)}
              >
                <div className="flex flex-col justify-center items-center w-[35px] h-[35px] bg-gray-300 rounded-[50px] p-[10px] hover:bg-Accent text-white duration-300 ease-in-out ">
                  <img src={BatchImage} alt="" />
                </div>
                <span>Your Communities</span>
              </div>
            </Link>

            {(user?.role === "therapist" || user?.role === "admin") &&
              (
                <Link to="/community/create">
                  <div className="flex items-center justify-center mt-[10px] p-[6px] text-white font-bold bg-Accent rounded-[10px] text-[14px] w-[90%] gap-2 cursor-pointer">
                    <div className="">
                      <i className="fa fa-add text-white"></i>
                    </div>
                    <span>Create New</span>
                  </div>
                </Link>
              )
            }
            
            <hr className="mt-[20px] border border-[#02ac9f] w-[90%]" />

            {(user?.role === "therapist" || user?.role === "admin") &&
            <div>
              <div className="flex items-center justify-between gap-2 mt-[10px] m-[2px] w-[90%] text-[12px]">
                <span className="desktop:text-[13px] text-[13px] antialiased text-black/80 font-semibold ">
                  My Communities
                </span>
              </div>

              <div className="mt-2">
                {createdCommunities?.communities
                  ?.slice(0, 5)
                  .map((community) => (
                    <Link
                      to={`/community/${community?._id}`}
                      key={community?._id}
                      className="flex flex-row items-center gap-2 my-1 hover:bg-gray-100 p-2 dark:hover:bg-gray-100/15 rounded-sm"
                    >
                      <div className="bg-[#4267b2] text-white text-center w-10 h-10 rounded overflow-hidden">
                        <img
                          src={community.profileImage || creopa}
                          alt="Group cover"
                          className="max-w-full w-full h-[100%] object-cover"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <h1 className="desktop:text-[13px] font-semibold text-[13px] Accent ">
                          {community.name}
                        </h1>
                        <p className="text-[13px] text-gray-600 truncate">
                          {community?.description}
                        </p>
                      </div>
                    </Link>
                  ))}
              </div>

            </div>
            }

            <hr className="mt-[20px] border border-[#02ac9f] w-[90%]" />

            <div className="flex items-center justify-between gap-2 mt-[10px] m-[2px] w-[90%] text-[12px]">
              <span className="desktop:text-[13px] text-[13px] antialiased text-black/80 font-semibold  duration-300 ease-in-out">
                Joined Communities
              </span>
              <Link to="/community/joins" className="text-Secondary font-bold underline">See all</Link>
            </div>

            <div className="mt-2">
              {joinedCommunities?.communities?.slice(0, 5).map((community) => (
                <Link
                  to={`/community/${community?._id}`}
                  key={community?._id}
                  className="flex flex-row items-center gap-2 my-1  rounded-sm"
                >
                  <div className="bg-[#4267b2] text-white text-center w-10 h-10 rounded overflow-hidden">
                    <img
                      src={community?.profileImage || creopa}
                      alt="Group Image"
                      className="max-w-full w-full h-[100%] object-cover object-center"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h1 className="desktop:text-[13px] text-[13px] font-semibold truncate">
                      {community?.name}
                    </h1>
                    <p className="text-[13px] text-gray-600 truncate">
                      {community?.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            <hr className="mt-[10px] border border-[#02ac9f] w-[90%]" />

            <Link to="/resources">
              <div className="flex items-center justify-center mt-[10px] p-[6px] text-black bg-Accent rounded-[10px] text-[14px] w-[90%] gap-2 cursor-pointer">
                <div className="">
                  <i className="fa-solid fa-backward"></i>
                </div>
                <span>Dashboard</span>
              </div>
            </Link>

          </nav>
        )}

        {searchTerm && (
          <div className="mt-2">
            {filteredCommunities.length === 0 && (
              <div className="text-center">No community founds</div>
            )}
            {filteredCommunities.map((community) => (
              <Link
                to={`/community/${community?._id}`}
                key={community?._id}
                className="flex flex-row items-center gap-2 my-1 hover:bg-gray-100 p-2"
              >
                <div className="bg-[#4267b2] text-white text-center w-10 h-10 rounded overflow-hidden">
                  <img
                    src={community?.profileImage || creopa}
                    alt="Group Image"
                    className="max-w-full w-full h-[100%] object-contain"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <h1 className="desktop:text-[13px] font-semibold  text-[13px] text-black ">
                    {community?.name}
                  </h1>
                  <p className="text-[13px] text-gray-600 Accent">
                    {community?.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </>
  );
};

export default SidebarCommunity;
