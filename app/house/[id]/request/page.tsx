"use client";

import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { db, storage } from "../../../../firebase.config";
import { useParams, useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Footer from "@/app/components/footer";
import Navbar from "@/app/components/navbar";

interface HouseData {
  title: string;
  location: string;
  price: number;
  imageUrl?: string;
}

const Page = () => {
  const { id } = useParams();
  const router = useRouter();
  const [houseData, setHouseData] = useState<HouseData | null>(null);
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [guests, setGuests] = useState<number>();
  const cleaningFee = 200;
  const serviceFee = 0;

  useEffect(() => {
    const fetchHouseData = async () => {
      if (id) {
        try {
          const docRef = doc(db, "listings", `house${id}`);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data() as HouseData;

            const imageRef = ref(storage, `house${id}.jpg`);
            const imageUrl = await getDownloadURL(imageRef);

            setHouseData({ ...data, imageUrl });
          } else {
            console.error("No such document!");
          }
        } catch (error) {
          console.error("Error fetching house data:", error);
        }
      }
    };

    fetchHouseData();
  }, [id]);

  const calculateTotalPrice = () => {
    if (checkInDate && checkOutDate && houseData) {
      const nights =
        (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 3600 * 24);
      return nights > 0 ? nights * houseData.price : 0;
    }
    return 0;
  };

  const totalPrice = calculateTotalPrice();
  const numberOfNights =
    checkInDate && checkOutDate
      ? (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 3600 * 24)
      : 0;

  const handlePaymentClick = () => {
    if (checkInDate && checkOutDate && guests) {
      const checkIn = checkInDate.toISOString();
      const checkOut = checkOutDate.toISOString();
      router.push(
        `/house/${id}/request/payment?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`
      );
    } else {
      alert("Please select dates and the number of guests.");
    }
  };

  return (
    <div className="flex flex-col justify-between h-screen w-full">
      {/* Navbar for large screens */}
      <div className="lg:block hidden w-full">
        <Navbar />
      </div>

      <div className="">
        <h1 className="text-2xl font-bold flex justify-center place-items-center p-10">
          Booking Request
        </h1>
        {houseData && (
          <>
            <div className="flex flex-col place-items-center bg-white py-10 w-full">
              <div className="flex items-center w-full px-10">
                {houseData.imageUrl && (
                  <img
                    src={houseData.imageUrl}
                    alt={houseData.title}
                    className="w-20 h-20 object-cover rounded-lg mr-4"
                  />
                )}
                <div>
                  <h1 className="font-bold">{houseData.title}</h1>
                  <h2>{houseData.location}</h2>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <p className="flex place-items-center justify-center mb-2">
                CHECK-IN CHECK-OUT
              </p>
              <div className="flex flex-col w-full px-20">
                <div className="flex justify-center w-full">
                  <div className="flex flex-col w-full">
                    <DatePicker
                      selected={checkInDate}
                      onChange={(date) => {
                        setCheckInDate(date);
                        if (date && (!checkOutDate || date >= checkOutDate)) {
                          setCheckOutDate(new Date(date.getTime() + 86400000));
                        }
                      }}
                      dateFormat="MMMM d, yyyy"
                      className="border p-2 rounded-l w-full"
                      placeholderText="Check-in"
                    />
                  </div>
                  <div className="flex flex-col w-full">
                    <DatePicker
                      selected={checkOutDate}
                      onChange={(date) => setCheckOutDate(date)}
                      dateFormat="MMMM d, yyyy"
                      className="border p-2 rounded-r w-full"
                      placeholderText="Check-out"
                      minDate={
                        checkInDate
                          ? new Date(checkInDate.getTime() + 86400000)
                          : undefined
                      }
                    />
                  </div>
                </div>
                <div className="flex flex-col w-full">
                  <input
                    type="number"
                    id="guests"
                    value={guests}
                    onChange={(e) =>
                      setGuests(Math.max(1, Number(e.target.value)))
                    }
                    className="border p-2 rounded w-full"
                    min="1"
                    placeholder="Enter number of guests"
                  />
                </div>
              </div>
            </div>

            <div className="p-10">
              <h2 className="font-bold text-2xl py-5">Price details</h2>
              <div className="flex justify-between items-center mb-2">
                <h2>
                  €{houseData.price} x {numberOfNights} nights
                </h2>
                <p>Total: €{totalPrice.toFixed(2)}</p>
              </div>
              <div className="flex justify-between items-center mb-2">
                <h2>Cleaning Fee:</h2>
                <p>€{cleaningFee}</p>
              </div>
              <div className="flex justify-between items-center mb-2">
                <h2>Service Fee:</h2>
                <p>€{serviceFee}</p>
              </div>
              <div className="border-b border-gray-300 mb-5 mt-4"></div>
              <div className="flex justify-between items-center font-bold">
                <h2>Total (EUR)</h2>
                <p>€{(totalPrice + cleaningFee + serviceFee).toFixed(2)}</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Centered Payment Button */}
      <div className="flex justify-center mb-16">
        <button
          onClick={handlePaymentClick}
          className="bg-buttonPrimary text-white font-bold py-4 px-10 rounded-lg w-9/12 mb-10"
        >
          PAYMENT
        </button>
      </div>

      {/* Footer for large screens */}
      <div className="lg:block hidden w-full">
        <Footer />
      </div>
    </div>
  );
};

export default Page;
