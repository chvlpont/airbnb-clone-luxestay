"use client";

import React, { useEffect } from "react";
import { useUser, useClerk } from "@clerk/nextjs"; // Import useClerk
import { IoIosArrowForward } from "react-icons/io";
import { FaRegUserCircle } from "react-icons/fa";
import { MdOutlinePayments } from "react-icons/md";
import { HiDocumentDuplicate } from "react-icons/hi";
import { IoDocumentText } from "react-icons/io5";
import BottomNav from "@/app/components/bottom-navbar";
import { useRouter } from "next/navigation";
import Footer from "@/app/components/footer";
import Navbar from "@/app/components/navbar";

const ProfilePage = () => {
  const { user, isLoaded } = useUser(); // Access Clerk user data
  const { signOut } = useClerk(); // Access Clerk's signOut function
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && user) {
      console.log("Username:", user.username); // Log the username to the console
      console.log("Profile Picture URL:", user.imageUrl); // Log the profile image URL
    }
  }, [isLoaded, user]); // Run this effect when the user is loaded

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  const navigateToPage = (page) => {
    // Conditionally navigate based on the 'page' argument
    if (page === "terms") {
      router.push("/pages/terms");
    } else if (page === "privacy") {
      router.push("/pages/policy");
    }
  };

  // Handle sign out
  const handleSignOut = () => {
    signOut(); // Sign the user out
    router.push("/"); // Redirect to homepage after sign out
  };

  return (
    <>
      {/* Navbar (only for larger screens) */}
      <div className="lg:block hidden">
        <Navbar />
      </div>

      {/* Card Container (only for large screens) */}
      <div className="lg:max-w-4xl lg:mx-auto lg:p-8 lg:mt-10 lg:rounded-lg lg:bg-transparent lg:border-0 mb-10">
        <div className="p-5">
          {/* "Profile" text hidden on large screens */}
          <div className="lg:hidden flex justify-center text-3xl mt-10">
            <h1>Profile</h1>
          </div>

          {/* Profile Section for mobile screens */}
          <div className="flex items-center gap-3 lg:justify-center lg:pb-4 lg:gap-5">
            {/* Profile Picture */}
            {user?.imageUrl ? (
              <img
                src={user.imageUrl} // Use the imageUrl from Clerk
                alt="Profile Picture"
                className="w-16 h-16 rounded-full" // Smaller profile picture for both mobile and large screens
              />
            ) : (
              <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-white">No Image</span>
              </div>
            )}

            {/* Username */}
            <div className="text-xl lg:text-left lg:hidden">
              <p>{user.username}</p>
            </div>
          </div>

          {/* Border hidden on large screens */}
          <div className="lg:hidden border-t border-gray-300"></div>

          <div className="mt-10 flex flex-col">
            <p className="text-2xl ">Account settings</p>
            <div className="flex gap-3 items-center py-5 border-b border-gray-300">
              <FaRegUserCircle />
              <p>Personal Information</p>
              <IoIosArrowForward className="ml-auto" />
            </div>
            <div className="flex gap-3 items-center py-5 border-b border-gray-300">
              <MdOutlinePayments />
              <p>Payments</p>
              <IoIosArrowForward className="ml-auto" />
            </div>
          </div>
          <div className="mt-10 flex flex-col">
            <p className="text-2xl ">Law</p>
            <div
              className="flex gap-3 items-center py-5 border-b border-gray-300 cursor-pointer"
              onClick={() => navigateToPage("terms")} // Passing "terms"
            >
              <HiDocumentDuplicate />
              <p>Terms and services</p>
              <IoIosArrowForward className="ml-auto" />
            </div>
            <div
              className="flex gap-3 items-center py-5 border-b border-gray-300 cursor-pointer"
              onClick={() => navigateToPage("privacy")} // Passing "privacy"
            >
              <IoDocumentText />
              <p>Privacy policy</p>
              <IoIosArrowForward className="ml-auto" />
            </div>
          </div>
        </div>
        <button className="underline p-5" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>

      {/* BottomNav (hidden on large screens) */}
      <div className="lg:hidden">
        <BottomNav />
      </div>

      {/* Footer (only for larger screens) */}
      <div className="lg:block hidden">
        <Footer />
      </div>
    </>
  );
};

export default ProfilePage;
