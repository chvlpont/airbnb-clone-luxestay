"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { db, storage } from "../firebase.config";
import BottomNav from "./components/bottom-navbar";
import Navbar from "./components/navbar"; // Import Navbar
import TopSearchBar from "./components/top-searchbar";
import { FaStar } from "react-icons/fa6";
import Footer from "./components/footer";

interface HouseData {
  location: string;
  price: number;
  title: string;
  stars: number;
  imageUrl: string;
}

const HomePage: React.FC = () => {
  const [houseData, setHouseData] = useState<HouseData[]>([]);
  const [favorites, setFavorites] = useState<{ [key: number]: boolean }>({});
  const [searchTitle, setSearchTitle] = useState(""); // State to hold the search term
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
          });
        }
      }

      // Filter houses based on searchTitle
      const filteredHouses = houses.filter((house) =>
        house.title.toLowerCase().includes(searchTitle.toLowerCase())
      );

      setHouseData(filteredHouses); // Set the filtered houses
    };

    fetchHouseData();

    const savedFavorites = JSON.parse(
      localStorage.getItem("favorites") || "{}"
    );
    setFavorites(savedFavorites);
  }, [searchTitle]); // Re-fetch data whenever the searchTitle changes

  const handleFavoriteClick = (index: number, house: HouseData) => {
    const updatedFavorites = { ...favorites, [index]: !favorites[index] };
    setFavorites(updatedFavorites);

    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));

    const storedFavorites = JSON.parse(
      localStorage.getItem("favoriteHouses") || "[]"
    );

    if (updatedFavorites[index]) {
      storedFavorites.push({
        title: house.title,
        imageUrl: house.imageUrl,
        location: house.location,
        price: house.price,
        stars: house.stars,
      });
    } else {
      const indexToRemove = storedFavorites.findIndex(
        (fav: any) => fav.title === house.title
      );
      if (indexToRemove !== -1) {
        storedFavorites.splice(indexToRemove, 1);
      }
    }

    localStorage.setItem("favoriteHouses", JSON.stringify(storedFavorites));
  };

  return (
    <>
      {/* Conditionally rendering based on screen size */}
      <div className="hidden md:block">
        <Navbar />
      </div>
      <div className="block md:hidden">
        <TopSearchBar onSearch={(title: string) => setSearchTitle(title)} />{" "}
        {/* Pass title to HomePage */}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-10 mb-11 mt-6">
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

      <div className="hidden md:block">
        <Footer />
      </div>
    </>
  );
};

export default HomePage;
