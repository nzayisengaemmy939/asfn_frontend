import React from 'react'

const DeleteUser = ({setShowConfirmModal,handleDeleteConfirmed}) => {
  return (
    <div>
      <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
                  <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full space-y-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                      Confirm Deletion
                    </h2>
                    <p className="text-gray-600">
                      Are you sure you want to delete this user?
                    </p>
                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={() => setShowConfirmModal(false)}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleDeleteConfirmed}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
    </div>
  )
}

export default DeleteUser
