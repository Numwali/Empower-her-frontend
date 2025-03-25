import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import JounalService from "../redux/services/features/jounal"
import { ChevronLeft, ChevronRight, Edit, Trash2, Plus, X } from "lucide-react"
import { MdOutlinePrivacyTip } from "react-icons/md";

const Journal = () => {
  const [activeTab, setActiveTab] = useState("my")
  const [journals, setJournals] = useState([])
  const [publicJournals, setPublicJournals] = useState([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [currentJournal, setCurrentJournal] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    emotions: "",
    actions: "",
    isPrivate: true,
  })

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [publicCurrentPage, setPublicCurrentPage] = useState(1)
  const itemsPerPage = 3

  // Fetch user's journals
  const fetchMyJournals = async () => {
    try {
      const response = await JounalService.getMyJounal()
      setJournals(response.data.journals)
    } catch (error) {
      console.error("Error fetching journals:", error)
    }
  }

  // Fetch public journals
  const fetchPublicJournals = async () => {
    try {
      const response = await JounalService.getPublicJounals()
      setPublicJournals(response.data.journals)
    } catch (error) {
      console.error("Error fetching public journals:", error)
    }
  }

  useEffect(() => {
    fetchMyJournals()
    fetchPublicJournals()
  }, [])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleAddJournal = async (e) => {
    e.preventDefault()
    try {
      const journalData = {
        ...formData,
        emotions: formData.emotions
          .split(",")
          .map((e) => e.trim())
          .filter(Boolean),
        actions: formData.actions
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean),
      }

      const response = await JounalService.addNewJounal(journalData)
      if (response.status !== 201) {
        toast.error(response.message)
        return
      }
      toast.success(response.data.message)
      setIsAddModalOpen(false)
      setFormData({
        title: "",
        content: "",
        emotions: "",
        actions: "",
        isPrivate: true,
      })
      fetchMyJournals()
    } catch (error) {
      console.error("Error adding journal:", error)
    }
  }

  const handleEditJournal = async (e) => {
    e.preventDefault()
    try {
      const journalData = {
        ...formData,
        emotions: formData.emotions
          .split(",")
          .map((e) => e.trim())
          .filter(Boolean),
        actions: formData.actions
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean),
      }

      const response = await JounalService.editJounal(currentJournal._id, journalData)
      if (response.status !== 200) {
        toast.error(response.message)
        return
      }
      toast.success(response.data.message)
      setIsEditModalOpen(false)
      fetchMyJournals()
      fetchPublicJournals()
    } catch (error) {
      console.error("Error updating journal:", error)
    }
  }

  const handleDeleteJournal = async () => {
    try {
      const response = await JounalService.deletejounal(currentJournal._id)
      if (response.status !== 200) {
        toast.error(response.message)
        return
      }
      toast.success(response.data.message)
      setIsDeleteModalOpen(false)
      fetchMyJournals()
    } catch (error) {
      console.error("Error deleting journal:", error)
    }
  }

  const openEditModal = (journal) => {
    setCurrentJournal(journal)
    setFormData({
      title: journal.title,
      content: journal.content,
      emotions: journal.emotions.join(", "),
      actions: journal.actions.join(", "),
      isPrivate: journal.isPrivate,
    })
    setIsEditModalOpen(true)
  }

  const openDeleteModal = (journal) => {
    setCurrentJournal(journal)
    setIsDeleteModalOpen(true)
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Pagination logic
  const indexOfLastMyJournal = currentPage * itemsPerPage
  const indexOfFirstMyJournal = indexOfLastMyJournal - itemsPerPage
  const currentJournals = journals.slice(indexOfFirstMyJournal, indexOfLastMyJournal)

  const indexOfLastPublicJournal = publicCurrentPage * itemsPerPage
  const indexOfFirstPublicJournal = indexOfLastPublicJournal - itemsPerPage
  const currentPublicJournals = publicJournals.slice(indexOfFirstPublicJournal, indexOfLastPublicJournal)

  const totalMyPages = Math.ceil(journals.length / itemsPerPage)
  const totalPublicPages = Math.ceil(publicJournals.length / itemsPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)
  const paginatePublic = (pageNumber) => setPublicCurrentPage(pageNumber)

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-2xl font-bold text-primary mb-8 relative">
        Journal Management
        <span className="absolute bottom-0 left-0 w-[10%] h-0.5 bg-primary"></span>
      </h1>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-4">
        <button
          className={`px-2 py-2 text-xs font-medium rounded-t-lg transition-colors ${activeTab === "my"
              ? "bg-primary text-white border-b-2 border-primary"
              : "text-gray-600 hover:text-primary hover:bg-gray-50"
            }`}
          onClick={() => setActiveTab("my")}
        >
          My Journals
        </button>
        <button
          className={`px-2 py-2 text-xs font-medium rounded-t-lg transition-colors ${activeTab === "public"
              ? "bg-primary text-white border-b-2 border-primary"
              : "text-gray-600 hover:text-primary hover:bg-gray-50"
            }`}
          onClick={() => setActiveTab("public")}
        >
          Public Journals
        </button>
      </div>

      {/* My Journals Tab */}
      {activeTab === "my" && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-primary">My Personal Journals</h2>
            <button
              className="bg-primary hover:bg-primary/90 text-white px-3 text-xs py-2 rounded-md flex items-center shadow-sm transition-colors"
              onClick={() => setIsAddModalOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Journal
            </button>
          </div>

          {journals.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-100 shadow-sm">
              <p className="text-gray-500 mb-4">You haven't created any journals yet.</p>
              <button
                className="bg-primary hover:bg-primary/90 text-white px-3 text-sm py-2 rounded-md shadow-sm transition-colors"
                onClick={() => setIsAddModalOpen(true)}
              >
                Create Your First Journal
              </button>
            </div>
          ) : (
            <>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {currentJournals.map((journal) => (
                  <div
                    key={journal._id}
                    className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow "
                  >
                    <div className="flex justify-between items-start">
                      <div className="w-[50%]">
                        <h3 className="text-[1rem] w-full font-semibold text-primary break-words mb-1">{journal.title}</h3>
                        <p className="text-sm text-gray-500 mb-2">{formatDate(journal.createdAt)}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          className="p-2 text-primary hover:bg-gray-100 rounded-full transition-colors"
                          onClick={() => openEditModal(journal)}
                          aria-label="Edit journal"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          className="p-2 text-red-500 hover:bg-gray-100 rounded-full transition-colors"
                          onClick={() => openDeleteModal(journal)}
                          aria-label="Delete journal"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-2">
                      <p className="line-clamp-3 flex flex-col text-black bg-gray-200 rounded-md pb-4 pt-1 px-2 mb-1">
                        <span className="text-dark-gray-300 text-sm underline">Content:</span>
                        {journal.content}
                      </p>

                      {journal.emotions && journal.emotions.length > 0 && (
                        <div className="flex flex-col gap-2 mb-1 bg-dark-gray-300 rounded-md py-2 px-4">
                          <span className="text-black text-sm underline">Emotions:</span>
                          {journal.emotions.map((emotion, index) => (
                            <span key={index} className="px-2 py-1 bg-Muted text-primary text-xs rounded">
                              {emotion}
                            </span>
                          ))}
                        </div>
                      )}

                      {journal.actions && journal.actions.length > 0 && (
                        <div className="flex flex-col bg-dark-gray-300 rounded-md py-2 px-4 gap-2">
                          <span className="text-black text-sm underline">Actions:</span>
                          {journal.actions.map((action, index) => (
                            <span key={index} className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded">
                              {action}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="mt-4 flex justify-between items-center">
                        <span
                          className="flex flex-row items-center justify-center text-xs px-2 py-1 rounded bg-gray-100 text-black font-black"
                        >
                          <MdOutlinePrivacyTip /> {journal.isPrivate ? "Private" : "Public"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination for My Journals */}
              {totalMyPages > 1 && (
                <div className="flex justify-center mt-6">
                  <nav className="flex items-center space-x-1">
                    <button
                      onClick={() => paginate(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className={`p-2 rounded-md ${currentPage === 1 ? "text-black cursor-not-allowed" : "text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>

                    {[...Array(totalMyPages)].map((_, index) => (
                      <button
                        key={index}
                        onClick={() => paginate(index + 1)}
                        className={`px-3 py-1 rounded-md ${currentPage === index + 1 ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-100"
                          }`}
                      >
                        {index + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => paginate(Math.min(totalMyPages, currentPage + 1))}
                      disabled={currentPage === totalMyPages}
                      className={`p-2 rounded-md ${currentPage === totalMyPages
                          ? "text-black cursor-not-allowed"
                          : "text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Public Journals Tab */}
      {activeTab === "public" && (
        <div>
          <h2 className="text-xl font-semibold text-primary mb-6">Public Journals</h2>

          {publicJournals.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-100 shadow-sm">
              <p className="text-gray-500">No public journals available.</p>
            </div>
          ) : (
            <>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {currentPublicJournals.map((journal) => (
                  <div
                    key={journal._id}
                    className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-primary mb-1">{journal.title}</h3>
                      <p className="text-sm text-gray-500 mb-3">{formatDate(journal.createdAt)}</p>
                    </div>

                    <div>
                      <p className="line-clamp-3 flex flex-col text-black bg-gray-200 rounded-md pb-4 pt-1 px-2 mb-1">
                        <span className="text-dark-gray-300 text-sm underline">Content:</span>
                        {journal.content}
                      </p>

                      {journal.emotions && journal.emotions.length > 0 && (
                        <div className="flex flex-col gap-2 mb-1 bg-dark-gray-300 rounded-md py-2 px-4">
                          <span className="text-black text-sm underline">Emotions:</span>
                          {journal.emotions.map((emotion, index) => (
                            <span key={index} className="px-2 py-1 bg-Muted text-primary text-xs rounded">
                              {emotion}
                            </span>
                          ))}
                        </div>
                      )}

                      {journal.actions && journal.actions.length > 0 && (
                        <div className="flex flex-col bg-dark-gray-300 rounded-md py-2 px-4 gap-2">
                          <span className="text-black text-sm underline">Actions:</span>
                          {journal.actions.map((action, index) => (
                            <span key={index} className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded">
                              {action}
                            </span>
                          ))}
                        </div>
                      )}

                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination for Public Journals */}
              {totalPublicPages > 1 && (
                <div className="flex justify-center mt-6">
                  <nav className="flex items-center space-x-1">
                    <button
                      onClick={() => paginatePublic(Math.max(1, publicCurrentPage - 1))}
                      disabled={publicCurrentPage === 1}
                      className={`p-2 rounded-md ${publicCurrentPage === 1 ? "text-black cursor-not-allowed" : "text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>

                    {[...Array(totalPublicPages)].map((_, index) => (
                      <button
                        key={index}
                        onClick={() => paginatePublic(index + 1)}
                        className={`px-3 py-1 rounded-md ${publicCurrentPage === index + 1 ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-100"
                          }`}
                      >
                        {index + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => paginatePublic(Math.min(totalPublicPages, publicCurrentPage + 1))}
                      disabled={publicCurrentPage === totalPublicPages}
                      className={`p-2 rounded-md ${publicCurrentPage === totalPublicPages
                          ? "text-black cursor-not-allowed"
                          : "text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Add Journal Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center" >
              <h3 className="text-xl font-semibold text-primary">Add New Journal</h3>
              <button
                className="text-gray-500 hover:text-gray-700 rounded-full p-1 hover:bg-gray-100"
                onClick={() => setIsAddModalOpen(false)}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-grow">
              <form onSubmit={handleAddJournal} className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="title">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter journal title"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="content">
                    Content
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    required
                    rows="5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Write your journal entry here..."
                  ></textarea>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="emotions">
                    Emotions (comma separated)
                  </label>
                  <input
                    type="text"
                    id="emotions"
                    name="emotions"
                    value={formData.emotions}
                    onChange={handleInputChange}
                    placeholder="happy, grateful, excited"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="actions">
                    Actions (comma separated)
                  </label>
                  <input
                    type="text"
                    id="actions"
                    name="actions"
                    value={formData.actions}
                    onChange={handleInputChange}
                    placeholder="exercise, meditate, read"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPrivate"
                    name="isPrivate"
                    checked={formData.isPrivate}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="isPrivate" className="ml-2 text-gray-700 text-sm">
                    Keep this journal private
                  </label>
                </div>
              </form>
            </div>

            <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 text-black bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                onClick={() => setIsAddModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddJournal}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                Save Journal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Journal Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-primary">Edit Journal</h3>
              <button
                className="text-gray-500 hover:text-gray-700 rounded-full p-1 hover:bg-gray-100"
                onClick={() => setIsEditModalOpen(false)}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-grow">
              <form onSubmit={handleEditJournal} className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="edit-title">
                    Title
                  </label>
                  <input
                    type="text"
                    id="edit-title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="edit-content">
                    Content
                  </label>
                  <textarea
                    id="edit-content"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    required
                    rows="5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="edit-emotions">
                    Emotions (comma separated)
                  </label>
                  <input
                    type="text"
                    id="edit-emotions"
                    name="emotions"
                    value={formData.emotions}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="edit-actions">
                    Actions (comma separated)
                  </label>
                  <input
                    type="text"
                    id="edit-actions"
                    name="actions"
                    value={formData.actions}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="edit-isPrivate"
                    name="isPrivate"
                    checked={formData.isPrivate}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="edit-isPrivate" className="ml-2 text-gray-700 text-sm">
                    Keep this journal private
                  </label>
                </div>
              </form>
            </div>

            <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 text-black bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleEditJournal}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                Update Journal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-center mb-4 text-red-500">
                <div className="bg-red-100 p-3 rounded-full">
                  <Trash2 className="h-8 w-8 text-red-500" />
                </div>
              </div>

              <h3 className="text-lg font-medium text-center text-gray-900 mb-2">Delete Journal</h3>
              <p className="text-center text-gray-600 mb-6">
                Are you sure you want to delete this journal? This action cannot be undone.
              </p>

              <div className="flex justify-center space-x-4">
                <button
                  type="button"
                  className="px-4 py-2 text-black bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                  onClick={handleDeleteJournal}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default Journal

