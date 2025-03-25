import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SidebarCommunity from "./sidebar";
import { useLocation } from "react-router-dom";
import { FaCompass, FaUsers, FaPlus, FaBars, FaTimes } from "react-icons/fa";
import Menu from "../menu";
import {
  useGetCreatedCommunitiesQuery,
  useGetJoinedCommunitiesQuery,
} from "../../redux/services/community/community-api";
import {
  fetchCreatedCommunities,
  fetchJoinedCommunities,
} from "../../redux/slices/community/community";

const CommunityLayout = ({ children }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useSelector((state) => state.user);

  const [show, setShow] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: undefined,
  });

  // Callback function to receive value from the child community sidebar
  const handleModelShow = (value) => {
    setShow(value);
  };

  // Redux query fetch all created, joined Communities
  const { data: createdcommunitiesData } = useGetCreatedCommunitiesQuery();
  const { data: joinedcommunitiesData } = useGetJoinedCommunitiesQuery();

  // Store fetched data communites in state
  useEffect(() => {
    if (createdcommunitiesData || joinedcommunitiesData) {
      dispatch(fetchCreatedCommunities(createdcommunitiesData));
      dispatch(fetchJoinedCommunities(joinedcommunitiesData));
    }
  }, [createdcommunitiesData, joinedcommunitiesData, dispatch]);

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (size.width > 768 && menuOpen) {
      setMenuOpen(false);
      document.querySelector(".community").style.display = "block";
    }
  }, [size.width, menuOpen]);

  // Define the base links
  const baseLinks = [
    { to: "/community/discover", label: "Discover", icon: <FaCompass /> },
    { to: "/community/joins", label: "My Communities", icon: <FaUsers /> },
  ];

  // Conditionally add the "Create" link if the user is an admin or therapist
  const links = user?.role === "admin" || user?.role === "therapist"
    ? [...baseLinks, { to: "/community/create", label: "Create", icon: <FaPlus /> }]
    : baseLinks;

  return (
    <>
      <div className="">
        <Menu />

        <section className="relative">
          <div className="laptop:hidden tablet:hidden bg-primary-foreground desktop:hidden mt-2  fixed z-[1] top-12 pt-3 w-full pb-2.5 px-6 flex flex-row items-center justify-between">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center p-2 rounded-md text-[12px] hover:bg-Accent/70 hover:text-primary ${location.pathname === link.to ? "bg-Accent/70 text-primary" : ""
                  }`}
              >
                {link.icon}
                <span className="ml-2">{link.label}</span>
              </Link>
            ))}
          </div>

          <SidebarCommunity onAddCommunityClick={handleModelShow} />
          <div className=" bg-white  duration-300 ease-in-out min-h-[95vh] phone:ml-0 ml-[23%] tablet:ml-[20%] laptop:ml-[20%] desktop:ml-[18%] pt-[5rem] pb-4 tablet:pt-[3rem] laptop:pt-[3rem] desktop:pt-[3rem] rounded-md">
            <br />
            {children}
          </div>
        </section>
      </div>
    </>
  );
};

export default CommunityLayout;
