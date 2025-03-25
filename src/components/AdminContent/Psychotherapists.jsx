import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Trash2, Plus } from "lucide-react";
import { toast } from "react-toastify";
import AddTherapistModal from "./AddTherapistModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

const Psychotherapists = () => {
    const [therapists, setTherapists] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [therapistToDelete, setTherapistToDelete] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [therapistsPerPage] = useState(3);

    const BACKEND_URL = `${process.env.REACT_APP_BACKEND_URL}/v1`;

    // Fetch therapists
    const fetchTherapists = useCallback(async () => {
        const token = localStorage.getItem("token");
        try {
            setIsLoading(true);
            setError(null);
            const response = await axios.get(`${BACKEND_URL}/user/allUsers`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const therapistsData = response.data.filter((user) => user.role === "therapist");
            setTherapists(therapistsData);
        } catch (err) {
            setError("Failed to fetch therapists. Please try again later.");
            toast.error("Failed to fetch therapists.");
            console.error("Failed to fetch therapists:", err);
        } finally {
            setIsLoading(false);
        }
    }, [BACKEND_URL]);

    useEffect(() => {
        fetchTherapists();
    }, [fetchTherapists]);

    // Pagination logic
    const indexOfLastTherapist = currentPage * therapistsPerPage;
    const indexOfFirstTherapist = indexOfLastTherapist - therapistsPerPage;
    const currentTherapists = therapists.slice(indexOfFirstTherapist, indexOfLastTherapist);
    const totalPages = Math.ceil(therapists.length / therapistsPerPage);

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Open delete confirmation modal
    const openDeleteModal = (therapist) => {
        setTherapistToDelete(therapist);
        setShowDeleteModal(true);
    };

    // Close modals
    const closeModals = () => {
        setShowAddModal(false);
        setShowDeleteModal(false);
        setTherapistToDelete(null);
    };

    return (
        <>
            <div className="p-4 md:p-6 bg-white dark:bg-dark-primary-600 min-h-screen">
                <div className="w-full">
                    <h1 className="text-xl md:text-2xl font-bold mb-6 text-primary  inline-block relative">
                        Psychotherapists
                        <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-Secondary"></span>
                    </h1>

                    {/* Add Therapist Button */}
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="mb-6 text-base px-2 py-2 bg-Secondary text-white rounded hover:bg-Accent transition-colors flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Therapist
                    </button>

                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-Secondary"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center p-8 border border-gray-200  rounded-lg text-red-600 dark:text-red-400">
                            {error}
                        </div>
                    ) : therapists.length === 0 ? (
                        <div className="text-center p-8 border border-gray-200  rounded-lg  ">
                            No therapists found.
                        </div>
                    ) : (
                        <div className="w-full rounded-lg border border-gray-200  overflow-hidden">
                            {/* Table */}
                            <div className="w-full overflow-x-auto">
                                <table className="w-full table-fixed">
                                    <thead className="border-b border-gray-200 ">
                                        <tr>
                                            <th className="py-3 px-6 text-left text-sm font-semibold text-primary  phone:text-xs w-[35%] whitespace-nowrap">
                                                Name
                                            </th>
                                            <th className="py-3 px-6 text-left text-sm font-semibold text-primary  phone:text-xs w-[35%] whitespace-nowrap">
                                                Email
                                            </th>
                                            <th className="py-3 px-2 text-left text-sm font-semibold text-primary  phone:text-xs w-[20%] whitespace-nowrap">
                                                Role
                                            </th>
                                            <th className="py-3 px-2 text-left text-sm font-semibold text-primary  phone:text-xs w-[10%] whitespace-nowrap">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentTherapists.map((therapist, index) => (
                                            <tr
                                                key={therapist._id}
                                                className={
                                                    index !== currentTherapists.length - 1
                                                        ? "border-b border-t border-primary"
                                                        : ""
                                                }
                                            >
                                                <td className="py-2 px-2 text-sm text-black  phone:text-xs ">
                                                    {`${therapist.firstname || ""} ${therapist.lastname || ""}`.trim()}
                                                </td>
                                                <td className="py-2 px-2 text-sm text-black  phone:text-xs ">
                                                    {therapist.email}
                                                </td>
                                                <td className="py-2 px-2 text-sm text-left text-black  phone:text-xs wrap">
                                                    {therapist.role}
                                                </td>
                                                <td className="py-2 px-2 text-left">
                                                    <button
                                                        onClick={() => openDeleteModal(therapist)}
                                                        className="p-2 text-red-600 hover:text-red-800 transition-colors focus:outline-none"
                                                        title="Delete"
                                                        aria-label="Delete therapist"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="px-6 py-4 border-t border-gray-200  flex flex-col sm:flex-row justify-between items-center gap-4">
                                <div className="text-sm  ">
                                    Total therapists: <span className="font-semibold text-black">{therapists.length}</span>
                                </div>

                                {/* Pagination Buttons */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-center gap-2 flex-wrap flex-row sm:flex-col">
                                        {/* Previous Page Button */}
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className={`w-5 h-5 flex items-center justify-center rounded-full text-xs sm:text-sm ${currentPage === 1
                                                ? "text-gray-300 cursor-not-allowed "
                                                : "text-primary hover:bg-gray-100  "
                                                }`}
                                            aria-label="Previous page"
                                        >
                                            &laquo;
                                        </button>

                                        {/* Page Numbers */}
                                        {Array.from({ length: totalPages }, (_, i) => (
                                            <button
                                                key={i + 1}
                                                onClick={() => handlePageChange(i + 1)}
                                                className={`w-5 h-5 flex items-center justify-center rounded-full text-xs sm:text-sm ${currentPage === i + 1
                                                    ? "bg-Secondary text-white"
                                                    : "hover:bg-gray-100  text-primary "
                                                    }`}
                                                aria-label={`Page ${i + 1}`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}

                                        {/* Next Page Button */}
                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className={`w-5 h-5 flex items-center justify-center rounded-full text-xs sm:text-sm ${currentPage === totalPages
                                                ? "text-gray-300 cursor-not-allowed "
                                                : "text-primary hover:bg-gray-100  "
                                                }`}
                                            aria-label="Next page"
                                        >
                                            &raquo;
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                    <DeleteConfirmationModal
                        onClose={closeModals}
                        therapist={therapistToDelete}
                        onDeleteTherapist={fetchTherapists}
                    />
                )}
            </div>
            {showAddModal && (
                <AddTherapistModal
                    onClose={closeModals}
                    onAddTherapist={fetchTherapists}
                />
            )}
        </>
    );
};

export default Psychotherapists;