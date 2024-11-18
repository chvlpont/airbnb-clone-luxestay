"use client";

import React from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useRouter } from "next/navigation";
import Footer from "@/app/components/footer";
import Navbar from "@/app/components/navbar";

const TermsAndServices = () => {
  const router = useRouter();
  const navigatePage = () => {
    router.push("/pages/profile");
  };

  return (
    <>
      {/* Navbar visible only on large screens */}
      <Navbar className="hidden lg:block" />

      {/* Card Container - Centered (only for large screens) */}
      <div className="lg:max-w-4xl lg:mx-auto lg:p-8 lg:mt-10 lg:rounded-lg lg:shadow-lg lg:bg-transparent lg:border-0 lg:pb-10 lg: mb-10">
        <div className="p-5">
          <div className="flex items-center w-full mt-10">
            <IoIosArrowBack
              className="text-3xl cursor-pointer"
              onClick={navigatePage}
            />
            <p className="flex-grow text-center text-2xl">Policy</p>
          </div>

          <div className="mt-20">
            <p>Last update: 25/6/2024</p>
            <p className="mt-5">
              Welcome to LuxeStay! By using our platform, you agree to the
              following terms. Please read them carefully.
            </p>
          </div>

          <div className="mt-10">
            <p className="text-blue-600">Policy</p>
            <p className="mt-5">
              You must ensure that the property is clean, well-maintained, and
              in good working order prior to each guest's arrival. Specifically:
              The interior and exterior of the property should be presented in a
              condition that meets or exceeds the expectations set by the
              listing. Broken appliances, malfunctioning amenities, or unsafe
              conditions should be addressed immediately. Any issues that arise
              during a guest’s stay should be addressed promptly. As a host, you
              should either be available to respond to guest concerns or provide
              contact information for a local representative who can assist with
              emergencies or repairs.
            </p>
          </div>
        </div>
      </div>

      {/* Footer visible only on large screens */}
      <Footer className="hidden lg:block" />
    </>
  );
};

export default TermsAndServices;
