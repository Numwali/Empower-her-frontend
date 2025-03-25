import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import avatar from "../../assets/images/profile.png";

const UserBookings = () => {
    const { user } = useSelector((state) => state.user);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [appointmentsPerPage] = useState(6);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const navigate = useNavigate();

    // Fetch user appointments
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    `${process.env.REACT_APP_BACKEND_URL}/v1/appointment/user`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.data && response.data.appointments) {
                    // Sort appointments by status order: pending, confirmed, completed, canceled, expired
                    const sortedAppointments = sortAppointmentsByStatus(response.data.appointments);
                    setAppointments(sortedAppointments);
                }
            } catch (error) {
                console.log("Error fetching appointments:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchAppointments();
        }
    }, [user]);

    // Sort appointments by status priority
    const sortAppointmentsByStatus = (appointmentsArray) => {
        const now = new Date();

        // Helper function to determine if an appointment is expired
        const isExpired = (appointment) => {
            const startTime = appointment.start ? new Date(appointment.start) : null;
            return startTime && startTime < now && appointment.status !== "completed" && appointment.status !== "canceled";
        };

        // Helper function to get status priority (lower number = higher priority)
        const getStatusPriority = (appointment) => {
            if (appointment.status === "pending") return 1;
            if (appointment.status === "confirmed") return 2;
            if (appointment.status === "completed") return 3;
            if (appointment.status === "canceled") return 4;
            if (isExpired(appointment)) return 5;
            return 6; // Any other status would be lowest priority
        };

        return [...appointmentsArray].sort((a, b) => {
            return getStatusPriority(a) - getStatusPriority(b);
        });
    };

    // Handle deleting an appointment
    const handleDeleteAppointment = async (appointmentId) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(
                `${process.env.REACT_APP_BACKEND_URL}/v1/appointment/${appointmentId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Update appointments list after successful deletion
            setAppointments(appointments.filter(app => app._id !== appointmentId));
            toast.success("Appointment deleted successfully");
            setConfirmDelete(null);
        } catch (error) {
            toast.error("Failed to delete appointment");
        }
    };

    // Format date from ISO string
    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return "Not scheduled";

        const dateTime = new Date(dateTimeString);
        const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
        const timeOptions = { hour: '2-digit', minute: '2-digit' };

        return `${dateTime.toLocaleDateString('en-US', options)} at ${dateTime.toLocaleTimeString('en-US', timeOptions)}`;
    };

    // Calculate if session is today
    const isToday = (dateString) => {
        if (!dateString) return false;

        const today = new Date();
        const appointmentDate = new Date(dateString);

        return (
            appointmentDate.getDate() === today.getDate() &&
            appointmentDate.getMonth() === today.getMonth() &&
            appointmentDate.getFullYear() === today.getFullYear()
        );
    };

    // Get status badge
    const getStatusBadge = (appointment) => {
        const now = new Date();
        const startTime = appointment.start ? new Date(appointment.start) : null;

        if (appointment.status === "canceled") {
            return <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded">Canceled</span>;
        } else if (appointment.status === "completed") {
            return <span className="bg-green-700 text-green-100 text-xs font-medium px-2 py-0.5 rounded">Completed</span>;
        } else if (appointment.status === "confirmed") {
            return isToday(appointment.start) ? (
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">Today</span>
            ) : (
                <span className="bg-blue-100 text-primary text-xs font-medium px-2 py-0.5 rounded">Confirmed</span>
            );
        } else if (startTime && startTime < now) {
            return <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded">Expired</span>;
        } else {
            return <span className="bg-[#D473D4] text-white text-xs font-medium px-2 py-0.5 rounded">Pending</span>;
        }
    };

    // Get interests display
    const getInterests = (provider) => {
        if (!provider || !provider.interests || !provider.interests.length) {
            return "No specialties listed";
        }

        if (provider.interests.length <= 2) {
            return provider.interests.join(", ");
        }

        return `${provider.interests[0]}, ${provider.interests[1]}, etc......`;
    };

    // Pagination logic
    const indexOfLastAppointment = currentPage * appointmentsPerPage;
    const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
    const currentAppointments = appointments.slice(indexOfFirstAppointment, indexOfLastAppointment);
    const totalPages = Math.ceil(appointments.length / appointmentsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Empty state UI
    if (loading) {
        return (
            <div className="bg-gray-100 min-h-screen py-6 flex justify-center items-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-8 w-64 bg-gray-300 rounded mb-4"></div>
                    <div className="h-1 w-40 bg-gray-300 rounded-full mb-8"></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-2 w-full max-w-5xl">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-white rounded-lg h-48 w-full"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 min-h-screen py-4 md:py-6">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="mb-6">
                    <h1 className="text-xl md:text-2xl font-bold text-primary mb-2">My Appointments</h1>
                    <div className="h-1 w-40 bg-primary rounded-full"></div>
                </div>

                {appointments.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                        <div className="flex justify-center mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-700 mb-2">No Appointments Found</h3>
                        <p className="text-gray-500 mb-4">You don't have any scheduled therapy appointments yet.</p>
                        <button
                            onClick={() => navigate('/therapists')}
                            className="inline-flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-Secondary transition duration-150"
                        >
                            Find a Therapist
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-1 mb-6">
                            {currentAppointments.map((appointment) => (
                                <div
                                    key={appointment._id}
                                    className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
                                >
                                    <div className="p-4">
                                        <div className="flex items-center flex-col justify-between mb-1">
                                            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                                                <img
                                                    src={appointment.providerId?.profileImage || avatar}
                                                    alt={appointment.providerId?.firstname || "Provider"}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex items-center">
                                                <div>
                                                    <h2 className="text-base font-semibold text-gray-800 leading-tight">
                                                        Dr. {appointment.providerId?.firstname || "Unknown"} {appointment.providerId?.lastname || "Provider"}
                                                    </h2>
                                                    <p className="text-xs text-gray-600">
                                                        {getInterests(appointment.providerId)}
                                                    </p>
                                                </div>
                                            </div>
                                            {getStatusBadge(appointment)}
                                        </div>
                                        <div className="mb-1 text-sm text-gray-600">
                                            <div className="flex items-center mb-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span>Start: {formatDateTime(appointment.start)}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>End: {formatDateTime(appointment.end)}</span>
                                            </div>
                                        </div>

                                        {appointment.notes && (
                                            <div className="mb-1 p-2 bg-gray-100 rounded text-xs text-gray-600">
                                                <p className="font-semibold mb-1">Notes:</p>
                                                <p>{appointment.notes}</p>
                                            </div>
                                        )}

                                        {(appointment.status === "pending" || appointment.status === "confirmed") && (
                                            <div className="flex space-x-2">
                                                {confirmDelete === appointment._id ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleDeleteAppointment(appointment._id)}
                                                            className="flex-1 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white py-2 px-2 rounded text-xs font-medium transition-colors duration-200"
                                                        >
                                                            Confirm Delete
                                                        </button>
                                                        <button
                                                            onClick={() => setConfirmDelete(null)}
                                                            className="flex-1 flex items-center justify-center bg-gray-300 hover:bg-gray-600 text-black py-2 px-2 rounded text-xs font-medium transition-colors duration-200"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button
                                                        onClick={() => setConfirmDelete(appointment._id)}
                                                        className="w-[50%] flex-1 flex items-center justify-center bg-primary hover:bg-Secondary text-white py-2 px-3 mt-1 rounded text-xs font-medium transition-colors duration-200"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                        Cancel Appointment
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center mt-6 mb-8">
                                <nav className="flex items-center">
                                    <button
                                        onClick={() => paginate(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                        className={`px-3 py-1 rounded-l-md border ${currentPage === 1 ? 'bg-gray-100 text-black cursor-not-allowed' : 'bg-white text-primary hover:bg-gray-600'
                                            }`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </button>

                                    {[...Array(totalPages)].map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => paginate(index + 1)}
                                            className={`px-3 py-1 border-t border-b ${currentPage === index + 1
                                                ? 'bg-primary text-white'
                                                : 'bg-white text-gray-600 hover:bg-black'
                                                }`}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                                        disabled={currentPage === totalPages}
                                        className={`px-3 py-1 rounded-r-md border ${currentPage === totalPages ? 'bg-gray-100 text-black cursor-not-allowed' : 'bg-white text-primary hover:bg-gray-600'
                                            }`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </nav>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default UserBookings;