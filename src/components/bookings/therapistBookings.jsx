"use client"

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { toast } from "react-toastify"
import axios from "axios"
import avatar from "../../assets/images/profile.png"

const TherapistSessions = () => {
  const { user } = useSelector((state) => state.user)
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [updatedStartDate, setUpdatedStartDate] = useState("")
  const [updatedStartTime, setUpdatedStartTime] = useState("")
  const [updatedEndDate, setUpdatedEndDate] = useState("")
  const [updatedEndTime, setUpdatedEndTime] = useState("")
  const [activeTab, setActiveTab] = useState("all") // 'all', 'pending', 'confirmed', 'completed', 'canceled'

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(8)

  // Fetch appointments
  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/v1/appointment/provider`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setAppointments(response.data.appointments)
      setLoading(false)
    } catch (error) {
      console.log("Failed to fetch appointments: " + error.message)
      setLoading(false)
    }
  }

  // Handle appointment status updates (accept/reject/complete)
  const handleStatusUpdate = async (appointmentId, status) => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/v1/appointment/${appointmentId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (response.status === 200) {
        let statusMessage = ""
        if (status === "confirmed") statusMessage = "accepted"
        else if (status === "completed") statusMessage = "marked as completed"
        else statusMessage = status

        toast.success(`Appointment ${statusMessage}`)
        fetchAppointments() // Refresh the list
      }
    } catch (error) {
      toast.error(`Failed to update appointment: ${error.message}`)
    }
  }

  // Open update modal with appointment data
  const openUpdateModal = (appointment) => {
    setSelectedAppointment(appointment)

    // Format dates and times for the form
    if (appointment.start) {
      const startDate = new Date(appointment.start)
      setUpdatedStartDate(startDate.toISOString().split("T")[0])
      setUpdatedStartTime(startDate.toTimeString().slice(0, 5))
    }

    if (appointment.end) {
      const endDate = new Date(appointment.end)
      setUpdatedEndDate(endDate.toISOString().split("T")[0])
      setUpdatedEndTime(endDate.toTimeString().slice(0, 5))
    }

    setIsUpdateModalOpen(true)
  }

  // Handle appointment time update
  const handleTimeUpdate = async () => {
    try {
      if (!selectedAppointment) return

      // Validate inputs
      if (!updatedStartDate || !updatedStartTime || !updatedEndDate || !updatedEndTime) {
        toast.error("Please fill in all date and time fields")
        return
      }

      // Validate that end time is after start time
      const startDateTime = new Date(`${updatedStartDate}T${updatedStartTime}`)
      const endDateTime = new Date(`${updatedEndDate}T${updatedEndTime}`)

      if (endDateTime <= startDateTime) {
        toast.error("End time must be after start time")
        return
      }

      const token = localStorage.getItem("token")
      const startFormatted = `${updatedStartDate}T${updatedStartTime}:00`
      const endFormatted = `${updatedEndDate}T${updatedEndTime}:00`

      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/v1/appointment/${selectedAppointment._id}/time`,
        {
          start: startFormatted,
          end: endFormatted,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (response.status === 200) {
        toast.success("Appointment time updated successfully")
        setIsUpdateModalOpen(false)
        fetchAppointments() // Refresh the list
      }
    } catch (error) {
      toast.error("Failed to update appointment time: " + error.message)
    }
  }

  // Format date for display
  const formatDateTime = (dateString) => {
    if (!dateString) return "Not scheduled"

    const date = new Date(dateString)
    const options = { weekday: "short", month: "short", day: "numeric", year: "numeric" }
    const timeOptions = { hour: "2-digit", minute: "2-digit" }

    return `${date.toLocaleDateString("en-US", options)} at ${date.toLocaleTimeString("en-US", timeOptions)}`
  }

  // Check if appointment is today
  const isToday = (dateString) => {
    if (!dateString) return false

    const today = new Date()
    const appointmentDate = new Date(dateString)
    return (
      appointmentDate.getDate() === today.getDate() &&
      appointmentDate.getMonth() === today.getMonth() &&
      appointmentDate.getFullYear() === today.getFullYear()
    )
  }

  // Check if appointment is in the past
  const isPast = (dateString) => {
    if (!dateString) return false

    const now = new Date()
    const appointmentDate = new Date(dateString)
    return appointmentDate < now
  }

  // Get status badge for appointment
  const getStatusBadge = (appointment) => {
    switch (appointment.status) {
      case "pending":
        return <span className="bg-yellow-50 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded">Pending</span>
      case "confirmed":
        if (isPast(appointment.end)) {
          return (
            <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-0.5 rounded">Needs Review</span>
          )
        }
        return isToday(appointment.start) ? (
          <span className="bg-Muted text-Secondary text-xs font-medium px-2 py-0.5 rounded">Today</span>
        ) : (
          <span className="bg-primary/10 text-primary text-xs font-medium px-2 py-0.5 rounded">Upcoming</span>
        )
      case "completed":
        return <span className="bg-green-800 text-green-100 text-xs font-medium px-2 py-0.5 rounded">Completed</span>
      case "canceled":
        return <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded">Canceled</span>
      default:
        return null
    }
  }

  // Filter appointments by status
  const filteredAppointments =
    activeTab === "all" ? appointments : appointments.filter((appointment) => appointment.status === activeTab)

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredAppointments.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage)

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-primary mb-6 inline-block relative pb-2">
        My Sessions
        <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-primary"></span>
      </h1>

      {/* Tab Navigation */}
      <div className="flex flex-wrap mb-6 border-b">
        <button
          className={`px-4 py-2 text-sm ${activeTab === "all" ? "border-b-2 border-primary text-primary font-medium" : "text-gray-600"}`}
          onClick={() => setActiveTab("all")}
        >
          All Sessions
        </button>
        <button
          className={`px-4 py-2 text-sm ${activeTab === "pending" ? "border-b-2 border-primary text-primary font-medium" : "text-gray-600"}`}
          onClick={() => setActiveTab("pending")}
        >
          Pending
        </button>
        <button
          className={`px-4 py-2 text-sm ${activeTab === "confirmed" ? "border-b-2 border-primary text-primary font-medium" : "text-gray-600"}`}
          onClick={() => setActiveTab("confirmed")}
        >
          Confirmed
        </button>
        <button
          className={`px-4 py-2 text-sm ${activeTab === "completed" ? "border-b-2 border-primary text-primary font-medium" : "text-gray-600"}`}
          onClick={() => setActiveTab("completed")}
        >
          Completed
        </button>
        <button
          className={`px-4 py-2 text-sm ${activeTab === "canceled" ? "border-b-2 border-primary text-primary font-medium" : "text-gray-600"}`}
          onClick={() => setActiveTab("canceled")}
        >
          Canceled
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-2 text-gray-600">Loading appointments...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-1">
            {currentItems.length > 0 ? (
              currentItems.map((appointment) => (
                <div
                  key={appointment._id}
                  className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow transition-shadow duration-300 border border-gray-100"
                >
                  <div className="p-4">
                    <div className="flex flex-col items-center justify-between mb-1">
                      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                        <img
                          src={appointment.userId?.profileImage || avatar}
                          alt={`${appointment.userId?.firstname || "User"} ${appointment.userId?.lastname || ""}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col justify-center items-center">
                        <h2 className="text-sm font-semibold text-gray-800">
                          {appointment.userId?.firstname || "User"} {appointment.userId?.lastname || ""}
                        </h2>
                        <p className="text-xs text-gray-500">{appointment.userId?.email || ""}</p>
                      </div>
                      <div>{getStatusBadge(appointment)}</div>
                    </div>

                    <div className="mb-2 text-xs text-gray-600 bg-gray-50 rounded-md p-2">
                      <div className="flex items-center mb-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 text-gray-500 mr-1"
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
                        <span className="font-medium">Start:</span> {formatDateTime(appointment.start)}
                      </div>
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 text-gray-500 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="font-medium">End:</span> {formatDateTime(appointment.end)}
                      </div>
                    </div>

                    {appointment.notes && (
                      <div className="mb-2 text-xs bg-primary/10 text-gray-600 p-2 rounded-md">
                        <p className="font-medium mb-1">Notes:</p>
                        <p>{appointment.notes}</p>
                      </div>
                    )}

                    {/* Status-specific action buttons */}
                    {appointment.status === "pending" ? (
                      <div className="flex space-x-2 mt-3">
                        <button
                          onClick={() => handleStatusUpdate(appointment._id, "confirmed")}
                          className="flex-1 bg-green-100 text-green-800 hover:bg-green-200 py-1.5 px-2 rounded text-xs font-medium transition-colors duration-200 flex items-center justify-center"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Accept
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(appointment._id, "canceled")}
                          className="flex-1 bg-red-100 text-red-800 hover:bg-red-200 py-1.5 px-2 rounded text-xs font-medium transition-colors duration-200 flex items-center justify-center"
                        >
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
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          Reject
                        </button>
                      </div>
                    ) : appointment.status === "confirmed" ? (
                      <div className="grid grid-cols-2 gap-2 mt-3">
                        <button
                          onClick={() => openUpdateModal(appointment)}
                          className="bg-primary/10 text-primary hover:bg-primary/20 py-1.5 px-2 rounded text-xs font-medium transition-colors duration-200 flex items-center justify-center"
                        >
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
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          Update Time
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(appointment._id, "completed")}
                          className="bg-green-200 text-green-600 hover:bg-green-200 py-1 px-2 rounded text-[0.50rem] font-medium transition-colors duration-200 flex items-center justify-center"
                        >
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
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          Mark Completed
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(appointment._id, "canceled")}
                          className="col-span-2 bg-red-100 text-red-800 hover:bg-red-200 py-1.5 px-2 rounded text-xs font-medium transition-colors duration-200 flex items-center justify-center"
                        >
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
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          Cancel Session
                        </button>
                      </div>
                    ) : (
                      <div className="flex mt-3">
                        {appointment.status === "completed" && (
                          <div className="w-full text-center bg-green-500 py-1.5 rounded text-xs text-white">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3 inline-block mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            Session Completed
                          </div>
                        )}
                        {appointment.status === "canceled" && (
                          <div className="w-full text-center bg-red-200 py-1.5 rounded text-xs text-red-800">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3 inline-block mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                            Session Canceled
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-10 bg-white rounded-lg shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto text-gray-400 mb-3"
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
                <p className="text-gray-600">No {activeTab !== "all" ? activeTab : ""} appointments found.</p>
                <p className="text-gray-500 text-sm mt-1">
                  {activeTab === "all"
                    ? "When users book appointments with you, they will appear here."
                    : `You don't have any ${activeTab} appointments at the moment.`}
                </p>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {filteredAppointments.length > itemsPerPage && (
            <div className="flex justify-center items-center mt-6 space-x-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`h-8 w-8 p-0 flex items-center justify-center rounded border ${currentPage === 1
                    ? "border-gray-200 text-gray-400 cursor-not-allowed"
                    : "border-gray-300 text-gray-600 hover:bg-gray-50"
                  }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="sr-only"> {'<'} </span>
              </button>

              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`h-8 w-8 p-0 flex items-center justify-center rounded text-sm ${currentPage === number
                        ? "bg-primary text-white"
                        : "border border-gray-300 text-gray-600 hover:bg-gray-50"
                      }`}
                  >
                    {number}
                  </button>
                ))}
              </div>

              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`h-8 w-8 p-0 flex items-center justify-center rounded border ${currentPage === totalPages
                    ? "border-gray-200 text-gray-400 cursor-not-allowed"
                    : "border-gray-300 text-gray-600 hover:bg-gray-50"
                  }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="sr-only"> {'>'} </span>
              </button>
            </div>
          )}
        </>
      )}

      {/* Update Time Modal */}
      {isUpdateModalOpen && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-3 border-b border-gray-200 z-10">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-primary text-center">Update Appointment Time</h3>
                <button onClick={() => setIsUpdateModalOpen(false)} className="text-red-400 hover:text-red-800">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-4">
              <div className="flex flex-col items-center mb-4">
                <img
                  src={selectedAppointment.userId?.profileImage || avatar}
                  alt={selectedAppointment.userId?.firstname || "User"}
                  className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 object-cover mb-2"
                />
                <p className="font-medium text-black">
                  {selectedAppointment.userId?.firstname || "User"} {selectedAppointment.userId?.lastname || ""}
                </p>
                <p className="text-xs text-gray-600">{selectedAppointment.userId?.email || ""}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={updatedStartDate}
                    onChange={(e) => setUpdatedStartDate(e.target.value)}
                    className="block cursor-pointer w-full rounded-md py-2 px-2 shadow-sm focus:border-primary focus:ring-primary text-center text-sm border border-gray-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={updatedStartTime}
                    onChange={(e) => setUpdatedStartTime(e.target.value)}
                    className="block cursor-pointer w-full rounded-md py-2 px-2 shadow-sm focus:border-primary focus:ring-primary text-center text-sm border border-gray-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={updatedEndDate}
                    onChange={(e) => setUpdatedEndDate(e.target.value)}
                    className="block cursor-pointer w-full rounded-md py-2 px-2 shadow-sm focus:border-primary focus:ring-primary text-center text-sm border border-gray-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input
                    type="time"
                    value={updatedEndTime}
                    onChange={(e) => setUpdatedEndTime(e.target.value)}
                    className="block cursor-pointer w-full rounded-md py-2 px-2 shadow-sm focus:border-primary focus:ring-primary text-center text-sm border border-gray-300"
                    required
                  />
                </div>
              </div>

              <p className="text-xs text-gray-500 mb-4">
                Note: When you update the appointment time, it will remain in its current status. Reschedule according
                to you and your client's availability.
              </p>

              <div className="pt-3 mt-4">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsUpdateModalOpen(false)}
                    className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleTimeUpdate}
                    className="px-4 py-2 rounded-md text-sm bg-primary hover:bg-Secondary text-white"
                  >
                    Update Time
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TherapistSessions

