import { useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { Lock, Users, Image, FileText, Info } from "lucide-react"
import creopa from "../../assets/images/community.png";

import { useGetCommunityQuery } from "../../redux/services/community/community-api"
import { fetchCommunity } from "../../redux/slices/community/community"

export default function CommunityView({ children }) {
  const dispatch = useDispatch()
  const { communityId } = useParams()

  // Get communities stored in states
  const { community } = useSelector((state) => state.communities)

  // Redux query fetch a community
  const { data: communityData } = useGetCommunityQuery(communityId)

  // Store fetched data community in states
  useEffect(() => {
    if (communityData) {
      dispatch(fetchCommunity(communityData?.community))
    }
  }, [communityData, dispatch])

  return (
    <div className="flex flex-col w-full">
      {/* Banner and Community Info */}
      <div className="bg-white dark:!bg-dark-primary rounded-lg shadow-sm overflow-hidden">
        {/* Banner Image */}
        <div className="relative h-[120px] md:h-[180px] lg:h-[240px] w-full overflow-hidden">
          <img
            src={community.profileImage || creopa}
            alt={`${community?.name} Cover`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>

          {/* Community Name Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h1 className="text-xl md:text-2xl font-bold drop-shadow-sm">{community?.name} Community</h1>
          </div>
        </div>

        {/* Community Info */}
        <div className="px-4 py-3 border-b border-gray-200 dark:border-dark-gray-600/50">
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-dark-gray-300">
            <div className="flex items-center gap-1.5">
              <Lock size={16} className="text-primary" />
              <span>{community?.privacy} community</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users size={16} className="text-primary" />
              <span>{community?.members?.length} member(s)</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-3 text-center">
          <NavLink to={`./posts`} icon={<FileText size={16} />} label="Posts" />
          <NavLink to="./members" icon={<Users size={16} />} label="Members" />
          <NavLink to="./about" icon={<Info size={16} />} label="About" />
        </div>
      </div>

      {/* Content Area */}
      <div className="w-full max-w-4xl mx-auto mt-6 px-4">{children}</div>
    </div>
  )
}

// Navigation Link Component
function NavLink({ to, icon, label }) {
  return (
    <Link
      to={to}
      className="flex flex-col items-center justify-center py-3 px-2 text-gray-600 hover:text-primary dark:text-dark-gray-300 dark:hover:text-Accent transition-colors duration-200 relative group"
    >
      <div className="mb-1">{icon}</div>
      <span className="text-sm font-medium">{label}</span>
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-center"></div>
    </Link>
  )
}

