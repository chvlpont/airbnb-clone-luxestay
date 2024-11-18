"use client";

import { useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6"; // Import the search icon
import { IoFilter } from "react-icons/io5"; // Import the filter icon
import FilterModal from "./filter-modal";

interface TopSearchBarProps {
  onSearch: (searchTerm: string) => void; // Function to handle search input in parent (HomePage)
  onClick?: () => void; // Optional onClick handler
}

const TopSearchBar: React.FC<TopSearchBarProps> = ({ onSearch, onClick }) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  const handleOpenModal = () => {
    setIsModalOpen(true); // Open the modal when the search bar is clicked
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal when cancel button or close is triggered
  };

  return (
    <div className="p-10 flex items-center">
      <div
        className="flex items-center rounded-full px-4 py-3 w-full bg-white shadow-md cursor-pointer"
        onClick={onClick || handleOpenModal} // Use passed onClick if available, otherwise fallback to default
      >
        <FaMagnifyingGlass className="mr-2" />
        <span className="flex-grow">Where to?</span>
        <div className="p-2 border rounded-full">
          <IoFilter />
        </div>
      </div>

      {/* Conditionally render FilterModal */}
      {isModalOpen && (
        <FilterModal onClose={handleCloseModal} onSearch={onSearch} />
      )}
    </div>
  );
};

export default TopSearchBar;
