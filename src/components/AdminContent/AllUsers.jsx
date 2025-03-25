

import { useEffect, useState } from "react"
import axios from "axios"
import { Trash2 } from "lucide-react"

const AllUsers = () => {
    const [users, setUsers] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [userToDelete, setUserToDelete] = useState(null)

    // Simplified pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const [usersPerPage] = useState(5)

    const BACKEND_URL = `${process.env.REACT_APP_BACKEND_URL}/v1`

    const fetchUsers = async () => {
        const token = localStorage.getItem("token")
        try {
            setIsLoading(true)
            const response = await axios.get(`${BACKEND_URL}/user/allUsers`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            // Filter out the current admin user
            const currentUser = JSON.parse(localStorage.getItem("user"))
            const filteredUsers = response.data.filter((user) => user._id !== currentUser._id)
            setUsers(filteredUsers)
        } catch (err) {
            console.error("Failed to fetch users:", err)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    // Pagination logic
    const indexOfLastUser = currentPage * usersPerPage
    const indexOfFirstUser = indexOfLastUser - usersPerPage
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser)
    const totalPages = Math.ceil(users.length / usersPerPage)

    return (
        <div className="p-4 md:p-6 bg-white dark:bg-dark-primary-600 min-h-screen">
            <div className="w-full">
                <h1 className="text-xl md:text-2xl font-bold mb-6 text-primary dark:text-dark-gray-100 inline-block relative">
                    All Users
                    <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-Secondary"></span>
                </h1>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-Secondary"></div>
                    </div>
                ) : (
                    <>
                        {users.length === 0 ? (
                            <div className="text-center p-8 border border-gray-200 dark:border-dark-primary-100 rounded-lg text-dark-gray-600 dark:text-dark-gray-300">
                                No users found.
                            </div>
                        ) : (
                            <div className="w-full rounded-lg border border-gray-200 dark:border-dark-primary-100 overflow-hidden">
                                {/* Table with fixed layout and content scrolling */}
                                <div className="w-full overflow-x-auto">
                                    <table className="w-full table-fixed">
                                        <thead className="border-b border-gray-200 dark:border-dark-primary-100">
                                            <tr>
                                                <th className="py-3 px-6 text-left text-sm font-semibold text-primary dark:text-dark-gray-100 phone:text-xs w-[35%] whitespace-nowrap">
                                                    Name
                                                </th>
                                                <th className="py-3 px-6 text-left text-sm font-semibold text-primary dark:text-dark-gray-100 phone:text-xs w-[35%] whitespace-nowrap">
                                                    Email
                                                </th>
                                                <th className="py-3 px-2 text-left text-sm font-semibold text-primary dark:text-dark-gray-100 phone:text-xs w-[20%] whitespace-nowrap">
                                                    Role
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentUsers.map((user, index) => (
                                                <tr
                                                    key={user._id}
                                                    className={
                                                        index !== currentUsers.length - 1
                                                            ? "border-b border-t border-primary"
                                                            : ""
                                                    }
                                                >
                                                    <td className="py-2 px-2 text-sm text-black dark:text-dark-gray-300 phone:text-xs ">
                                                        {`${user.firstname || ""} ${user.lastname || ""}`.trim()}
                                                    </td>
                                                    <td className="py-2 px-2 text-sm text-black dark:text-dark-gray-300 phone:text-xs ">
                                                        {user.email}
                                                    </td>
                                                    <td className="py-2 px-2 text-sm text-left text-black dark:text-dark-gray-300 phone:text-xs wrap">
                                                        {user.role}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="px-6 py-4 border-t border-gray-200 dark:border-dark-primary-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                                    <div className="text-sm text-dark-gray-600 dark:text-dark-gray-300">
                                        Total users: <span className="font-semibold text-black">{users.length}</span>
                                    </div>

                                    {/* Simplified circular pagination */}
                                    {totalPages > 1 && (
                                        <div className="flex items-center justify-center gap-2 flex-wrap flex-row sm:flex-col">
                                            {/* Previous Page Button */}
                                            <button
                                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                                disabled={currentPage === 1}
                                                className={`w-5 h-5 flex items-center justify-center rounded-full text-xs sm:text-sm ${currentPage === 1
                                                    ? "text-gray-300 cursor-not-allowed dark:text-dark-gray-600"
                                                    : "text-primary hover:bg-gray-100 dark:text-dark-gray-300 dark:hover:bg-dark-primary-100"
                                                    }`}
                                            >
                                                &laquo;
                                            </button>

                                            {/* Page Numbers */}
                                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                // For more than 5 pages, show first, last, current, and neighbors
                                                let pageNum;
                                                if (totalPages <= 5) {
                                                    pageNum = i + 1;
                                                } else if (currentPage <= 3) {
                                                    pageNum = i + 1;
                                                } else if (currentPage >= totalPages - 2) {
                                                    pageNum = totalPages - 4 + i;
                                                } else {
                                                    pageNum = currentPage - 2 + i;
                                                }

                                                return (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => setCurrentPage(pageNum)}
                                                        className={`w-5 h-5 flex items-center justify-center rounded-full text-xs sm:text-sm ${currentPage === pageNum
                                                            ? "bg-Secondary text-white"
                                                            : "hover:bg-gray-100 dark:hover:bg-dark-primary-100 text-primary dark:text-dark-gray-300"
                                                            }`}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                );
                                            })}

                                            {/* Next Page Button */}
                                            <button
                                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                                disabled={currentPage === totalPages}
                                                className={`w-5 h-5 flex items-center justify-center rounded-full text-xs sm:text-sm ${currentPage === totalPages
                                                    ? "text-gray-300 cursor-not-allowed dark:text-dark-gray-600"
                                                    : "text-primary hover:bg-gray-100 dark:text-dark-gray-300 dark:hover:bg-dark-primary-100"
                                                    }`}
                                            >
                                                &raquo;
                                            </button>
                                        </div>
                                    )}

                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

        </div>
    )
}

export default AllUsers