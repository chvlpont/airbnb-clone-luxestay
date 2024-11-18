"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore"; // Import addDoc for Firestore writes
import { db } from "../../../firebase.config";
import { FaStar } from "react-icons/fa"; // Import the FaStar component
import BottomNav from "@/app/components/bottom-navbar";
import { useRouter } from "next/navigation";
import Footer from "@/app/components/footer";
import Navbar from "@/app/components/navbar";

const TripsPage = () => {
  const [trips, setTrips] = useState<any[]>([]); // Store trips data
  const [view, setView] = useState<"upcoming" | "done">("upcoming"); // State for toggle
  const [modalVisible, setModalVisible] = useState(false); // Control modal visibility
  const [currentTrip, setCurrentTrip] = useState<string>(""); // Store the current trip being reviewed
  const [reviewText, setReviewText] = useState<string>(""); // Store review text
  const [rating, setRating] = useState<number>(0); // Store the selected rating
  const [name, setName] = useState<string>(""); // Store reviewer name
  const router = useRouter();

  useEffect(() => {
    const fetchTrips = async () => {
      const querySnapshot = await getDocs(collection(db, "reservations"));
      const tripData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id, // Capture the document ID
      }));
      setTrips(tripData); // Set trips with complete data
    };

    fetchTrips();
  }, []);

  const handleWriteReview = (title: string) => {
    setCurrentTrip(title);
    setModalVisible(true); // Open the modal when writing a review
  };

  const handleBookAgain = (title: string) => {
    console.log("Booking again for:", title);
    // Add functionality to rebook the trip
  };

  const handleReviewSubmit = async () => {
    if (!name.trim() || !reviewText.trim() || rating === 0) {
      alert("Please complete all fields and select a star rating.");
      return;
    }

    const date = new Date();
    const formattedDate = `${date.toLocaleString("default", {
      month: "long",
    })} ${date.getFullYear()}`;

    const reviewData = {
      tripName: currentTrip,
      name,
      message: reviewText,
      stars: rating,
      date: formattedDate,
    };

    try {
      await addDoc(collection(db, "reviews"), reviewData); // Add review to Firestore
      console.log("Review successfully added:", reviewData);
      alert("Review submitted successfully!");
    } catch (error) {
      console.error("Error adding review:", error);
      alert("Error submitting the review. Please try again.");
    }

    setModalVisible(false); // Close the modal after submitting the review
    setReviewText(""); // Clear the review text
    setRating(0); // Reset rating
    setName(""); // Reset name field
  };

  const handleModalClose = () => {
    setModalVisible(false); // Close the modal without submitting
    setReviewText(""); // Clear the review text if canceled
    setRating(0); // Reset rating
    setName(""); // Reset name field
  };

  const formatBookingDate = (checkIn: any, checkOut: any) => {
    const checkInDate = new Date(checkIn.seconds * 1000); // Firebase timestamp conversion
    const checkOutDate = new Date(checkOut.seconds * 1000);

    const options: Intl.DateTimeFormatOptions = {
      month: "long",
      day: "numeric",
    };

    return `${checkInDate.toLocaleDateString(
      "default",
      options
    )} - ${checkOutDate.toLocaleDateString("default", options)}`;
  };

  const navigateToDetails = (tripId: string) => {
    router.push(`/pages/details?id=${tripId}`);
  };

  const filterTrips = () => {
    const today = new Date();
    return trips.filter((trip) => {
      const checkOutDate = new Date(trip.checkOutDate.seconds * 1000); // Convert Firebase timestamp
      if (view === "upcoming") {
        return checkOutDate >= today; // Filter for trips that are still upcoming
      } else {
        return checkOutDate < today; // Filter for trips that have already passed
      }
    });
  };

  return (
    <>
      <Navbar className="hidden lg:block" />

      <div className="min-h-screen flex flex-col">
        <div className="p-10 flex-grow">
          <div className="text-center mb-10 text-3xl font-bold">
            <h1>Trips</h1>
          </div>

          <div className="flex mb-6 w-full max-w-screen-md mx-auto">
            <button
              onClick={() => setView("upcoming")}
              className={`w-1/2 lg:w-1/2 py-3 text-lg font-medium rounded-full ${
                view === "upcoming"
                  ? "bg-buttonPrimary text-white z-10"
                  : "bg-gray-200"
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setView("done")}
              className={`w-1/2 lg:w-1/2 py-3 text-lg font-medium rounded-full -ml-3 lg:ml-0 ${
                view === "done"
                  ? "bg-buttonPrimary text-white z-10"
                  : "bg-gray-200"
              }`}
            >
              Done
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6 justify-items-center max-w-4xl mx-auto">
            {filterTrips().length > 0 ? (
              filterTrips().map((trip, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow w-full"
                >
                  <p className="text-gray-500 mb-2">
                    Booking ID: {trip.id.substring(0, 5).toUpperCase()}
                  </p>
                  <p className="text-gray-500 mb-4">
                    Booking Date:{" "}
                    {formatBookingDate(trip.checkInDate, trip.checkOutDate)}
                  </p>

                  <div className="flex items-start mb-4">
                    {trip.imageUrl && (
                      <img
                        src={trip.imageUrl}
                        alt={trip.title}
                        className="w-16 h-16 object-cover rounded-md mr-4"
                      />
                    )}
                    <div>
                      <h2 className="text-xl font-semibold">{trip.title}</h2>
                      <p className="text-gray-600">{trip.location}</p>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    {view === "done" ? (
                      <>
                        <button
                          onClick={() => handleWriteReview(trip.title)}
                          className="bg-gray-300 text-black py-3 px-6 rounded-md w-full"
                        >
                          Write a Review
                        </button>
                        <button
                          onClick={() => handleBookAgain(trip.title)}
                          className="bg-buttonPrimary text-white py-3 px-6 rounded-md w-full"
                        >
                          Book Again
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="bg-gray-300 text-black py-3 px-6 rounded-md w-full">
                          Cancel
                        </button>
                        <button
                          onClick={() => navigateToDetails(trip.id)}
                          className="bg-buttonPrimary text-white py-3 px-6 rounded-md w-full"
                        >
                          View Details
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p>No {view} trips found.</p>
            )}
          </div>
        </div>

        {modalVisible && (
          <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-2/3">
              <h2 className="text-3xl font-semibold mb-4 text-center">
                Write a Review
              </h2>
              <div className="flex mb-4 justify-center">
                {[1, 2, 3, 4, 5].map((starIndex) => (
                  <FaStar
                    key={starIndex}
                    onClick={() => setRating(starIndex)}
                    onMouseEnter={() => setRating(starIndex)}
                    onMouseLeave={() => setRating(rating)}
                    className={`cursor-pointer text-3xl mr-2 ${
                      rating >= starIndex ? "text-yellow-500" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              <div className="mb-4">
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Your Name"
                />
              </div>

              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md mb-4"
                placeholder="Tell us about your experience"
              />

              <div className="flex justify-between">
                <button
                  onClick={handleModalClose}
                  className="bg-gray-300 text-black py-2 px-4 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReviewSubmit}
                  className="bg-buttonPrimary text-white py-2 px-4 rounded-md"
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        )}

        <BottomNav className="lg:hidden" />
        <Footer className="hidden lg:block" />
      </div>
    </>
  );
};

export default TripsPage;
