
import { useEffect, useState, useRef } from "react"
import { toast } from "react-toastify"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { ChevronLeft, ChevronRight, Clock, Lock, MoreHorizontal, Trash, Edit, LogOut } from "lucide-react"

import {
  useDeleteCommunityMutation,
  useGetMyCommunitiesQuery,
  useLeaveCommunityMutation,
} from "../../redux/services/community/community-api"
import creopa from "../../assets/images/community.png"
import { fetchMyCommunities } from "../../redux/slices/community/community"
import { loggedInUser } from "../../utils/handlers"

const CommunitiesJoinedPage = () => {
  const dispatch = useDispatch()

  // Get data stored in states
  const { myCommunities } = useSelector((state) => state.communities)

  // Redux query fetch all mycommunities
  const { data: mycommunitiesData, isLoading: isCommunityLoading } = useGetMyCommunitiesQuery()

  // Redux mutation -delete, leave a community
  const [deleteCommunity] = useDeleteCommunityMutation()
  const [leaveCommunity] = useLeaveCommunityMutation()

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const communitiesPerPage = 8
  const [paginatedCommunities, setPaginatedCommunities] = useState([])
  const [totalPages, setTotalPages] = useState(0)

  // Store fetched data in state
  useEffect(() => {
    if (mycommunitiesData) {
      dispatch(fetchMyCommunities(mycommunitiesData))
    }
  }, [mycommunitiesData, dispatch])

  // Handle pagination
  useEffect(() => {
    if (myCommunities?.communities) {
      const communities = myCommunities.communities
      setTotalPages(Math.ceil(communities.length / communitiesPerPage))

      const indexOfLastCommunity = currentPage * communitiesPerPage
      const indexOfFirstCommunity = indexOfLastCommunity - communitiesPerPage
      setPaginatedCommunities(communities.slice(indexOfFirstCommunity, indexOfLastCommunity))
    }
  }, [myCommunities, currentPage])

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
  }

  const handleDeleteCommunity = async (communityId) => {
    try {
      const { community, message } = await deleteCommunity(communityId).unwrap()

      if (message) {
        toast.success(message)
      } else if (community) {
        toast.success(`${community.name} deleted`)
      }
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong.")
    }
  }

  const handleUpdateCommunity = (communityId) => {
    // Update logic
  }

  const handleLeaveCommunity = async (communityId) => {
    try {
      const { community, message } = await leaveCommunity(communityId).unwrap()
      if (message) {
        toast.success(message)
      } else if (community) {
        toast.success(`You left ${community.name}`)
      }
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong.")
    }
  }

  const loggedUser = JSON.parse(loggedInUser())

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-primary dark:text-dark-gray-100">
          Your Communities
          <span className="ml-2 text-lg font-normal text-gray-500 dark:text-dark-gray-300">
            ({(myCommunities && myCommunities?.communities?.length) || 0})
          </span>
        </h1>
      </div>

      {isCommunityLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : myCommunities?.communities?.length === 0 ? (
        <div className="bg-white dark:bg-dark-primary-100 rounded-lg p-8 text-center shadow-sm border border-gray-200 dark:border-dark-gray-600/30">
          <div className="text-gray-500 dark:text-dark-gray-300 mb-4">You haven't joined any communities yet</div>
          <Link
            to="/community/discover"
            className="inline-block px-4 py-2 bg-Accent text-white rounded-md hover:bg-Accent/90 transition-colors"
          >
            Discover Communities
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
            {paginatedCommunities.map((community) => (
              <div
                key={community?._id}
                className="bg-white dark:bg-dark-primary rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-200 dark:border-dark-gray-600/30"
              >
                <div className="p-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-20 h-20 rounded-md overflow-hidden">
                      <img
                        src={community.profileImage || creopa}
                        alt={community.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h3 className="text-base font-semibold text-primary dark:text-dark-gray-100 truncate">
                          {community.name}
                        </h3>

                        <CommunityOptions
                          community={community}
                          loggedUser={loggedUser}
                          onDelete={handleDeleteCommunity}
                          onUpdate={handleUpdateCommunity}
                          onLeave={handleLeaveCommunity}
                        />
                      </div>

                      <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-dark-gray-300">
                        <Clock size={12} className="mr-1" />
                        <span>Description: <span className="wrap truncate">{community?.description}</span> </span>
                      </div>

                      <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-dark-gray-300">
                        <Lock size={12} className="mr-1" />
                        <span>{community.privacy} community</span>
                      </div>
                    </div>
                  </div>

                  <Link
                    to={`/community/${community?._id}`}
                    className="block w-full mt-4 py-2 px-4 bg-Accent hover:bg-Accent/90 text-white text-center rounded-md text-sm font-medium transition-colors"
                  >
                    View Community
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-8 gap-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-dark-primary-100 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous page"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Show 5 pages max with current page in the middle when possible
                  let pageNum
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-8 h-8 flex items-center justify-center rounded-md text-sm ${currentPage === pageNum
                          ? "bg-primary text-white dark:bg-primary"
                          : "hover:bg-gray-100 dark:hover:bg-dark-primary-100 text-gray-700 dark:text-dark-gray-300"
                        }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-dark-primary-100 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next page"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// Custom dropdown menu component
function CommunityOptions({ community, loggedUser, onDelete, onUpdate, onLeave }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 rounded-full hover:bg-gray-100 text-black transition-colors"
      >
        <MoreHorizontal size={16} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 rounded-md shadow-lg bg-white dark:bg-dark-primary-100 ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1">
            {loggedUser?.id === community.creator?._id ? (
              <>
                <button
                  onClick={() => {
                    onDelete(community?._id)
                    setIsOpen(false)
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-dark-primary"
                >
                  <Trash size={16} className="mr-2" />
                  Delete Community
                </button>
                <div className="border-t border-gray-200 dark:border-dark-gray-600/30 my-1"></div>
                <button
                  onClick={() => {
                    onUpdate(community?._id)
                    setIsOpen(false)
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-dark-gray-300 hover:bg-gray-100 dark:hover:bg-dark-primary"
                >
                  <Edit size={16} className="mr-2" />
                  Update Community
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  onLeave(community?._id)
                  setIsOpen(false)
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-dark-primary"
              >
                <LogOut size={16} className="mr-2" />
                Leave Community
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default CommunitiesJoinedPage

