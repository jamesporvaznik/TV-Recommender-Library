const ConfirmationModal = ({ isModalOpen, ratingValue, handleSave, handleCancel, showTitle }) => {
    if (!isModalOpen) return null;

    return (
        // 1. Backdrop: Fixed, covers entire screen, semi-transparent black background
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-70 transition-opacity duration-300">
            
            {/* 2. Modal Container: The actual centered white box */}
            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full transform transition-all duration-300 scale-100">
                
                <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                    Confirm Rating Submission
                </h3>
                <p className="text-gray-600 mb-6 text-center">
                    Are you sure you want to submit a rating of 
                    <span className="font-bold text-blue-600 mx-1">{ratingValue}/10</span> 
                    for "{showTitle}"?
                </p>
                
                {/* 3. Button Group: Centered in the modal footer */}
                <div className="flex justify-center gap-4">
                    {/* Cancel Button */}
                    <button
                        onClick={handleCancel}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-150"
                    >
                        Cancel
                    </button>
                    {/* Save Button */}
                    <button
                        onClick={handleSave}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-150"
                    >
                        Save Rating
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;