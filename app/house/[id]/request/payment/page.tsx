"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, collection, addDoc } from "firebase/firestore";
import { db, storage } from "../../../../../firebase.config"; // Import storage
import { getDownloadURL, ref } from "firebase/storage"; // Import Firebase Storage functions
import { IoMdCard } from "react-icons/io";
import { RiMastercardLine } from "react-icons/ri";
import { useBooking } from "@/app/context/BookingContext";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";

interface HouseData {
  title: string;
  location: string;
  price: number;
  imageUrl?: string; // Add imageUrl to the house data type
}

const PaymentPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [houseData, setHouseData] = useState<HouseData | null>(null);
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const { setBookingData } = useBooking();

  const cleaningAmount = 200;
  const serviceAmount = 0;

  // Fetch house data from Firestore and image URL from Firebase Storage
  useEffect(() => {
    const fetchHouseData = async () => {
      if (id) {
        try {
          const docRef = doc(db, "listings", `house${id}`);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data() as HouseData;

            // Fetch the image URL from Firebase Storage
            const imageRef = ref(storage, `house${id}.jpg`);
            const imageUrl = await getDownloadURL(imageRef);

            setHouseData({ ...data, imageUrl }); // Add imageUrl to the state
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

  // Get check-in and check-out dates from the URL
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");

    if (checkIn) setCheckInDate(new Date(checkIn));
    if (checkOut) setCheckOutDate(new Date(checkOut));
  }, []);

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

  const handleReserve = async () => {
    if (houseData && checkInDate && checkOutDate) {
      // Fetch the image URL
      const imageRef = ref(storage, `house${id}.jpg`);
      const imageUrl = await getDownloadURL(imageRef);

      const bookingData = {
        title: houseData.title,
        location: houseData.location,
        price: houseData.price,
        cleaningFee: cleaningAmount,
        serviceFee: serviceAmount,
        checkInDate: checkInDate,
        checkOutDate: checkOutDate,
        guests: 1,
        bookingDate: new Date(),
        imageUrl, // Save image URL in the Firestore document
      };

      setBookingData(bookingData);

      try {
        // Save booking data to Firestore
        const docRef = await addDoc(
          collection(db, "reservations"),
          bookingData
        );

        // Redirect to confirmation page with reservation ID
        const queryParams = new URLSearchParams({
          checkIn: checkInDate.toISOString(),
          checkOut: checkOutDate.toISOString(),
          reservationId: docRef.id,
        }).toString();

        router.push(
          `/house/${id}/request/payment/booking-confirmed?${queryParams}`
        );
      } catch (error) {
        console.error("Error adding reservation:", error);
      }
    }
  };

  return (
    <>
      {/* Navbar visible on large screens */}
      <div className="lg:block hidden">
        <Navbar />
      </div>

      {/* Main container */}
      <div className="container flex flex-col items-center p-5 mt-10 lg:max-w-screen-lg lg:mx-auto lg:p-10 lg:justify-center">
        <h1 className="text-2xl font-bold pb-4 lg:hidden">Payments</h1>

        {houseData ? (
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mt-4">
            <div className="flex items-center">
              {houseData.imageUrl && (
                <img
                  src={houseData.imageUrl}
                  alt={houseData.title}
                  className="w-16 h-16 object-cover rounded-lg mr-4"
                />
              )}
              <div>
                <h2 className="text-xl font-semibold">{houseData.title}</h2>
                <p className="text-gray-600">{houseData.location}</p>
              </div>
            </div>

            <div className="mt-4">
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
      </div>

      {/* Payment Method and Change Button Section */}
      <div className="lg:max-w-md lg:mx-auto lg:px-5 flex flex-col items-center mt-16 w-full">
        <div className="flex justify-between w-full mb-4 px-5">
          <p className="font-bold">Payment method</p>
          <button className="text-blue-500">CHANGE</button>
        </div>

        <div className="flex justify-between w-full mb-10 px-5">
          <div className="flex gap-4">
            <IoMdCard className="text-2xl" />
            <p className="text-2xl">**** **** **** ****</p>
          </div>
          <RiMastercardLine className="text-2xl" />
        </div>

        <div className="flex justify-center mb-20 w-full px-5">
          <button
            className="bg-buttonPrimary text-white font-bold py-4 px-10 rounded-lg w-full sm:w-9/12 lg:w-full"
            onClick={handleReserve}
          >
            RESERVE
          </button>
        </div>
      </div>

      {/* Footer visible on large screens */}
      <div className="lg:block hidden">
        <Footer />
      </div>
    </>
  );
};

export default PaymentPage;
