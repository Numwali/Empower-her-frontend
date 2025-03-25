import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutMode } from "../../redux/slices/Auth/Auth";
import NavItem from "./NavItem";
import { toast } from "react-toastify";

export default function Sidebar() {
  const { user } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logout = () => {
    dispatch(logoutMode());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged Out");
    setTimeout(() => {
      navigate("/");
    }, 3000);
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
      <div className="md:flex hidden pl-4 flex-col justify-between h-screen fixed px-10 py-14 bg-white">
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
    </>
  );
}
