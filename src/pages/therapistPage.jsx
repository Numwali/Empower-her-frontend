import { useState, useEffect } from "react"
import { fetchTherapies, fetchUsers, setSelectedTherapist } from "../redux/slices/users/userSlice"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import avatar from "../assets/images/profile.png"
import { useGetAllUsersQuery } from "../redux/services/users/users-apis"
import { useCreateConversationMutation } from "../redux/services/chat/chat-api"
import { toast } from "react-toastify"
import BookingModal from "../components/bookingModal/bookingModal"

const TherapistPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { therapies } = useSelector((state) => state.users)
  const { user } = useSelector((state) => state.user)
  const { data, error, isLoading } = useGetAllUsersQuery()
  const [createConversation] = useCreateConversationMutation()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTherapist, setSelectedTherapistState] = useState(null)
  const [expandedInterests, setExpandedInterests] = useState({})
  const [searchTerm, setSearchTerm] = useState("")

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(9) // 3 cards per row × 3 rows

  useEffect(() => {
    if (data) {
      const therapistes = data?.filter((user) => user?.role === "therapist")
      therapistes.sort((a, b) => a.firstname.toLowerCase().localeCompare(b.firstname.toLowerCase()))
      dispatch(fetchUsers(data))
      dispatch(fetchTherapies(therapistes))
    }
  }, [data, dispatch])

  // Filter therapists based on search term
  const filteredTherapists = therapies.filter((therapist) => {
    const fullName = `${therapist.firstname} ${therapist.lastname}`.toLowerCase()
    const searchTermLower = searchTerm.toLowerCase()

    // Search by name
    if (fullName.includes(searchTermLower)) {
      return true
    }

    // Search by specialization/interests
    if (therapist.interests && therapist.interests.some(interest =>
      interest.toLowerCase().includes(searchTermLower)
    )) {
      return true
    }

    // Search by email
    if (therapist.email && therapist.email.toLowerCase().includes(searchTermLower)) {
      return true
    }

    return false
  })

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentTherapists = filteredTherapists.slice(indexOfFirstItem, indexOfLastItem)

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  // Change page
  const nextPage = () => {
    if (currentPage < Math.ceil(filteredTherapists.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const redirect = async (newUser) => {
    let response = null
    const res = await createConversation({
      senderId: user?.id,
      receiverId: newUser?._id,
    })
    if ("error" in res) {
      response = res.error.data.conversation
    } else {
      response = res.data.conversation
    }
    const newConversation = {
      conversation: {
        _id: response?._id,
        members: [
          {
            _id: newUser?._id,
            firstname: newUser?.firstname,
            lastname: newUser?.lastname,
            profileImage: newUser?.profileImage,
          },
          {
            _id: user?.id,
            firstname: user?.firstname,
            lastname: user?.lastname,
            profileImage: user.profileImage,
          },
        ],
      },
    }
    dispatch(setSelectedTherapist(newConversation))
    navigate("/chat")
  }

  const openBookingModal = (therapist) => {
    setSelectedTherapistState({
      ...therapist,
    })
    setIsModalOpen(true)
  }

  const handleBooking = () => {
    setIsModalOpen(false);
  };


  const calculateMatchPercentage = (userInterests, therapistInterests) => {
    if (!userInterests || !userInterests.length || !therapistInterests || !therapistInterests.length) {
      return 0;
    }

    // Count matching interests
    const matchingInterests = userInterests.filter(interest =>
      therapistInterests.includes(interest)
    );

    // Calculate percentage
    return Math.round((matchingInterests.length / userInterests.length) * 100);
  };

  return (
    <>
      <div className="bg-gray-100 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-primary mb-2">Our Therapists</h1>
          <div className="h-1 w-24 bg-Secondary mb-3"></div>
          <p className="text-gray-600 mb-8 max-w-3xl">
            Browse our qualified therapists and find the perfect match for your mental health journey. You can book a
            session or start a conversation directly.
          </p>

          {/* Search Bar */}
          <div className="flex justify-center mb-6">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search by name, specialization, or email..."
                className="w-full py-2 text-center rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            
              {searchTerm && (
                <button
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  onClick={() => setSearchTerm("")}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-Secondary"></div>
            </div>
          ) : filteredTherapists.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-600 text-lg font-medium">No therapists found matching "{searchTerm}"</p>
              <button
                onClick={() => setSearchTerm("")}
                className="mt-4 text-primary hover:text-Secondary underline"
              >
                Clear search
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-1">
                {currentTherapists &&
                  currentTherapists.map((therapist) => {
                    return (
                      <div
                        key={therapist?._id}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
                      >
                        <div className="h-40 overflow-hidden bg-gray-200 relative">
                          <img
                            src={therapist.profileImage || avatar}
                            alt={`${therapist.firstname} ${therapist.lastname}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-primary bg-opacity-70 py-1 px-2">
                            <h2 className="text-white font-medium text-sm">
                              {therapist.firstname} {therapist.lastname}
                            </h2>
                          </div>
                        </div>
                        <div className="p-3 flex flex-col items-center flex-grow">

                          {user?.interests && user.interests.length > 0 && (
                            <div className="w-full mb-2">
                              <div className="flex justify-between items-center ">
                                <p className="text-[0.70rem] font-black text-black">Match:</p>
                                <p className="text-[0.70rem] font-medium">
                                  {calculateMatchPercentage(user?.interests, therapist.interests)}%
                                </p>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                  className="bg-green-600 h-2.5 rounded-full"
                                  style={{
                                    width: `${calculateMatchPercentage(user?.interests, therapist.interests)}%`,
                                    backgroundColor: `${calculateMatchPercentage(user?.interests, therapist.interests) > 70 ? '#10B981' : calculateMatchPercentage(user?.interests, therapist.interests) > 40 ? '#FBBF24' : '#EF4444'}`
                                  }}
                                ></div>
                              </div>
                            </div>
                          )}

                          <div className="flex flex-col w-full mb-2">
                            <p className="text-[0.70rem] mb-1 font-black text-black text-center">Specialization(s):</p>
                            <div className="flex flex-row flex-wrap justify-center">
                              {(expandedInterests[therapist._id]
                                ? therapist.interests
                                : therapist.interests.slice(0, 5)
                              ).map((interest, index) => (
                                <p
                                  key={index}
                                  className="bg-green-100 text-green-700 text-[0.60rem] px-2 py-1 rounded m-0.5"
                                >
                                  {interest}
                                </p>
                              ))}
                              {therapist.interests.length > 5 && (
                                <button
                                  onClick={() =>
                                    setExpandedInterests({
                                      ...expandedInterests,
                                      [therapist._id]: !expandedInterests[therapist._id],
                                    })
                                  }
                                  className="text-[0.60rem] px-2 py-1 rounded bg-gray-100 text-black hover:bg-gray-200 m-0.5"
                                >
                                  {expandedInterests[therapist._id]
                                    ? "Show Less"
                                    : `+${therapist.interests.length - 5} More`}
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-row space-x-2 w-full mt-auto">
                            <button
                              onClick={() => openBookingModal(therapist)}
                              className="w-full flex items-center justify-center bg-primary hover:bg-Secondary text-white py-1 px-2 rounded text-xs font-medium transition-colors duration-300"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              Book
                            </button>
                            <button
                              onClick={() => redirect(therapist)}
                              className="w-full flex items-center justify-center bg-white border border-primary text-primary hover:bg-Muted hover:bg-opacity-20 py-1 px-2 rounded text-xs font-medium transition-colors duration-300"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                />
                              </svg>
                              Chat
                            </button>
                          </div>
                          <div className="mt-2 text-xs text-gray-600 truncate w-full text-center">
                            <p className="flex items-center justify-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                              </svg>
                              {therapist.email}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </div>

              {/* Pagination with Next and Prev buttons */}
              {filteredTherapists.length > itemsPerPage && (
                <div className="flex justify-center mt-6">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={prevPage}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-md text-sm ${currentPage === 1
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-primary text-white hover:bg-Secondary"
                        }`}
                    >
                      &lt;
                    </button>

                    <div className="flex space-x-1">
                      {Array.from({ length: Math.ceil(filteredTherapists.length / itemsPerPage) }, (_, i) => i + 1).map(
                        (number) => (
                          <button
                            key={number}
                            onClick={() => paginate(number)}
                            className={`h-8 w-8 text-sm rounded-full flex items-center justify-center ${currentPage === number
                              ? "bg-primary text-white"
                              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-300"
                              }`}
                          >
                            {number}
                          </button>
                        )
                      )}
                    </div>

                    <button
                      onClick={nextPage}
                      disabled={currentPage === Math.ceil(filteredTherapists.length / itemsPerPage)}
                      className={`px-4 py-2 rounded-md text-sm ${currentPage === Math.ceil(filteredTherapists.length / itemsPerPage)
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-primary text-white hover:bg-Secondary"
                        }`}
                    >
                      &gt;
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedTherapist={selectedTherapist}
        onBooking={handleBooking}
      />
    </>
  )
}

export default TherapistPage