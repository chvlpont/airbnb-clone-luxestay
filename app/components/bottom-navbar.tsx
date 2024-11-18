import React from "react";
import { MdOutlineExplore } from "react-icons/md";
import { CiStar } from "react-icons/ci";
import { RiFlightTakeoffLine } from "react-icons/ri";
import { FaRegUserCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

// Define BottomNavProps to accept className
interface BottomNavProps {
  className?: string; // Optional className prop
}

const BottomNav: React.FC<BottomNavProps> = ({ className }) => {
  const router = useRouter();
  const { isSignedIn } = useUser();

  const navigatePage = () => {
    if (isSignedIn) {
      router.push("/pages/profile");
    } else {
      router.push("/sign-in");
    }
  };

  const navigateToHomepage = () => {
    router.push("/");
  };

  const navigateToFavourites = () => {
    router.push("/pages/favorites");
  };

  const navigateToTrips = () => {
    router.push("/pages/trips");
  };

  return (
    <div
      className={`fixed bottom-0 left-0 w-full bg-bottomNavbarGray shadow-md z-10 ${className}`}
    >
      {/* Navigation links */}
      <nav className="flex justify-around p-4">
        <div
          className="flex flex-col items-center cursor-pointer"
          onClick={navigateToHomepage}
        >
          <MdOutlineExplore className="text-3xl" />
          <span className="text-sm">Explore</span>
        </div>
        <div
          className="flex flex-col items-center cursor-pointer"
          onClick={navigateToFavourites}
        >
          {/* Flex container for Favourites */}
          <CiStar className="text-3xl" />
          <span className="text-sm">Favourites</span>
        </div>
        <div className="flex flex-col items-center cursor-pointer">
          {/* Flex container for Trips */}
          <RiFlightTakeoffLine className="text-3xl" onClick={navigateToTrips} />
          <span className="text-sm">Trips</span>
        </div>
        <div
          className="flex flex-col items-center cursor-pointer"
          onClick={navigatePage} // Navigation for Profile
        >
          <FaRegUserCircle className="text-3xl" />
          <span className="text-sm">Profile</span>
        </div>
      </nav>
    </div>
  );
};

export default BottomNav;
