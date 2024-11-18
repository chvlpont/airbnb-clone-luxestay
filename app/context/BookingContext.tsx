// context/BookingContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface BookingData {
  title: string;
  location: string;
  price: number;
  cleaningFee: number;
  serviceFee: number;
  checkInDate: Date | null;
  checkOutDate: Date | null;
  guests: number;
  bookingDate: Date;
  imageURL?: string | null; // Add imageURL to the booking data
}

interface BookingContextProps {
  bookingData: BookingData | null;
  setBookingData: React.Dispatch<React.SetStateAction<BookingData | null>>;
}

const BookingContext = createContext<BookingContextProps | undefined>(
  undefined
);

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [bookingData, setBookingData] = useState<BookingData | null>(null);

  return (
    <BookingContext.Provider value={{ bookingData, setBookingData }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};
