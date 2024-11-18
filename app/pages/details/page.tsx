"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { db } from "../../../firebase.config";
import { doc, getDoc, deleteDoc } from "firebase/firestore";

// Helper function to format Firebase Timestamp
const formatBookingDate = (timestamp: any) => {
  const date = new Date(timestamp.seconds * 1000); // Firebase timestamp to JavaScript Date object
  return date.toLocaleDateString("en-US", {
    // Format the date (you can customize this)
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const DetailsPage = () => {
  const [trip, setTrip] = useState<any>(null); // Store trip details
  const searchParams = useSearchParams(); // Access query parameters
  const tripId = searchParams.get("id"); // Get the 'id' query parameter

  useEffect(() => {
    if (tripId) {
      const fetchTripDetails = async () => {
        console.log("Fetching details for trip with ID:", tripId); // Log trip ID

        const tripDocRef = doc(db, "reservations", tripId); // Reference to the trip document in Firestore
        const tripDoc = await getDoc(tripDocRef);

        if (tripDoc.exists()) {
          const tripData = tripDoc.data();
          console.log("Trip data fetched from Firestore:", tripData); // Log the fetched trip data
          setTrip({ ...tripData, id: tripDoc.id }); // Include the Firestore document ID in the state
        } else {
          console.log("No such trip!");
        }
      };

      fetchTripDetails();
    }
  }, [tripId]);

  console.log("Trip state:", trip); // Log the current state of the trip

  // Function to delete the trip from Firestore
  const handleDelete = async () => {
    if (tripId) {
      const tripDocRef = doc(db, "reservations", tripId);
      try {
        await deleteDoc(tripDocRef); // Delete the document from Firestore
        console.log(`Trip with ID ${tripId} has been deleted`);
        // Optionally, redirect the user or update state
        window.location.href = "/"; // Redirect to homepage or a different page
      } catch (error) {
        console.error("Error deleting trip:", error);
      }
    }
  };

  if (!trip) {
    return <div>Loading...</div>;
  }

  // Calculate the number of nights between checkInDate and checkOutDate
  const checkInDate = trip.checkInDate?.seconds * 1000; // Convert Firebase timestamp to milliseconds
  const checkOutDate = trip.checkOutDate?.seconds * 1000;

  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);

  const numberOfNights = Math.ceil(
    (checkOut.getTime() - checkIn.getTime()) / (1000 * 3600 * 24)
  ); // Calculate nights

  // Calculate total price
  const total =
    trip.price * numberOfNights + trip.cleaningFee + trip.serviceFee;

  return (
    <>
      <div className="flex justify-center">
        <h1 className="text-3xl mt-10">Details</h1>
      </div>
      <div className="px-10">
        <img
          src={trip.imageUrl}
          alt={trip.title}
          className="w-full h-60 object-cover mt-6 rounded-md"
        />
        <p className="text-center mt-5 text-2xl">You're going to</p>
        <br />
        <h2 className="text-2xl text-center font-semibold">{trip.title}</h2>
        <p className="text-lg text-center">{trip.location}</p>
      </div>

      <div className="text-center py-5">
        <h1 className="text-2xl">Address</h1>
        <p>{trip.location}</p>
      </div>

      <div className="text-center py-5">
        <h1 className="text-2xl">Price Breakdown</h1>
        <p>Nighly rate: ${trip.price}/night</p>
        <p>Cleaning Fee: ${trip.cleaningFee}</p>
        <p>Service Fee: ${trip.serviceFee}</p>
        <p>Total Price: ${total}</p>
      </div>

      {/* Delete Button */}
      <div className="flex justify-center py-6">
        <button
          onClick={handleDelete}
          className="px-6 py-3 bg-buttonPrimary w-4/5 text-white rounded-md shadow-lg"
        >
          Cancel
        </button>
      </div>
    </>
  );
};

export default DetailsPage;
