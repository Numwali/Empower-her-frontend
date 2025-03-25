import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Menu,
  MenuButton,
  MenuList,
  IconButton,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import img1 from "../assets/images/profile.png";
import { fetchConversations } from "../redux/slices/chat/chatSlice.js";
import {
  addNotification,
  markAsRead,
  removeNotification,
} from "../redux/slices/notifications/notificationSlice.js";
import { selectingPost } from "../redux/slices/post/post.js";
import SocketContext from "../utils/SocketContext.js";
import axios from "axios";
import { logoutMode } from "../redux/slices/Auth/Auth.js";
import { toast } from "react-toastify";
import NavItem from "./sidebar/NavItem.jsx";

export default function MenuView() {
  const navigate = useNavigate();
  const dispacth = useDispatch();
  const socket = useContext(SocketContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useSelector((state) => state.user);
  const { notifications } = useSelector((state) => state.notifications);
  const { posts } = useSelector((state) => state.posts);

  const logout = () => {
    dispacth(logoutMode());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged Out");
    setTimeout(() => {
      navigate("/");
    }, 3000);
  };

  const getConversations = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/v1/conversations/${user?.id}`
      );
      dispacth(fetchConversations(res?.data?.conversations));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (socket) {
      socket.emit("addUser", user?.id);
      socket.on("getNotification", (data) => {
        dispacth(addNotification(data));
      });
      socket.on("getMessage", (data) => {
        getConversations();
      });
    }
    const token = localStorage.getItem("token");
    const fetchNotification = async () => {
      let config = {
        method: "get",
        url: `${process.env.REACT_APP_BACKEND_URL}/v1/notification`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      axios(config)
        .then((res) => {
          dispacth(addNotification(res.data.notifications));
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchNotification();
  }, [socket, dispacth, user?.id]);

  const markAsReaded = (id) => {
    dispacth(markAsRead(id));
    const token = localStorage.getItem("token");
    let config = {
      method: "put",
      url: `${process.env.REACT_APP_BACKEND_URL}/v1/notification/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios(config)
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      });
  };

  const deteleNotification = (id) => {
    dispacth(removeNotification(id));
    const token = localStorage.getItem("token");
    let config = {
      method: "delete",
      url: `${process.env.REACT_APP_BACKEND_URL}/v1/notification/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios(config)
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      });
  };

  const navigating = (notification) => {
    if (notification?.data?.type === "message") {
      navigate(`/chat`);
      markAsReaded(notification?._id);
    } else {
      const post = posts.find(
        (post) => post?._id === notification?.data?.contentId
      );
      dispacth(selectingPost(post));
      navigate(`/resource`);
      markAsReaded(notification?._id);
    }
  };

  // Define navigation items for each role
  const adminItems = [
    {
      icon: "fa-solid fa-book",
      title: "Resources",
      link: "/resources",
    },
    {
      icon: "fa-solid fa-users-rays",
      title: "Community",
      link: "/community/discover",
    },
    {
      icon: "fa-solid fa-users",
      title: "All Users",
      link: "/all-users",
    },
    {
      icon: "fa-solid fa-user-doctor",
      title: "Psychotherapists",
      link: "/psychotherapists",
    },
    {
      icon: "fa-solid fa-message",
      title: "Chat",
      link: "/chat",
    },
  ];

  const userItems = [
    {
      icon: "fa-solid fa-book",
      title: "Resources",
      link: "/resources",
    },
    {
      icon: "fa-solid fa-users-rays",
      title: "Community",
      link: "/community/discover",
    },
    {
      icon: "fa-solid fa-user-doctor",
      title: "Therapists",
      link: "/therapists",
    },
    {
      icon: "fa-solid fa-handshake",
      title: "Booked Sessions",
      link: "/userbooking",
    },
    {
      icon: "fa-solid fa-comment-nodes",
      title: "My AI Therapist",
      link: "/aitherapist",
    },
  ];

  const therapistItems = [
    {
      icon: "fa-solid fa-book",
      title: "Resources",
      link: "/resources",
    },
    {
      icon: "fa-solid fa-users-rays",
      title: "Community",
      link: "/community/discover",
    },
    {
      icon: "fa-solid fa-handshake",
      title: "Sessions",
      link: "/therapistsessions",
    },
    {
      icon: "fa-solid fa-message",
      title: "Chat",
      link: "/chat",
    },
  ];

  // Determine which set of items to display based on the user's role
  let items = [];
  if (user?.role === "admin") {
    items = adminItems;
  } else if (user?.role === "user") {
    items = userItems;
  } else if (user?.role === "therapist") {
    items = therapistItems;
  }

  return (
    <>
      <div className="w-full h-[4.5rem] dark:!bg-dark-primary duration-300 ease-in-out fixed z-10 bg-white tablet:shadow-sm laptop:shadow-sm desktop:shadow-sm  flex flex-row items-center justify-between py-4 px-4">
        <Link href="/" className="flex items-center">
          <div className="w-10 h-10 bg-Secondary rounded-full flex items-center justify-center mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <span className="font-bold text-xl text-primary">EmpowerHer</span>
        </Link>

        <div className="block md:hidden">
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={
                menuOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M4 12h16m-7 6h7"
                    />
                  </svg>
                )
              }
              onClick={() => setMenuOpen(!menuOpen)}
              variant="outline"
            />
            <MenuList>
              <nav className="flex flex-row justify-center items-center gap-3 pt-2 w-full">
                <Popover placement="top-start">
                  <PopoverTrigger>
                    <span className="relative text-[23px] cursor-pointer text-gray-600 dark:text-dark-gray-300 mr-1 hover:bg-gray-300 hover:rounded-full hover:text-[20px] duration-200 hover:p-2 hover:text-primary">
                      <i className="fa-regular fa-message"></i>

                      {notifications.filter(
                        (notification) =>
                          notification?.data.type === "message" &&
                          !notification.isRead
                      ).length > 0 && (
                        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-300 transform translate-x-1/2 -translate-y-1/2   bg-Accent rounded-full">
                          {
                            notifications.filter(
                              (notification) =>
                                notification?.data.type === "message" &&
                                !notification.isRead
                            ).length
                          }
                        </span>
                      )}
                    </span>
                  </PopoverTrigger>
                  <PopoverContent className="p-2">
                    <PopoverHeader>
                      <div className="flex flex-row justify-between items-center">
                        <div className="flex flex-col gap-2">
                          <h1 className="text-black font-semibold text-lg">
                            New Messages
                          </h1>
                          <p className="text-[12px] text-gray-600 antialiased font-normal">
                            You have{" "}
                            {
                              notifications.filter(
                                (notification) =>
                                  notification?.data.type === "message" &&
                                  !notification.isRead
                              ).length
                            }{" "}
                            unread messages
                          </p>
                        </div>
                      </div>
                    </PopoverHeader>
                    <PopoverArrow />
                    <PopoverCloseButton className="text-red-900 hover:bg-red-400" />
                    {notifications &&
                      notifications
                        .filter(
                          (notification) =>
                            notification?.data.type === "message"
                        )
                        .map((notification) => (
                          <PopoverBody
                            Key={notification._id}
                            className={
                              notification.isRead
                                ? " bg-gray-100 flex justify-between"
                                : "flex justify-between"
                            }
                          >
                            <h1
                              onClick={() => navigating(notification)}
                              className="text-base text-gray-600 antialiased font-normal"
                            >
                              {notification?.data.message}
                            </h1>
                            <span
                              className="inline-block text-primary text-sm px-2 py-1 rounded"
                              onClick={() =>
                                deteleNotification(notification._id)
                              }
                            >
                              x
                            </span>
                          </PopoverBody>
                        ))}
                  </PopoverContent>
                </Popover>
                <Popover placement="top-start">
                  <PopoverTrigger>
                    <span className="relative text-[23px] cursor-pointer text-gray-600 dark:text-dark-gray-300 mr-1 hover:bg-gray-300 hover:rounded-full hover:text-[20px] duration-200 hover:p-2 hover:text-primary">
                      <i className="fa-regular fa-bell"></i>
                      {/* Badge for notifications count */}
                      {notifications.filter(
                        (notification) =>
                          notification?.data.type != "message" &&
                          !notification.isRead
                      ).length > 0 && (
                        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600  rounded-full">
                          {
                            notifications.filter(
                              (notification) =>
                                notification?.data.type != "message" &&
                                !notification.isRead
                            ).length
                          }
                        </span>
                      )}
                    </span>
                  </PopoverTrigger>
                  <PopoverContent className="p-2">
                    <PopoverHeader>
                      <div className="flex flex-row justify-between items-center">
                        <div className="flex flex-col gap-2">
                          <h1 className="text-black font-semibold text-lg">
                            Notifications
                          </h1>
                          <p className="text-base text-gray-600 antialiased font-normal">
                            You have{" "}
                            {
                              notifications.filter(
                                (notification) =>
                                  notification?.data.type != "message" &&
                                  !notification.isRead
                              ).length
                            }{" "}
                            unread Notifications
                          </p>
                        </div>
                      </div>
                    </PopoverHeader>
                    <PopoverArrow />
                    <PopoverCloseButton className="text-red-900 hover:bg-red-400" />
                    {notifications &&
                      notifications
                        .filter(
                          (notification) => notification?.data.type != "message"
                        )
                        .map((notification) => (
                          <PopoverBody
                            Key={notification._id}
                            className={
                              notification.isRead
                                ? " bg-gray-100 flex justify-between"
                                : "flex justify-between"
                            }
                          >
                            <h1
                              onClick={() => navigating(notification)}
                              className="text-base text-gray-600 antialiased font-normal"
                            >
                              {notification?.data.message}
                            </h1>
                            <span
                              className="inline-block text-primary text-sm px-2 py-1 rounded"
                              onClick={() =>
                                deteleNotification(notification._id)
                              }
                            >
                              x
                            </span>
                          </PopoverBody>
                        ))}
                  </PopoverContent>
                </Popover>
                <Link to="/profile">
                  <img
                    src={user.profileImage ? user.profileImage : img1}
                    alt="user avatar"
                    className="w-10 h-10 mb-1.5 rounded-full"
                  />
                </Link>
              </nav>

              <div className="p-4">
                <div className="flex flex-col ">
                  {items.map((item, index) => (
                    <NavItem key={index} item={item} />
                  ))}
                  <NavItem
                    item={{
                      icon: "fa-solid fa-newspaper",
                      title: "Jounal",
                      link: "/jounal",
                    }}
                  ></NavItem>
                </div>

                <NavItem
                  item={{ icon: "fa-solid fa-sign-out", title: "Logout" }}
                  onClick={logout}
                />
              </div>
            </MenuList>
          </Menu>
        </div>

        <div className="hidden md:block">
          <nav className="phone:hidden flex  flex-row items-center">
            <span className="flex justify-between items-center gap-2 mr-4">
              {/* <Link to="/community">
                <span className="text-[25px] text-gray-600 dark:text-dark-gray-300 mr-1 hover:bg-gray-300 hover:rounded-full hover:text-[20px] duration-200 hover:p-2 hover:text-primary">
                  <i className="fa-solid fa-users-rays"></i>
                </span>
              </Link> */}

              <Popover placement="top-start">
                <PopoverTrigger>
                  <span className="relative text-[23px] text-gray-600 cursor-pointer dark:text-dark-gray-300 mr-1 hover:bg-gray-300 hover:rounded-full hover:text-[20px] duration-200 hover:p-2 hover:text-primary">
                    <i className="fa-regular fa-message"></i>
                    {notifications.filter(
                      (notification) =>
                        notification?.data.type === "message" &&
                        !notification.isRead
                    ).length > 0 && (
                      <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-200 transform translate-x-1/2 -translate-y-1/2 bg-red-600   rounded-full">
                        {
                          notifications.filter(
                            (notification) =>
                              notification?.data.type === "message" &&
                              !notification.isRead
                          ).length
                        }
                      </span>
                    )}
                  </span>
                </PopoverTrigger>
                <PopoverContent className="p-2">
                  <PopoverHeader>
                    <div className="flex flex-row justify-between items-center">
                      <div className="flex flex-col gap-2">
                        <h1 className="text-black font-semibold text-lg">
                          New Messages
                        </h1>
                        <p className="text-[12px] text-gray-600 antialiased font-normal">
                          You have{" "}
                          {
                            notifications.filter(
                              (notification) =>
                                notification?.data.type === "message" &&
                                !notification.isRead
                            ).length
                          }{" "}
                          unread messages
                        </p>
                      </div>
                    </div>
                  </PopoverHeader>
                  <PopoverArrow />
                  <PopoverCloseButton className="text-red-900 hover:bg-red-400" />
                  {notifications &&
                    notifications
                      .filter(
                        (notification) => notification?.data.type === "message"
                      )
                      .map((notification) => (
                        <PopoverBody
                          Key={notification._id}
                          className={
                            notification.isRead
                              ? " bg-gray-100 flex justify-between"
                              : "flex justify-between"
                          }
                        >
                          <h1
                            onClick={() => navigating(notification)}
                            className="text-base text-gray-600 antialiased font-normal"
                          >
                            {notification?.data.message}
                          </h1>
                          <span
                            className="inline-block text-primary text-sm px-2 py-1 rounded"
                            onClick={() => deteleNotification(notification._id)}
                          >
                            x
                          </span>
                        </PopoverBody>
                      ))}
                </PopoverContent>
              </Popover>
              <Popover placement="top-start">
                <PopoverTrigger>
                  <span className="relative text-[23px] text-gray-600 cursor-pointer dark:text-dark-gray-300 mr-1 hover:bg-gray-300 hover:rounded-full hover:text-[20px] duration-200 hover:p-2 hover:text-primary">
                    <i className="fa-regular fa-bell"></i>
                    {/* Badge for notifications count */}
                    {notifications.filter(
                      (notification) =>
                        notification?.data.type != "message" &&
                        !notification.isRead
                    ).length > 0 && (
                      <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600   rounded-full">
                        {
                          notifications.filter(
                            (notification) =>
                              notification?.data.type != "message" &&
                              !notification.isRead
                          ).length
                        }
                      </span>
                    )}
                  </span>
                </PopoverTrigger>
                <PopoverContent className="p-2">
                  <PopoverHeader>
                    <div className="flex flex-row justify-between items-center">
                      <div className="flex flex-col gap-2">
                        <h1 className="text-black font-semibold text-lg">
                          Notifications
                        </h1>
                        <p className="text-base text-gray-600 antialiased font-normal">
                          You have{" "}
                          {
                            notifications.filter(
                              (notification) =>
                                notification?.data.type != "message" &&
                                !notification.isRead
                            ).length
                          }{" "}
                          unread Notifications
                        </p>
                      </div>
                    </div>
                  </PopoverHeader>
                  <PopoverArrow />
                  <PopoverCloseButton className="text-red-900 hover:bg-red-400" />
                  {notifications &&
                    notifications
                      .filter(
                        (notification) => notification?.data.type != "message"
                      )
                      .map((notification) => (
                        <PopoverBody
                          Key={notification._id}
                          className={
                            notification.isRead
                              ? " bg-gray-100 flex justify-between"
                              : "flex justify-between"
                          }
                        >
                          <h1
                            onClick={() => navigating(notification)}
                            className="text-base text-gray-600 antialiased font-normal"
                          >
                            {notification?.data.message}
                          </h1>
                          <span
                            className="inline-block text-primary text-sm px-2 py-1 rounded"
                            onClick={() => deteleNotification(notification._id)}
                          >
                            x
                          </span>
                        </PopoverBody>
                      ))}
                </PopoverContent>
              </Popover>
            </span>

            <span>
              <Link to="/profile">
                <img
                  src={user.profileImage ? user.profileImage : img1}
                  alt="user avatar"
                  className="w-10 h-10 mb-1.5 rounded-full"
                />
              </Link>
            </span>
          </nav>
        </div>
      </div>
    </>
  );
}
