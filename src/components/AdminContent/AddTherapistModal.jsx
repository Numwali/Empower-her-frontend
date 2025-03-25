import { useState } from "react"
import { toast } from "react-toastify"
import axios from "axios"
import { X } from "lucide-react"
import Specializations from "./Specializations"

const AddTherapistModal = ({ onClose, onAddTherapist }) => {
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        username: "",
        gender: "",
        address: "",
        email: "",
        phone: "",
        password: "",
        interests: [],
        confirm_password: "",
        role: "therapist",
        age: "",
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const BACKEND_URL = `${process.env.REACT_APP_BACKEND_URL}/v1`

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Form validation
        if (formData.password !== formData.confirm_password) {
            toast.error("Passwords do not match.")
            setIsSubmitting(false)
            return
        }

        if (
            !formData.firstname ||
            !formData.lastname ||
            !formData.email ||
            !formData.password ||
            !formData.confirm_password
        ) {
            toast.error("Please fill in all required fields.")
            setIsSubmitting(false)
            return
        }

        if (!formData.interests.length) {
            toast.error("Please select at least one specialization.")
            setIsSubmitting(false)
            return
        }

        // Prepare payload
        const payload = { ...formData };

        try {
            const token = localStorage.getItem("token")

            // Make API request
            const response = await axios.post(`${BACKEND_URL}/user/register`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            // Check the success flag in the response
            if (response.data && response.data.success === false) {
                toast.error(response.data.message || "Failed to add therapist.")
                return
            }

            // Handle success
            toast.success("Therapist added successfully!")

            // Only call these functions if the request was successful
            if (typeof onAddTherapist === 'function') {
                onAddTherapist()
            }
            onClose()
        } catch (err) {
            console.error("Failed to add therapist:", err)
            console.log(err)
            toast.error(err)
            // Better error handling
            if (err.response && err.response.data && err.response.data.error && err.response.data.error.code === 11000) {
                toast.error("Phone Number is already registered. Please use a different one.")
            } else if (err.response && err.response.status === 400) {
                toast.error(err.response.data.message || "Invalid input data. Please check your entries.")
            } else {
                toast.error("Failed to add therapist. Please try again later.")
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2">
            <div className="bg-white dark:bg-dark-primary-300 rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-4">
                    <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-200 dark:border-dark-primary-100">
                        <h3 className="text-lg font-bold text-primary dark:text-dark-gray-100">Add Therapist</h3>
                        <button
                            onClick={onClose}
                            className="text-red-600 font-black hover:text-primary dark:text-dark-gray-300 dark:hover:text-dark-gray-100 transition-colors"
                        >
                            <X className="w-4 h-4 text-red-600 font-black" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-2">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            <div className="space-y-1">
                                <label htmlFor="firstname" className="block text-xs font-medium text-gray-600 dark:text-dark-gray-300">
                                    First Name <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="firstname"
                                    name="firstname"
                                    placeholder="First name"
                                    value={formData.firstname}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-1.5 text-sm rounded-md border border-Accent focus:ring-1 focus:ring-Secondary focus:border-primary bg-gray-200 text-primary font-semibold"
                                />
                            </div>

                            <div className="space-y-1">
                                <label htmlFor="lastname" className="block text-xs font-medium text-gray-600 dark:text-dark-gray-300">
                                    Last Name <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="lastname"
                                    name="lastname"
                                    placeholder="Last name"
                                    value={formData.lastname}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-1.5 text-sm rounded-md border  border-Accent focus:ring-1 focus:ring-Secondary focus:border-primary bg-gray-200 text-primary font-semibold"
                                />
                            </div>

                            <div className="space-y-1">
                                <label htmlFor="username" className="block text-xs font-medium text-gray-600 dark:text-dark-gray-300">
                                    Username <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    placeholder="Username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-1.5 text-sm rounded-md border  border-Accent focus:ring-1 focus:ring-Secondary focus:border-primary bg-gray-200 text-primary font-semibold"
                                />
                            </div>

                            <div className="space-y-1">
                                <label htmlFor="gender" className="block text-xs font-medium text-gray-600 dark:text-dark-gray-300">
                                    Gender <span className="text-red-600">*</span>
                                </label>
                                <select
                                    id="gender"
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-1.5 text-sm rounded-md border  border-Accent focus:ring-1 focus:ring-Secondary focus:border-primary bg-gray-200 text-primary font-semibold appearance-none bg-no-repeat bg-right"
                                    style={{
                                        backgroundImage:
                                            'url(\'data:image/svg+xml;charset=US-ASCII,<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg"><path d="M5 8l5 5 5-5z" fill="%23555"/></svg>\')',
                                        backgroundPosition: "right 0.5rem center",
                                        backgroundSize: "1em 1em",
                                    }}
                                >
                                    <option value="" disabled>Select</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label htmlFor="email" className="block text-xs font-medium text-gray-600 dark:text-dark-gray-300">
                                    Email <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Email address"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-1.5 text-sm rounded-md border  border-Accent focus:ring-1 focus:ring-Secondary focus:border-primary bg-gray-200 text-primary font-semibold"
                                />
                            </div>

                            <div className="space-y-1">
                                <label htmlFor="phone" className="block text-xs font-medium text-gray-600 dark:text-dark-gray-300">
                                    Phone <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    placeholder="Phone number"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-1.5 text-sm rounded-md border  border-Accent focus:ring-1 focus:ring-Secondary focus:border-primary bg-gray-200 text-primary font-semibold"
                                />
                            </div>

                            <div className="space-y-1">
                                <label htmlFor="address" className="block text-xs font-medium text-gray-600 dark:text-dark-gray-300">
                                    Address <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    placeholder="Address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-1.5 text-sm rounded-md border  border-Accent focus:ring-1 focus:ring-Secondary focus:border-primary bg-gray-200 text-primary font-semibold"
                                />
                            </div>

                            <div className="space-y-1">
                                <label htmlFor="age" className="block text-xs font-medium text-gray-600 dark:text-dark-gray-300">
                                    Date of Birth <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="date"
                                    id="age"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-1.5 text-sm rounded-md border  border-Accent focus:ring-1 focus:ring-Secondary focus:border-primary bg-gray-200 text-primary font-semibold"
                                />
                            </div>

                            <div className="space-y-1">
                                <label htmlFor="password" className="block text-xs font-medium text-gray-600 dark:text-dark-gray-300">
                                    Password <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-1.5 text-sm rounded-md border  border-Accent focus:ring-1 focus:ring-Secondary focus:border-primary bg-gray-200 text-primary font-semibold"
                                />
                            </div>

                            <div className="space-y-1">
                                <label htmlFor="confirm_password" className="block text-xs font-medium text-gray-600 dark:text-dark-gray-300">
                                    Confirm Password <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="password"
                                    id="confirm_password"
                                    name="confirm_password"
                                    placeholder="Confirm password"
                                    value={formData.confirm_password}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-1.5 text-sm rounded-md border border-Accent focus:ring-1 focus:ring-Secondary focus:border-primary bg-gray-200 text-primary font-semibold"
                                />
                            </div>

                            <div className="space-y-1 md:col-span-3">
                                <label htmlFor="interests" className="block text-xs font-medium text-gray-600 dark:text-dark-gray-300">
                                    Specialization <span className="text-red-600">*</span>
                                </label>
                                <Specializations
                                    value={formData.interests}
                                    onChange={(interests) =>
                                        setFormData((prev) => ({ ...prev, interests }))
                                    }
                                    hasError={!formData.interests.length}
                                    errorId="interests-error"
                                />
                                {!formData.interests.length && (
                                    <p className="mt-1 text-red-500 text-sm">Please select at least one specialization.</p>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-4 pt-2 border-t border-gray-200 dark:border-dark-primary-100">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-3 py-1.5 text-xs rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 dark:border-dark-primary-100 dark:text-dark-gray-300 dark:hover:bg-dark-primary-100 transition-colors focus:outline-none focus:ring-1 focus:ring-gray-300 dark:focus:ring-dark-primary-100"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-3 py-1.5 text-xs rounded-md bg-Secondary hover:bg-Secondary/90 text-white transition-colors focus:outline-none focus:ring-1 focus:ring-Secondary focus:ring-offset-1 dark:focus:ring-offset-dark-primary-300"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Adding..." : "Add Therapist"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddTherapistModal