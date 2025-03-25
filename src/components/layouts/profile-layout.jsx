import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import img1 from "../../assets/images/profile.png";
import ProfileModal from "../profileModal";

const Profile = ({ children }) => {
  const { userPosts } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.user);
  const [show, setShow] = useState(false);
  const location = useLocation();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const isCurrentPage = (path) => {
    return location.pathname === path;
  };

  // Check if the user is an admin or therapist
  const isAdminOrTherapist = user?.role === "admin" || user?.role === "therapist";

  return (
    <>
      <ProfileModal show={show} handleClose={handleClose} user={user} />
      <div className="w-full">
        <div className="profile-box dark:bg-dark-primary">
          <div className="profile-header container">
            <div className="header-flex">
              <div className="content">
                <img
                  src={user.profileImage ? user.profileImage : img1}
                  alt="user avatar"
                  width="80"
                />
                <span className="dark:text-dark-gray-100">
                  <b className="text-gray-600 font-black">
                    {user?.firstname} {user?.lastname}
                    <span className="text-primary  ml-4">[{user?.role}]</span>
                  </b>
                  <p className="flex gap-3">
                    <b className="text-black">@ {user?.username} </b>
                    {user?.role === "therapist" &&
                      <span className="text-primary underline">{userPosts.length} Resource(s)</span>
                    }
                  </p>
                </span>
                <span className="text-Secondary text-sm">{user?.email}</span>
                <p className="rows">
                  <p className="dark:text-dark-gray-300">
                    <span className="font-medium text-gray-600 text-sm">
                      <i className="fa-regular fa-calendar-days"></i> Date Of
                      Birth:
                    </span>{" "}
                    {user.dob}
                  </p>
                  <p className="dark:text-dark-gray-300">
                    <span className="font-medium text-gray-600 text-sm">
                      <i className="fa-sharp fa-solid fa-location-dot"></i>{" "}
                      Location:
                    </span>{" "}
                    {user.address}
                  </p>
                </p>
                <p className="text-xs text-gray-600">
                  {user.interests.slice(0, 4)}, etc...
                </p>
              </div>
              <div>
                <button className="bg-primary text-white text-sm rounded-md px-3 py-1 border-none mt-8 mr-8" onClick={handleShow}>
                  Edit
                </button>
              </div>
            </div>

            {isAdminOrTherapist && (
              <div className="flex justify-between border-t-[1px] border-t-gray-300 border-b-[1px] border-b-gray-300 px-[2rem] py-[0.5rem] mt-[1rem] mb-[1rem] text-gray-600 font-bold dark:text-dark-gray-100">
                <Link to="/profile">
                  <span
                    className={
                      isCurrentPage("/profile")
                        ? "text-black underline decoration-primary decoration-2"
                        : "text-gray-600 font-black"
                    }
                  >
                    Resources
                  </span>
                </Link>
                <Link to="./liked">
                  <span
                    className={
                      isCurrentPage("/profile/liked")
                        ? "text-black underline decoration-primary decoration-2"
                        : "text-gray-600 font-black"
                    }
                  >
                    Likes
                  </span>
                </Link>
              </div>
            )}

          </div>
          {isAdminOrTherapist && children}
          <br />
        </div>
      </div>
    </>
  );
};

export default Profile;