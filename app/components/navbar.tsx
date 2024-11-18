import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoFilter } from "react-icons/io5";
import { FaRegUserCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import FilterModal from "./filter-modal";

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className }) => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      console.log("Username:", user.username);
      console.log("Profile Picture URL:", user.imageUrl);
    }
  }, [isLoaded, user]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`w-full bg-navBar ${className}`}>
      <div className="p-4 flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <img
          src="/image.png"
          alt="Luxestay Logo"
          className="h-8 object-contain cursor-pointer"
          onClick={() => router.push("/")}
        />

        {/* Search and Filter */}
        <div
          className="flex items-center rounded-full px-4 py-2 w-full max-w-lg bg-white shadow-md ml-4"
          onClick={() => setModalOpen(true)} // Open the Filter Modal
        >
          <FaMagnifyingGlass className="mr-2" />
          <span className="flex-grow">Where to?</span>
          <div className="p-2 border rounded-full">
            <IoFilter />
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex gap-6">
          <div
            className="cursor-pointer"
            onClick={() => router.push("/pages/favorites")}
          >
            <p>Favorites</p>
          </div>
          <div
            className="cursor-pointer"
            onClick={() => router.push("/pages/trips")}
          >
            <p>Trips</p>
          </div>
        </div>

        {/* User Profile */}
        <div
          className="cursor-pointer"
          onClick={() => {
            if (user) {
              router.push("/pages/profile");
            } else {
              router.push("/sign-in");
            }
          }}
        >
          {user?.imageUrl ? (
            <img
              src={user.imageUrl}
              alt="Profile Picture"
              className="w-12 h-12 rounded-full"
            />
          ) : (
            <div className="w-12 h-12 flex items-center justify-center text-gray-500">
              <FaRegUserCircle className="text-3xl" />
            </div>
          )}
        </div>
      </div>

      {/* Filter Modal */}
      {isModalOpen && (
        <FilterModal
          onClose={() => setModalOpen(false)} // Close the modal
        />
      )}
    </div>
  );
};

export default Navbar;
