"use client";

import { useState, useEffect } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6"; // Import the search icon
import { IoFilter } from "react-icons/io5"; // Import the filter icon

interface FilterModalProps {
  onClose: () => void; // Function to close the modal
  onSearch: (searchTerm: string) => void; // Function to pass search title to HomePage
}

const FilterModal: React.FC<FilterModalProps> = ({ onClose, onSearch }) => {
  const [title, setTitle] = useState(""); // State to handle the title search input
  const [minPrice, setMinPrice] = useState<number | string>(""); // Min price state
  const [maxPrice, setMaxPrice] = useState<number | string>(""); // Max price state
  const [guests, setGuests] = useState("Any"); // Guests state
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]); // Selected features
  const [selectedServices, setSelectedServices] = useState<string[]>([]); // Selected services

  useEffect(() => {
    // Prevent scrolling on body when modal is open
    document.body.style.overflow = "hidden";

    // Re-enable scrolling when the modal is closed
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []); // Empty dependency array to run this effect only on mount/unmount

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value); // Update the title state when the input changes
  };

  const handleSearch = () => {
    onSearch(title); // Pass the search term to the HomePage component
    onClose(); // Close the modal after the search
  };

  const handleFeatureChange = (feature: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature]
    );
  };

  const handleServiceChange = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="relative flex flex-col bg-white p-6 min-h-screen md:h-fit md:rounded-xl md:shadow-lg w-full max-w-full md:max-w-4xl overflow-hidden">
        <div className="flex flex-col flex-grow w-full">
          {/* Title Search Section */}
          <div className="mt-4">
            <div className="flex items-center rounded-full px-4 py-3 w-full bg-white shadow-md border cursor-pointer">
              <FaMagnifyingGlass className="mr-2 text-gray-600" />
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                placeholder="Where to?"
                className="flex-grow bg-transparent outline-none placeholder-gray-500 text-gray-700"
              />
              <div className="p-2 border rounded-full">
                <IoFilter className="text-gray-600" />
              </div>
            </div>
          </div>

          {/* Price Range Section */}
          <div className="mt-4 ml-2">
            <div className="flex space-x-4 items-center">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="max-w-32 border border-gray-400 p-2 rounded focus:ring-2 focus:ring-accent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <hr className="border-gray-400 w-4 items-center" />
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="max-w-32 border border-gray-400 p-2 rounded focus:ring-2 focus:ring-accent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </div>

          {/* Number of Guests Section */}
          <div className="mt-10">
            <label className="ml-8 block mb-2 font-semibold text-gray-700">
              Number of guests
            </label>
            <div className="space-x-5 place-self-center">
              {["Any", 1, 2, 4, "8+"].map((label, index) => (
                <button
                  key={index}
                  className={`px-3 py-1 rounded-full border border-gray-400 min-w-16 bg-gray-100 text-gray-700 hover:bg-accent hover:text-white transition ${
                    guests === label ? "bg-accent text-black" : ""
                  }`}
                  onClick={() => setGuests(label.toString())}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Property Features Section */}
          <div className="ml-10 mt-10">
            <div className="mt-4">
              <label className="block mb-2 font-semibold text-gray-700">
                Property Features
              </label>
              <div className="space-y-2 mb-2">
                {[
                  "Ocean View",
                  "Private pool",
                  "Helipad",
                  "Rooftop terrace",
                ].map((feature, index) => (
                  <label
                    key={index}
                    className="flex items-center cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="mr-2 h-4 w-4 accent-accent hover:accent-accentHover"
                      checked={selectedFeatures.includes(feature)}
                      onChange={() => handleFeatureChange(feature)}
                    />
                    <span className="ml-2 text-gray-700">{feature}</span>
                  </label>
                ))}
              </div>
              <p className="underline text-accent mb-2">Show more</p>
            </div>
          </div>

          {/* Property Services Section */}
          <div className="ml-10">
            <div className="block mb-2 font-semibold text-gray-700 mt-10">
              Services
            </div>
            <div className="space-y-2 mb-2">
              {[
                "Private chef",
                "Chauffeur",
                "Boat / yacht rentals",
                "In-house spa",
              ].map((service, index) => (
                <label key={index} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="mr-2 h-4 w-4 accent-accent hover:accent-accentHover"
                    checked={selectedServices.includes(service)}
                    onChange={() => handleServiceChange(service)}
                  />
                  <span className="ml-2 text-gray-700">{service}</span>
                </label>
              ))}
            </div>
            <p className="underline text-accent mb-2">Show more</p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex gap-2 mt-4">
          <button
            className="bg-gray-200 text-gray-700 hover:bg-gray-300 p-2 rounded-lg flex-1"
            onClick={onClose} // Close the modal
          >
            Cancel
          </button>
          <button
            className="bg-accent text-white hover:bg-accentHover p-2 rounded-lg flex-1"
            onClick={handleSearch} // Trigger search and close modal
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
