import React from "react";
import { FaXTwitter } from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";

// Define the props to accept className
interface FooterProps {
  className?: string; // Optional className prop
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <div className={`bg-navBar py-8 ${className}`}>
      {/* Main container */}
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-center items-center md:justify-between mb-8">
        {/* Left Column (Contact & Paragraph) */}
        <div className="w-full md:w-1/2 text-center md:text-left mb-6 md:mb-0">
          <p className="text-3xl text-black mt-10 mb-3">Get in touch</p>
          <p className="text-black mb-4">
            Leave feedback or ask general questions through our contact page.
            These pieces of information are valuable to businesses because they
            learn more about consumer expectations and preferences.
          </p>
        </div>

        {/* Right Column (Social Media Icons) */}
        <div className="flex justify-center space-x-6">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaXTwitter className="text-6xl text-black" />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebook className="text-6xl text-black" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <RiInstagramFill className="text-6xl text-black" />
          </a>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="text-center text-sm text-gray-600">
        <p>© 2024 Luxestay, Inc. • Copyright Reserved</p>
      </div>
    </div>
  );
};

export default Footer;
