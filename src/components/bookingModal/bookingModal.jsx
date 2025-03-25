import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import avatar from "../../assets/images/profile.png";
import axios from "axios";

const BookingModal = ({ isOpen, onClose, selectedTherapist, onBooking }) => {
    const [startDate, setStartDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endDate, setEndDate] = useState("");
    const [endTime, setEndTime] = useState("");
    const [notes, setNotes] = useState("");
    const [expandedInterests, setExpandedInterests] = useState({});
    const navigate = useNavigate();

    // Reset state when the modal is closed
    useEffect(() => {
        if (!isOpen) {
            setStartDate("");
            setStartTime("");
            setEndDate("");
            setEndTime("");
            setNotes("");
            setExpandedInterests({});
        }
    }, [isOpen]);

    if (!isOpen || !selectedTherapist) return null;

    const handleBooking = async () => {
        try {
            const token = localStorage.getItem("token");
            // Combine date and time into a single datetime string
            const startDateTime = `${startDate}T${startTime}:00`;
            const endDateTime = `${endDate}T${endTime}:00`;

            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/v1/appointment`,
                {
                    providerId: selectedTherapist._id,
                    start: startDateTime,
                    end: endDateTime,
                    notes,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 201) {
                toast.success(`Appointment booked with ${selectedTherapist.firstname} ${selectedTherapist.lastname}`);
                onBooking();
                onClose();
                navigate("/userbooking");
            }
        } catch (error) {
            toast.error("Failed to book appointment: " + error.message);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white p-3 border-b border-gray-200 z-10">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-primary text-center">
                            Book Appointment
                        </h3>
                        <button onClick={onClose} className="text-red-400 hover:text-red-800">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="p-4">
                    <div className="flex flex-col items-center ">
                        <img
                            src={selectedTherapist.profileImage || avatar}
                            alt={selectedTherapist.firstname}
                            className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 object-cover"
                        />
                        <p className="font-medium text-black">{selectedTherapist.firstname} {selectedTherapist.lastname}</p>
                        <p className="text-xs text-gray-600">{selectedTherapist.email}</p>
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex flex-row flex-wrap justify-center">
                            {(expandedInterests[selectedTherapist._id]
                                ? selectedTherapist.interests
                                : selectedTherapist.interests.slice(0, 5)
                            ).map((interest, index) => (
                                <p
                                    key={index}
                                    className="bg-green-100 text-green-700 text-[0.60rem] px-2 py-1 rounded m-0.5"
                                >
                                    {interest}
                                </p>
                            ))}
                            {selectedTherapist.interests.length > 5 && (
                                <button
                                    onClick={() =>
                                        setExpandedInterests({
                                            ...expandedInterests,
                                            [selectedTherapist._id]: !expandedInterests[selectedTherapist._id],
                                        })
                                    }
                                    className="text-[0.60rem] px-2 py-1 rounded bg-gray-100 text-black hover:bg-gray-200 m-0.5"
                                >
                                    {expandedInterests[selectedTherapist._id]
                                        ? "Show Less"
                                        : `+${selectedTherapist.interests.length - 5} More`}
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="block cursor-pointer w-full rounded-md py-2 px-2 shadow-sm focus:border-primary focus:ring-primary text-center text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                            <input
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="block cursor-pointer w-full rounded-md py-2 px-2 shadow-sm focus:border-primary focus:ring-primary text-center text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="block cursor-pointer w-full rounded-md py-2 px-2 shadow-sm focus:border-primary focus:ring-primary text-center text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                            <input
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className="block cursor-pointer w-full rounded-md py-2 px-2 shadow-sm focus:border-primary focus:ring-primary text-center text-sm"
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add any details about your appointment..."
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary text-sm text-center"
                            rows="3"
                        />
                    </div>

                    <div className="pt-3 mt-4">
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleBooking}
                                className="px-4 py-2 rounded-md text-sm bg-primary hover:bg-Secondary text-white"
                            >
                                Book Session
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingModal;