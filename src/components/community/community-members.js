import { useEffect, useState, useRef } from "react"
import { useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { Plus, X, Search, UserPlus, Users } from "lucide-react"
import creopa from "../../assets/images/profile.png";

import { useGetCommunityQuery, useAddCommunityMemberMutation } from "../../redux/services/community/community-api"
import { useGetAllUsersQuery } from "../../redux/services/users/users-apis"
import { fetchCommunity } from "../../redux/slices/community/community"
import { fetchUsers } from "../../redux/slices/users/userSlice"
import MemberCard from "./MemberCard"

export default function CommunityMembers() {
  const dispatch = useDispatch()
  const { communityId } = useParams()

  // Fetch all users
  const { data: usersData } = useGetAllUsersQuery()
  useEffect(() => {
    if (usersData) {
      dispatch(fetchUsers(usersData))
    }
  }, [usersData, dispatch])

  const { user } = useSelector((state) => state.user)
  const { community } = useSelector((state) => state.communities)
  const { users } = useSelector((state) => state.users)

  const { data: communityData } = useGetCommunityQuery(communityId)
  const [AddCommunityMember] = useAddCommunityMemberMutation()

  const [searchTerm, setSearchTerm] = useState("")
  const [visibleUsers, setVisibleUsers] = useState(5)
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const popoverRef = useRef(null)

  const pendingMembers = community?.pendingMembers
  let members = community?.members

  const isUserAdmin = community?.creator?._id === user?.id

  useEffect(() => {
    if (communityData) {
      dispatch(fetchCommunity(communityData?.community))
    }
  }, [communityData, dispatch])

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsPopoverOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  if (community?.creator) {
    members = [community.creator, ...members.filter((member) => member?._id !== community?.creator?._id)]
  }

  if (user && members && !isUserAdmin) {
    const userIndex = members?.findIndex((member) => member?._id === user?.id)
    if (userIndex !== -1 && userIndex !== 1) {
      const tempUser = members[userIndex]
      members[userIndex] = members[1]
      members[1] = tempUser
    }
  }

  // Filter users based on the search term and remove already existing members
  const filteredUsers = users
    .filter((user) => (user?.firstname + " " + user?.lastname).toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((user) => !members?.some((member) => member?._id === user?._id))

  async function addOrRemoveMember(id) {
    try {
      // Logic for adding/removing members from pendingMembers state
      await AddCommunityMember({ communityId, userId: id })

      // Optionally, fetch updated community data after the change
      const updatedCommunity = await communityData(communityId)

      // Dispatch the updated community data to update the state
      dispatch(fetchCommunity(updatedCommunity))
    } catch (error) {
      console.error("Failed to update member list:", error)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white dark:bg-dark-primary rounded-lg shadow-sm border border-gray-200 dark:border-dark-gray-600/30 p-6">
        {/* Pending Members Section (Admin Only) */}
        {isUserAdmin && pendingMembers?.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-primary dark:text-dark-gray-100 flex items-center">
                <span className="inline-flex items-center justify-center bg-Accent/20 text-primary dark:text-Accent w-6 h-6 rounded-full text-sm mr-2">
                  {pendingMembers?.length}
                </span>
                Pending Members
              </h2>
            </div>

            <div className="h-px bg-gray-200 dark:bg-dark-gray-600/30 w-full mb-4"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingMembers &&
                pendingMembers.map((member, index) => (
                  <MemberCard key={index} data={member} status="pending" creator={community.creator} />
                ))}
            </div>
          </div>
        )}

        {/* Community Members Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-primary dark:text-dark-gray-100 flex items-center">
              <span className="inline-flex items-center justify-center bg-primary/10 text-primary dark:text-Accent w-6 h-6 rounded-full text-sm mr-2">
                {members?.length || 0}
              </span>
              Community Members
            </h2>

            {isUserAdmin && (
              <div className="relative" ref={popoverRef}>
                <button
                  type="button"
                  onClick={() => setIsPopoverOpen(!isPopoverOpen)}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-Accent hover:bg-Accent/90 text-white transition-colors"
                  aria-label="Add member"
                >
                  <Plus size={16} />
                </button>

                {isPopoverOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white dark:bg-dark-primary-100 ring-1 ring-black ring-opacity-5 z-10">
                    <div className="p-3 border-b border-gray-200 dark:border-dark-gray-600/30 flex items-center justify-between">
                      <h3 className="text-sm font-medium text-primary ">Add Member</h3>
                      <button
                        onClick={() => setIsPopoverOpen(false)}
                        className="text-red-400 hover:text-red-500 "
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <div className="p-3">
                      <div className="relative mb-3">
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Search users..."
                          className="w-full py-2 pl-8 pr-3 text-sm bg-gray-100 dark:bg-dark-primary-200 border border-gray-200 dark:border-dark-gray-600/30 rounded-md focus:outline-none focus:ring-2 focus:ring-Accent/50"
                        />
                        <Search size={14} className="absolute left-2.5 top-2.5 text-gray-400 dark:text-dark-gray-400" />
                      </div>

                      {filteredUsers.length > 0 ? (
                        <div className="max-h-60 overflow-y-auto">
                          <ul className="space-y-1">
                            {filteredUsers.slice(0, visibleUsers).map((user) => (
                              <li
                                key={user?._id}
                                onClick={() => {
                                  addOrRemoveMember(user?._id)
                                  setIsPopoverOpen(false)
                                }}
                                className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-dark-primary-200 rounded-md cursor-pointer transition-colors"
                              >
                                {user?.profileImage ? (
                                  <img
                                    src={user.profileImage || creopa}
                                    alt={user?.firstname}
                                    className="w-8 h-8 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-dark-primary-300 flex items-center justify-center text-gray-500 dark:text-dark-gray-400">
                                    <Users size={16} />
                                  </div>
                                )}
                                <span className="text-sm text-black">
                                  {user?.firstname + " " + user?.lastname}
                                </span>
                                <UserPlus size={14} className="ml-auto text-Accent" />
                              </li>
                            ))}
                          </ul>

                          {filteredUsers.length > visibleUsers && (
                            <button
                              onClick={() => setVisibleUsers(visibleUsers + 5)}
                              className="w-full text-center text-xs text-Secondary hover:text-Secondary/80 py-2 mt-1"
                            >
                              Show more users
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="py-3 text-center text-sm text-gray-600">
                          No users found
                        </div>
                      )}
                    </div>

                    <div className="p-2 border-t border-gray-200  flex justify-end">
                      <button
                        onClick={() => setIsPopoverOpen(false)}
                        className="px-3 py-1.5 text-xs font-medium text-red-400 hover:text-red-600 rounded-md transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="h-px bg-red-200  w-full mb-4"></div>

          {members && members.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {members.map((member, index) => (
                <MemberCard key={index} data={member} status="active" creator={community.creator} />
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-dark-primary-200 mb-4">
                <Users size={24} className="text-gray-400 dark:text-dark-gray-400" />
              </div>
              <p className="text-gray-500 dark:text-dark-gray-400">No members in this community yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

