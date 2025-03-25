import {
  ButtonGroup,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { useDispatch, useSelector } from "react-redux";
import {
  useCreateCommunityMutation,
  useGetCommunitiesQuery,
} from "../../redux/services/community/community-api";
import { fetchCommunities } from "../../redux/slices/community/community";
import { fetchUsers } from "../../redux/slices/users/userSlice";
import { useNavigate } from "react-router-dom";
import { useGetAllUsersQuery } from "../../redux/services/users/users-apis";
export default function CommunityCreate() {
  // Get users stored in states
  const { users } = useSelector((state) => state.users);

  // Redux query fetch all users and communities
  const { data: communitiesData } = useGetCommunitiesQuery();
  const { data: usersData } = useGetAllUsersQuery();

  // Redux mutation -creation of a community
  const [createCommunity, { isLoading }] = useCreateCommunityMutation();

  const { isOpen, onToggle, onClose } = useDisclosure();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [image, setImage] = useState();
  const [name, setName] = useState();
  const [description, setDescription] = useState();
  const [privacy, setPrivacy] = useState('public');
  const [members, setMembers] = useState([]);
  const [displayedMembers, setDisplayedMembers] = useState([]);

  // Store fetched data  users, communites in states
  useEffect(() => {
    if (usersData) {
      dispatch(fetchUsers(usersData));
    }
  }, [usersData, dispatch]);

  useEffect(() => {
    if (communitiesData) {
      dispatch(fetchCommunities(communitiesData));
    }
  }, [communitiesData, dispatch]);

  function addOrRemoveMember(item) {
    setMembers((prevArray) => {
      const index = prevArray.indexOf(item);

      if (index === -1) {
        // Item is not in the array, so add it
        return [...prevArray, item];
      } else {
        // Item is in the array, so remove it
        return prevArray.filter((_, i) => i !== index);
      }
    });
  }

  function addOrRemoveDisplayedMember(item) {
    setDisplayedMembers((prevArray) => {
      const index = prevArray.findIndex((obj) => obj.id === item.id);

      if (index === -1) {
        // Item is not in the array, so add it
        return [...prevArray, item];
      } else {
        // Item is in the array, so remove it
        return prevArray.filter((_, i) => i !== index);
      }
    });
  }

  const addCommunity = async () => {
    var data = new FormData();
    data.append("name", name);
    data.append("description", description);
    data.append("privacy", privacy);
    data.append("members", members);
    data.append("image", image);

    try {
      const { community } = await createCommunity(data).unwrap();
      community && toast.success(`${community?.name} was created`);
      navigate(`/community/${community?._id}`);
    } catch (error) {
      console.log("Error here", error);
      toast.error(error?.data?.message || "Something went wrong.");
    }
  };
  return (
    <>
      <div className=" bg-white dark:!bg-dark-primary m-6 rounded-md px-20 py-6">
        <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-6">
          <div className="sm:col-span-full">
            <label
              for="community name"
              className="text-sm antialiased leading-6 text-gray-600 "
            >
              Community name
            </label>
            <div className="mt-2">
              <input
                type="text"
                placeholder="name"
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-[10px] rounded-lg bg-transparent  border focus:outline-none font-normal text-sm antialiased"
              />
            </div>
          </div>

          <div className="col-span-full">
            <label
              for="description"
              className="text-sm antialiased leading-6 text-gray-600 "
            >
              Description
            </label>

            <div className="mt-2">
              <textarea
                id="about"
                name="about"
                rows="2"
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-md border-[0.5px] py-1.5 text-gray-600 ring-1 ring-inset ring-gray-300 placeholder:text-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2 text-sm antialiased"
              ></textarea>
            </div>
          </div>
          <div className="col-span-full">
            <label
              for="about"
              className="text-sm antialiased leading-6 text-gray-600 "
            >
              Privacy
            </label>
            <div className="mt-1">
              <select
                type="text"
                placeholder="privacy"
                onChange={(e) => setPrivacy(e.target.value)}
                className="w-full px-3 text-sm antialiased py-[8px] rounded-lg bg-transparent  border focus:outline-none font-normal "
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>
          <div className="col-span-full">
            <label
              for="photo"
              className=" text-sm font-medium leading-6 text-gray-600 "
            >
              Photo cover
            </label>
            <div className="mt-2 flex items-center gap-x-3">
              {image ? (
                <div>
                  <img
                    alt="not found"
                    width={"250px"}
                    src={URL.createObjectURL(image)}
                  />
                </div>
              ) : (
                <svg
                  className="h-12 w-12 text-gray-300"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              )}

              <input
                type="file"
                className="rounded-md bg-white px-2 py-1 font-medium text-gray-600 border hover:bg-gray-100"
                // style={{ display: "none" }}
                onChange={(event) => {
                  setImage(event.target.files[0]);
                }}
              />
            </div>
          </div>
          <div className="col-span-full ">
            <label
              for="members"
              className=" text-sm font-medium leading-6 text-gray-600 "
            >
              Add members (Optional)
            </label>
            <div className="mt-2 flex flex-row items-center flex-wrap gap-x-3 py-2">
              {displayedMembers?.map((member) => (
                <div
                  key={member?.id}
                  className="relative flex flex-row items-center antialiased flex-wrap  bg-Accent rounded-md cursor-pointer py-[4px] px-2"
                >
                  <svg
                    className="h-6 w-6 text-gray-300"
                    viewBox="0 0 24 24"
                    fill="primary"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <h1 className="text-[12px] text-white">
                    {member.name}
                  </h1>

                  <div
                    onClick={() => {
                      addOrRemoveMember(member?.id);
                      addOrRemoveDisplayedMember({
                        id: member?.id,
                      });
                    }}
                    className="absolute -top-2 -right-2 flex items-center text-[12px] text-white justify-center cursor-pointer w-4 h-4 bg-Accent rounded-full p-1"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </div>
                </div>
              ))}

              <Popover
                returnFocusOnClose={false}
                isOpen={isOpen}
                onClose={onClose}
                closeOnBlur={false}
              >
                <PopoverTrigger>
                  <button
                    type="button"
                    onClick={onToggle}
                    className="rounded-full w-8 h-8 bg-Accent dark:bg-dark-primary border-none text-white px-2.5 py-1.5 font-normal hover:bg-Accent/70 dark:hover:bg-dark-primary text-[12px] antialiased"
                  >
                    <i className="fa-solid fa-plus"></i>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="dark:bg-dark-primary">
                  <PopoverHeader className="text-sm font-bold text-gray-600 ">
                    Invite friends
                  </PopoverHeader>
                  <PopoverArrow className="dark:bg-dark-primary" />
                  <PopoverCloseButton className="" />
                  <PopoverBody>
                    <div className="p-2">
                      <ul>
                        {users?.map((user) => (
                          <div key={user?._id}>
                            <li
                              onClick={() => {
                                addOrRemoveMember(user?._id);
                                addOrRemoveDisplayedMember({
                                  id: user?._id,
                                  name: user?.firstname + " " + user?.lastname,
                                  profileImage: user.profileImage,
                                });
                                onClose();
                              }}
                              className="hover:bg-Accent/20 cursor-pointer p-[1px] rounded-md"
                            >
                              <div className="flex items-center gap-2">
                                <svg
                                  className="h-8 w-8 text-gray-300 "
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  aria-hidden="true"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <h1 className="text-[12px] text-gray-600 ">
                                  {user?.firstname + " " + user?.lastname}
                                </h1>
                              </div>
                            </li>
                          </div>
                        ))}
                        <div className="my-2">
                          <p className="text-gray-600  text-[10px] cursor-pointer ml-2 hover:text-primary ">
                            See more ...
                          </p>
                        </div>
                      </ul>
                    </div>
                  </PopoverBody>
                  <div className="flex justify-end border border-t-2 p-2 dark:border-dark-primary-200">
                    <ButtonGroup size="sm" onClick={onClose}>
                      <button className="text-red-600  font-medium border p-1 text-[12px] hover:bg-red-100 ">
                        Cancel
                      </button>
                    </ButtonGroup>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex items-center justify-center mt-4">
              <button
                onClick={() => addCommunity()}
                className="bg-gray-300 text-gray-600 hover:bg-gray-300/70 w-[60%] p-2"
              >
                {isLoading ? "Loading..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
