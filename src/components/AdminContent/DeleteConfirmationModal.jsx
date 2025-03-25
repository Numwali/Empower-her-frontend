import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const DeleteConfirmationModal = ({ onClose, therapist, onDeleteTherapist }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const BACKEND_URL = `${process.env.REACT_APP_BACKEND_URL}/v1`;

    const handleDelete = async () => {
        if (!therapist || !therapist._id) {
            toast.error("Invalid therapist data");
            return;
        }

        setIsDeleting(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.delete(`${BACKEND_URL}/user/delete/${therapist._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data && response.data.success === false) {
                toast.error(response.data.message || "Failed to delete therapist.");
                return;
            }
            toast.success("Therapist deleted successfully");
            if (typeof onDeleteTherapist === 'function') {
                onDeleteTherapist()
            }
            onClose(); 
        } catch (err) {
            console.error("Failed to delete therapist:", err);
            if (err.response && err.response.data && err.response.data.message) {
                toast.error(err.response.data.message);
            } else {
                toast.error("Failed to delete therapist. Please try again later.");
            }
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-dark-primary-300 rounded-lg shadow-lg max-w-md w-full">
                <div className="p-6">
                    <h3 className="text-lg font-bold text-primary dark:text-dark-gray-100 mb-4">Confirm Deletion</h3>
                    <p className="text-dark-gray-600 dark:text-dark-gray-300 mb-6">
                        Are you sure you want to delete therapist{" "}
                        <span className="font-medium">
                            {therapist && `${therapist.firstname} ${therapist.lastname}`}
                        </span>
                        ? This action cannot be undone.
                    </p>
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 dark:border-dark-primary-100 text-dark-gray-600 dark:text-dark-gray-300 rounded hover:bg-gray-100 dark:hover:bg-dark-primary-100 transition-colors"
                            disabled={isDeleting}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;