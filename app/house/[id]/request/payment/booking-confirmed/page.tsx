"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation"; // Import necessary hooks
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../../../firebase.config";
import { FaRegCircleCheck } from "react-icons/fa6"; // Import the icon
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../../../../../firebase.config";
import Footer from "@/app/components/footer";
import Navbar from "@/app/components/navbar";

interface HouseData {
  title: string;
  location: string;
  price: number;
  imageUrl?: string;
}

const BookingConfirmedPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams(); // Get query parameters

  const [houseData, setHouseData] = useState<HouseData | null>(null);
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [reservationId, setReservationId] = useState<string | null>(null); // Add reservation ID state

  const cleaningAmount = 200;
  const serviceAmount = 0;

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

  useEffect(() => {
    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");
    const reservationIdParam = searchParams.get("reservationId");

    if (checkIn) setCheckInDate(new Date(checkIn));
    if (checkOut) setCheckOutDate(new Date(checkOut));
    if (reservationIdParam) setReservationId(reservationIdParam); // Set the reservation ID
  }, [searchParams]);

  const calculateNights = () => {
    if (checkInDate && checkOutDate) {
      return (
        (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 3600 * 24)
      );
    }
    return 0;
  };

  const nights = calculateNights();
  const totalPrice =
    nights > 0 ? nights * (houseData ? houseData.price : 0) : 0;
  const totalAmount = totalPrice + cleaningAmount + serviceAmount;

  const handleReturnToHome = () => {
    router.push("/");
  };

  return (
    <>
      <Navbar className="hidden lg:block" />
      <div className="min-h-screen flex flex-col items-center justify-center px-5 py-10">
        <h1 className="text-2xl font-bold text-center pb-4">
          Booking
          <br />
          Confirmed!
        </h1>

        <div className="text-8xl mb-4">
          <FaRegCircleCheck />
        </div>

        {/* Display reservation ID */}
        {reservationId && (
          <p className="text-gray-500 text-sm mt-2">
            Reservation ID: {reservationId}
          </p>
        )}

        {houseData ? (
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mt-4">
            <div className="mt-4 mb-2">
              <p>
                Booking Date:{" "}
                {checkInDate?.toLocaleString("default", {
                  month: "long",
                  day: "numeric",
                })}{" "}
                -{" "}
                {checkOutDate?.toLocaleString("default", {
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="flex items-center mb-4">
              {houseData.imageUrl && (
                <img
                  src={houseData.imageUrl}
                  alt={houseData.title}
                  className="w-24 h-24 object-cover rounded-lg mr-4"
                />
              )}
              <div className="px-2">
                <h2 className="text-xl font-semibold ">{houseData.title}</h2>
                <p className="text-gray-600">{houseData.location}</p>
              </div>
            </div>

            <div className="mt-4 border-t border-gray-300 pt-2">
              <h2 className="text-xl font-semibold py-2">Price details</h2>
              <div className="flex justify-between mb-2">
                <span>
                  €{houseData.price} x {nights} night{nights !== 1 ? "s" : ""}
                </span>
                <span>€{totalPrice.toFixed(2)}</span>
              </div>

              <div className="flex justify-between mb-2">
                <span>Cleaning Fee</span>
                <span>€{cleaningAmount}</span>
              </div>
              <div className="flex justify-between mb-12">
                <span>Service Fee</span>
                <span>€{serviceAmount}</span>
              </div>
            </div>

            <div className="border-t border-gray-300 flex justify-between font-bold pt-5">
              <span>Total (EUR):</span>
              <span>€{totalAmount.toFixed(2)}</span>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}

        <div className="flex justify-center font-bold text-xl mb-4 mt-6">
          <p>Enjoy your stay!</p>
        </div>

        <div className="flex justify-center mb-20 mt-4 w-full">
          <button
            className="bg-buttonPrimary text-white font-bold py-4 px-10 rounded-lg w-9/12 sm:w-4/12"
            onClick={handleReturnToHome}
          >
            RETURN TO HOME
          </button>
        </div>
      </div>
      <Footer className="hidden lg:block" />
    </>
  );
};

export default BookingConfirmedPage;
