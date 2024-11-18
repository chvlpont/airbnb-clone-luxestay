"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { db, storage } from "../firebase.config";
import BottomNav from "./components/bottom-navbar";
import Navbar from "./components/navbar";
import TopSearchBar from "./components/top-searchbar";
import { FaStar } from "react-icons/fa6";
import Footer from "./components/footer";
import FilterModal from "./components/filter-modal"; // Import FilterModal

interface HouseData {
  location: string;
  price: number;
  title: string;
  stars: number;
  imageUrl: string;
  guests: number;
}

const HomePage: React.FC = () => {
  const [houseData, setHouseData] = useState<HouseData[]>([]);
  const [favorites, setFavorites] = useState<{ [key: number]: boolean }>({});
  const [searchTitle, setSearchTitle] = useState(""); // Search state for title
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [guests, setGuests] = useState<string>("Any");
  const [filterModalOpen, setFilterModalOpen] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchHouseData = async () => {
      const houses: HouseData[] = [];

      for (let i = 1; i <= 6; i++) {
        const docSnap = await getDoc(doc(db, "listings", `house${i}`));
        if (docSnap.exists()) {
          const data = docSnap.data();
          const imageRef = ref(storage, `house${i}.jpg`);
          const imageUrl = await getDownloadURL(imageRef);

          houses.push({
            location: data.location,
            price: data.price,
            title: data.title,
            stars: parseFloat(data.stars),
            imageUrl,
            guests: data.guests, // Assuming guests are in the house data
          });
        }
      }

      // Apply filtering based on state
      const filteredHouses = houses.filter((house) => {
        const isTitleMatch = house.title
          .toLowerCase()
          .includes(searchTitle.toLowerCase());
        const isMinPriceMatch = !minPrice || house.price >= parseInt(minPrice);
        const isMaxPriceMatch = !maxPrice || house.price <= parseInt(maxPrice);
        const isGuestsMatch =
          guests === "Any" || house.guests === parseInt(guests);

        return (
          isTitleMatch && isMinPriceMatch && isMaxPriceMatch && isGuestsMatch
        );
      });

      setHouseData(filteredHouses); // Set the filtered house data
    };

    fetchHouseData();

    const savedFavorites = JSON.parse(
      localStorage.getItem("favorites") || "{}"
    );
    setFavorites(savedFavorites);
  }, [searchTitle, minPrice, maxPrice, guests]); // Refetch data whenever any filter changes

  const handleFavoriteClick = (index: number, house: HouseData) => {
    const updatedFavorites = { ...favorites, [index]: !favorites[index] };
    setFavorites(updatedFavorites);

    // Prepare favorite house data for saving
    let storedFavorites = JSON.parse(
      localStorage.getItem("favoriteHouses") || "[]"
    );

    if (updatedFavorites[index]) {
      // Add to favorites if not already present
      storedFavorites = [...storedFavorites, house];
    } else {
      // Remove from favorites if un-favorited
      storedFavorites = storedFavorites.filter(
        (fav: HouseData) => fav.title !== house.title
      );
    }

    localStorage.setItem("favoriteHouses", JSON.stringify(storedFavorites));
  };

  // Handle search/filter submit
  const handleSearch = (
    title: string,
    guests: string,
    minPrice: string,
    maxPrice: string,
    features: string[],
    services: string[]
  ) => {
    setSearchTitle(title); // Set search title
    setGuests(guests); // Set guests filter
    setMinPrice(minPrice); // Set min price filter
    setMaxPrice(maxPrice); // Set max price filter
    // For features and services, you can implement similar logic if you want to filter based on these
    // Example: filtering houses based on selected features or services
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="hidden md:block">
        {/* Pass setFilterModalOpen to Navbar as onClick */}
        <Navbar onClick={() => setFilterModalOpen(true)} />
      </div>
      <div className="block md:hidden">
        <TopSearchBar
          onSearch={(title: string) => setSearchTitle(title)}
          onClick={() => setFilterModalOpen(true)} // Set the onClick handler here
        />
      </div>

      {/* Filter Modal */}
      {filterModalOpen && (
        <FilterModal
          onClose={() => setFilterModalOpen(false)}
          onSearch={handleSearch}
        />
      )}

      <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-10 mb-11 mt-6">
        {houseData.length > 0 ? (
          houseData.map((house, index) => (
            <div
              className="relative mb-10"
              key={index}
              onClick={() => router.push(`/house/${index + 1}`)}
            >
              <div className="relative mb-4 w-full h-60">
                <img
                  src={house.imageUrl}
                  alt={house.title}
                  className="w-full h-full object-cover rounded-lg"
                />
                <FaStar
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFavoriteClick(index, house);
                  }}
                  className={`absolute top-2 right-2 text-lg cursor-pointer ${
                    favorites[index] ? "text-yellow-500" : "text-gray-400"
                  }`}
                />
              </div>
              <div>
                <h2 className="flex-grow font-semibold">{house.title}</h2>
                <p>Location: {house.location}</p>
                <p>From {house.price}€ / night</p>
              </div>
            </div>
          ))
        ) : (
          <p>No houses found for this search.</p>
        )}
      </div>

      <div className="block md:hidden">
        <BottomNav />
      </div>

      <div className="hidden md:block mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
