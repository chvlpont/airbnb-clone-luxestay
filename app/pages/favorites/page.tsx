"use client";

import React, { useEffect, useState } from "react";
import BottomNav from "@/app/components/bottom-navbar";
import { FaStar } from "react-icons/fa6"; // We only need FaStar for both the favorite and remove star
import Footer from "@/app/components/footer";
import Navbar from "@/app/components/navbar";

const FavoritesPage = () => {
  const [favoriteHouses, setFavoriteHouses] = useState<
    {
      title: string;
      imageUrl: string;
      location: string;
      price: number; // Store price as a number (USD)
      stars: number; // Include stars in the structure
    }[]
  >([]);

  useEffect(() => {
    // Get the favorite houses from localStorage
    const storedFavorites = localStorage.getItem("favoriteHouses");

    if (storedFavorites) {
      const parsedFavorites = JSON.parse(storedFavorites);

      // Ensure each house has stars as a number
      const favoritesWithStars = parsedFavorites.map((house: any) => ({
        ...house,
        stars: Number(house.stars) || 0, // Convert stars to number
      }));

      setFavoriteHouses(favoritesWithStars);
    }
  }, []);

  const handleRemoveFavorite = (index: number) => {
    // Remove the house from the list
    const updatedFavorites = favoriteHouses.filter((_, i) => i !== index);

    // Update the state
    setFavoriteHouses(updatedFavorites);

    // Update localStorage with the updated favorites
    localStorage.setItem("favoriteHouses", JSON.stringify(updatedFavorites));
  };

  return (
    <div className="min-h-screen flex flex-col">
      {" "}
      {/* This makes the page take at least the full height */}
      {/* Regular Navbar for large screens */}
      <div className="hidden lg:block">
        <Navbar />
      </div>
      <div className="p-4 flex-grow mb-14">
        {" "}
        {/* flex-grow will make this area take available space */}
        <h1 className="text-2xl font-bold mb-4 text-center p-4">Favorites</h1>
        {favoriteHouses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
            {favoriteHouses.map((house, index) => (
              <div
                key={index}
                className="relative rounded-lg border border-gray-300 shadow-lg overflow-hidden flex"
              >
                {/* Image Section */}
                <img
                  src={house.imageUrl}
                  alt={house.title}
                  className="w-40 h-48 object-cover rounded-l-lg"
                />

                {/* Text Section */}
                <div className="flex flex-col p-4 w-full">
                  {/* Rating (Yellow Star) and Rating Number */}
                  <div className="flex items-center justify-between mb-2">
                    {/* Render a single filled star for rating */}
                    <div className="flex items-center">
                      <FaStar className="text-yellow-500 text-xl" />
                      <span className="ml-2 text-sm text-gray-600">
                        {house.stars}
                      </span>
                    </div>

                    {/* Remove Favorite Star (same style as the above star) */}
                    <FaStar
                      onClick={() => handleRemoveFavorite(index)} // Remove favorite when clicked
                      className="text-yellow-500 text-xl cursor-pointer hover:text-red-500"
                    />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold ">{house.title}</h3>

                  {/* Location */}
                  <p className="text-sm text-gray-500 mb-10">
                    {house.location}
                  </p>

                  {/* Price */}
                  <p className="text-lg font-bold">€ {house.price} / night </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No favorites selected.</p>
        )}
      </div>
      {/* Bottom Navbar for small screens */}
      <div className="lg:hidden">
        <BottomNav />
      </div>
      {/* Footer (visible on all screen sizes) */}
      <Footer className="mt-auto hidden lg:block" />{" "}
      {/* mt-auto pushes the footer to the bottom */}
    </div>
  );
};

export default FavoritesPage;
