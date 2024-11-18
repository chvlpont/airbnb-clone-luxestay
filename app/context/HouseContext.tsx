import React, { createContext, useContext, useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { db, storage } from "../../firebase.config";

interface HouseData {
  location: string;
  price: number;
  title: string;
  stars: number;
  imageUrl: string;
}

interface HouseContextType {
  houseData: HouseData[];
  filteredHouseData: HouseData[];
  setFilteredHouseData: React.Dispatch<React.SetStateAction<HouseData[]>>;
}

const HouseContext = createContext<HouseContextType | undefined>(undefined);

export const useHouseContext = () => {
  const context = useContext(HouseContext);
  if (!context) {
    throw new Error("useHouseContext must be used within a HouseProvider");
  }
  return context;
};

export const HouseProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [houseData, setHouseData] = useState<HouseData[]>([]);
  const [filteredHouseData, setFilteredHouseData] = useState<HouseData[]>([]);

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
      setHouseData(houses);
      setFilteredHouseData(houses); // Initialize filtered data
    };

    fetchHouseData();
  }, []);

  return (
    <HouseContext.Provider
      value={{ houseData, filteredHouseData, setFilteredHouseData }}
    >
      {children}
    </HouseContext.Provider>
  );
};
