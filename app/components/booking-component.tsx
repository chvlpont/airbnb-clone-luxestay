"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { db, storage } from "../../firebase.config";
import { doc, getDoc } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";

interface HouseData {
  title: string;
  location: string;
  price: number;
  imageUrl?: string;
}

interface BookingComponentProps {
  housePrice: number;
  onSubmit: (data: any) => void;
}

const BookingComponent: React.FC<BookingComponentProps> = ({
  housePrice,
  onSubmit,
}) => {
  const { id } = useParams();
  const router = useRouter();

  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [guests, setGuests] = useState<number>(1);
  const cleaningFee = 200;
  const serviceFee = 0;

  const calculateTotalPrice = () => {
    if (checkInDate && checkOutDate) {
      const nights =
        (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 3600 * 24);
      return nights > 0 ? nights * housePrice : 0;
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
      onSubmit({ checkIn, checkOut, guests, totalPrice });
      router.push(
        `/house/${id}/request/payment?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`
      );
    } else {
      alert("Please select dates and the number of guests.");
    }
  };

  return (
    <div className="flex-col justify-between w-full hidden lg:block bg-white rounded-lg shadow-lg pt-4">
      <div className="">
        <div className="mt-6">
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
                onChange={(e) => setGuests(Math.max(1, Number(e.target.value)))}
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
              €{housePrice} x {numberOfNights} nights
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
      </div>

      <div className="flex justify-center mb-16">
        <button
          onClick={handlePaymentClick}
          className="bg-accent text-white font-bold py-4 px-10 rounded-lg w-9/12 mb-10"
        >
          Request
        </button>
      </div>
    </div>
  );
};

export default BookingComponent;
