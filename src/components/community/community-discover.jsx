
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { useDispatch, useSelector } from "react-redux"
import { ChevronLeft, ChevronRight, Search, Users } from "lucide-react"
import creopa from "../../assets/images/community.png";
import { useGetCommunitiesQuery, useJoinCommunityMutation } from "../../redux/services/community/community-api"
import { fetchCommunities } from "../../redux/slices/community/community"

const CommunityDiscover = () => {
  const dispatch = useDispatch()
  // Get communities stored in states
  const { communities } = useSelector((state) => state.communities)

  // Redux query fetch all communities
  const { data: communitiesData, isLoading: isCommunityLoading } = useGetCommunitiesQuery()

  // Redux mutation -join a community
  const [joinCommunity] = useJoinCommunityMutation()

  const [search, setSearch] = useState("")
  const [filteredCommunities, setFilteredCommunities] = useState([])
  const [loadingMap, setLoadingMap] = useState({})

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const communitiesPerPage = 8
  const [paginatedCommunities, setPaginatedCommunities] = useState([])
  const [totalPages, setTotalPages] = useState(0)

  // Store fetched data communites in state
  useEffect(() => {
    if (communitiesData) {
      dispatch(fetchCommunities(communitiesData))
    }
  }, [communitiesData, dispatch])

  // Filter communities based on search term
  useEffect(() => {
    if (communities) {
      const filtered = search
        ? communities.communities.filter((community) => community.name.toLowerCase().includes(search.toLowerCase()))
        : communities.communities

      setFilteredCommunities(filtered)
      setTotalPages(Math.ceil(filtered?.length / communitiesPerPage))
      setCurrentPage(1) // Reset to first page on new search
    }
  }, [communities, search])

  // Handle pagination
  useEffect(() => {
    if (filteredCommunities) {
      const indexOfLastCommunity = currentPage * communitiesPerPage
      const indexOfFirstCommunity = indexOfLastCommunity - communitiesPerPage
      setPaginatedCommunities(filteredCommunities.slice(indexOfFirstCommunity, indexOfLastCommunity))
    }
  }, [filteredCommunities, currentPage])

  const handleJoinCommunity = async ({ id }) => {
    setLoadingMap((prevLoadingMap) => ({
      ...prevLoadingMap,
      [id]: true,
    }))

    try {
      const { community, message } = await joinCommunity(id).unwrap()
      if (message) {
        toast.success(message)
      } else if (community) {
        toast.success(`You joined ${community.name}`)
      }
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong.")
    }

    setTimeout(() => {
      setLoadingMap((prevLoadingMap) => ({
        ...prevLoadingMap,
        [id]: false,
      }))
    }, 1000)
  }

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex flex-col items-center justify-center mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-primary mb-4">Discover Communities</h1>

        <div className="w-full max-w-md relative mb-8">
          <div className="relative">
            <input
              type="search"
              placeholder="Search communities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-sm px-4 py-2.5 pr-10 rounded-full bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-Accent/50"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600">
              <Search size={18} />
            </div>
          </div>
        </div>
      </div>

      {isCommunityLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : filteredCommunities && filteredCommunities?.length === 0 ? (
        <div className="text-center py-12 text-gray-600">No communities found matching your search</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {paginatedCommunities &&
              paginatedCommunities.map((community) => (
                <div
                  key={community?._id}
                  className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col h-full border border-gray-200"
                >
                  <div className="h-36 overflow-hidden relative">
                    <img
                      src={community?.profileImage || creopa}
                      alt={community?.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>

                  <div className="p-4 flex-grow">
                    <h3 className="font-bold text-primary text-lg truncate">{community?.name}</h3>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{community?.description}</p>
                    <div className="flex items-center text-xs text-gray-600 mt-1.5">
                      <span className="truncate">
                        Created By: {community?.creator?.firstname} {community?.creator?.lastname}
                      </span>
                      <span className="ml-1 px-1.5 py-0.5 text-Secondary font-bold  text-[10px]">
                        [ {community?.creator?.role} ]
                      </span>
                    </div>

                    <div className="flex items-center mt-3 text-xs text-gray-600">
                      <Users size={14} className="mr-1" />
                      <span>{community?.members?.length} members</span>
                    </div>
                  </div>

                  <div className="px-4 pb-4 pt-0">
                    <button
                      onClick={() => handleJoinCommunity({ id: community?._id })}
                      disabled={loadingMap[community?._id]}
                      className="w-full py-2 px-3 rounded-md bg-Accent hover:bg-Accent/90 text-white text-sm font-medium transition-colors"
                    >
                      {loadingMap[community?._id] ? (
                        <span className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Loading...
                        </span>
                      ) : community.privacy === "private" ? (
                        "Request to join"
                      ) : (
                        "Join community"
                      )}
                    </button>
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
                className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
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
                      className={`w-8 h-8 flex items-center justify-center rounded-md text-sm ${currentPage === pageNum ? "bg-primary text-white" : "hover:bg-gray-100"
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
                className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
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

export default CommunityDiscover