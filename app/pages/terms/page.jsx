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
      <div className="lg:max-w-4xl lg:mx-auto lg:p-8 lg:mt-10 lg:rounded-lg lg:shadow-lg lg:bg-transparent lg:border-0 lg:pb-10 lg:mb-10">
        <div className="p-5">
          <div className="flex items-center w-full mt-10">
            <IoIosArrowBack
              className="text-3xl cursor-pointer"
              onClick={navigatePage}
            />
            <p className="flex-grow text-center text-2xl">Terms</p>
          </div>

          <div className="mt-20">
            <p>Last update: 25/6/2024</p>
            <p className="mt-5">
              LuxeStay provides an online platform connecting hosts who have
              accommodations to rent with guests seeking to book such
              accommodations.
            </p>
          </div>

          <div className="mt-10">
            <p className="text-blue-600">Conditions of Use</p>
            <p className="mt-5">
              As a host, you must ensure that your property and hosting
              activities are compliant with all relevant laws, regulations, and
              ordinances. This includes, but is not limited to: Obtaining any
              necessary permits or licenses required to operate a short-term
              rental in your locality. Ensuring that your property meets all
              health and safety standards, such as fire alarms, carbon monoxide
              detectors, and other required safety features. Staying aware of
              any tax obligations that may arise from rental income. LuxeStay
              does not provide tax advice, and it is the responsibility of the
              host to comply with local tax laws, including registering with
              local tax authorities and reporting income as required.
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
