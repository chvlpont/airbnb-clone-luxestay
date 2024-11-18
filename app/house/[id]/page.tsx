"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { db, storage } from "../../../firebase.config";
import { useParams } from "next/navigation";
import {
  FaUser,
  FaStar,
  FaWifi,
  FaTemperatureHigh,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import { TbToolsKitchen2 } from "react-icons/tb";
import { CiParking1 } from "react-icons/ci";
import { PiPawPrint } from "react-icons/pi";
import { MdOutlinePool } from "react-icons/md";
import { GiSoccerField } from "react-icons/gi";
import { TbPlayVolleyball } from "react-icons/tb";
import { FaUmbrellaBeach } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import BookingComponent from "@/app/components/booking-component";

interface HouseData {
  title: string;
  location: string;
  price: number;
  guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  host: string;
  house_description: string;
  offers: string[];
  house_rules: string[];
  safety: string[];
  property_features: string[];
  services: string[];
  stars: number;
  imageUrl?: string;
}

const HouseDetails = () => {
  const { id } = useParams();
  const [houseData, setHouseData] = useState<HouseData | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const router = useRouter();
  const scrollRef = useRef<any>(null);

  // Handle dragging functionality for the reviews
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    if (id) {
      const fetchHouseData = async () => {
        const docRef = doc(db, "listings", `house${id}`);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as HouseData;

          // Fetch the image URL from Firebase Storage
          const imageRef = ref(storage, `house${id}.jpg`);
          const imageUrl = await getDownloadURL(imageRef);

          setHouseData({ ...data, imageUrl });
        }
      };

      // Fetch reviews based on house title (tripName)
      const fetchReviews = async () => {
        if (houseData?.title) {
          const reviewQuery = query(
            collection(db, "reviews"),
            where("tripName", "==", houseData.title)
          );
          const querySnapshot = await getDocs(reviewQuery);
          const reviewData = querySnapshot.docs.map((doc) => doc.data());
          setReviews(reviewData);
        }
      };

      fetchHouseData();
      if (houseData?.title) fetchReviews();
    }
  }, [id, houseData?.title]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Speed of scroll
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (!houseData) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Navbar className="hidden lg:block" />
      <div className="mb-4 min-h-96 relative">
        {houseData.imageUrl ? (
          <img
            src={houseData.imageUrl}
            alt={houseData.title}
            className="w-full h-96 object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gray-300"></div>
        )}
      </div>
      <div className="container mx-auto relative lg:flex lg:items-center lg:justify-center lg:px-20">
        {/* Main grid layout for large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Left Column (House Details) */}
          <div className="lg:col-span-1">
            <div className="p-5">
              <h1 className="text-2xl font-bold">{houseData.title}</h1>
              <p>{houseData.location}</p>
              <p>${houseData.price} / night</p>
              <div className="flex gap-2 border-b border-gray-300 pb-3">
                <p>{houseData.guests} guests • </p>
                <p>{houseData.bedrooms} bedrooms • </p>
                <p>{houseData.beds} beds • </p>
                <p>{houseData.bathrooms} bathrooms</p>
              </div>
              <div className="mt-4 border-b border-gray-300 pb-3 flex items-center gap-2 px-2">
                <FaUser className="text-xl" />
                Hosted by {houseData.host}
              </div>
              <div className="mt-4">
                <p className="border-b border-gray-300 pb-3">
                  {houseData.house_description}
                </p>
              </div>

              {/* Where you'll be Google map LARGE SCREEN*/}
              <div className="hidden lg:block mb-4">
                <h2 className="text-2xl font-bold mt-3">Where you'll be</h2>
                {houseData.location === "Lagos, Portugal" ? (
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d50905.12720356617!2d-8.724203036716384!3d37.11534131702447!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd1b304950234d8d%3A0x5410aaa3471afc57!2sLagos%2C%20Portugal!5e0!3m2!1ssv!2sse!4v1731946170377!5m2!1ssv!2sse"
                    width="650"
                    height="450"
                    style={{ border: "0" }}
                    allowFullScreen={true}
                    loading="lazy"
                  />
                ) : houseData.location === "San Teodoro, Italy" ? (
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d96676.16370648757!2d9.57069580343338!3d40.781153532781175!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12decebe826f755d%3A0x408be15cb105080!2s07052%20San%20Teodoro%2C%20Sassari%2C%20Italien!5e0!3m2!1ssv!2sse!4v1731946490544!5m2!1ssv!2sse"
                    width="650"
                    height="450"
                    style={{ border: "0" }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                ) : houseData.location === "Paros, Greece" ? (
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d101877.55854713084!2d25.113206413473492!3d37.065258185052734!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1498722c121b38ab%3A0x6cdef18eb96cf52a!2sParos!5e0!3m2!1ssv!2sse!4v1731946581043!5m2!1ssv!2sse"
                    width="650"
                    height="450"
                    style={{ border: "0" }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                ) : houseData.location === "Cassis, France" ? (
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d46521.05752361921!2d5.509103971331081!3d43.21858945791603!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12c9bac66b7ee435%3A0x40819a5fd970430!2s13260%20Cassis%2C%20Frankrike!5e0!3m2!1ssv!2sse!4v1731946681184!5m2!1ssv!2sse"
                    width="650"
                    height="450"
                    style={{ border: "0" }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                ) : (
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d102630.49740197028!2d-4.947392656665678!3d36.50096051255102!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd72d809904dabdf%3A0xe6c9db907b5ecab!2sMarbella%2C%20M%C3%A1laga%2C%20Spanien!5e0!3m2!1ssv!2sse!4v1731945852787!5m2!1ssv!2sse"
                    width="650"
                    height="450"
                    style={{ border: "0" }}
                    allowFullScreen={true}
                    loading="lazy"
                  />
                )}
              </div>

              <div className="flex flex-wrap bg-white rounded-3xl pl-16 pt-8 shadow-lg hidden lg:grid lg:grid-cols-2 lg:grid-rows-2 gap-4">
                {/* House Rules Top Left */}
                <div className="p-2 mb-2">
                  <h2 className="text-2xl font-bold mt-3 mb-2">House Rules</h2>
                  {houseData.house_rules.map((rule, index) => (
                    <p key={index}>{rule}</p>
                  ))}
                </div>

                {/* Safety Top Right */}
                <div className="p-2 mb-2">
                  <h2 className="text-2xl font-bold mt-3 mb-2">Safety</h2>
                  {houseData.safety.map((safety, index) => (
                    <p key={index}>{safety}</p>
                  ))}
                </div>

                {/* Property Features Bottom Left */}
                <div className="p-2 mb-2">
                  <h2 className="text-2xl font-bold mt-3 mb-2">
                    Property Features
                  </h2>
                  {houseData.property_features.map((property, index) => (
                    <p key={index}>{property}</p>
                  ))}
                </div>

                {/* Services Bottom Right */}
                <div className="p-2 mb-2">
                  <h2 className="text-2xl font-bold mt-3 mb-2">Services</h2>
                  {houseData.services.map((service, index) => (
                    <p key={index}>{service}</p>
                  ))}
                </div>
              </div>

              <div className="flex flex-col pb-3 mb-2 pt-4 lg:block hidden">
                {/* Single Review Card */}
                <div className="w-full bg-white px-8 py-4 rounded-lg shadow-md relative">
                  {/* Navigation Arrows */}
                  <div className="absolute top-1/2 left-0 transform -translate-y-1/2 px-4 cursor-pointer">
                    <FaArrowLeft size={24} />
                  </div>
                  <div className="absolute top-1/2 right-0 transform -translate-y-1/2 px-4 cursor-pointer">
                    <FaArrowRight size={24} />
                  </div>

                  <div className="flex items-center mb-4 px-8">
                    {reviews.length > 0 && (
                      <div className="text-xl font-bold">
                        <span>
                          Showing 1 of {reviews.length}{" "}
                          {reviews.length === 1 ? "review" : "reviews"}
                        </span>
                      </div>
                    )}
                  </div>
                  {reviews.length > 0 ? (
                    <div className="px-8">
                      {/* Review content */}
                      <div className="flex items-center mb-4">
                        {/* Profile Picture */}
                        <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>

                        {/* User Info (Username and Date) */}
                        <div className="flex flex-col">
                          <p className="font-semibold">{reviews[0].name}</p>
                          <p className="text-gray-400 text-sm">
                            {reviews[0].date}
                          </p>
                        </div>
                      </div>

                      {/* Review Message */}
                      <p className="text-gray-500 mb-2">
                        {reviews[0].message.length > 50
                          ? `${reviews[0].message
                              .split(" ")
                              .slice(0, 40)
                              .join(" ")}...`
                          : reviews[0].message}
                      </p>

                      {/* Show more link */}
                      <p className="underline text-sm">Show all reviews</p>
                    </div>
                  ) : (
                    <p>No reviews available for this house.</p>
                  )}
                </div>
              </div>

              {/* Where you'll be Google map */}
              <div className="block lg:hidden border-b border-gray-300">
                <h2 className="text-2xl font-bold mt-3 mb-2">
                  Where you'll be
                </h2>
                {houseData.location === "Lagos, Portugal" ? (
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d50905.12720356617!2d-8.724203036716384!3d37.11534131702447!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd1b304950234d8d%3A0x5410aaa3471afc57!2sLagos%2C%20Portugal!5e0!3m2!1ssv!2sse!4v1731946170377!5m2!1ssv!2sse"
                    width=""
                    height="300"
                    style={{ border: "0" }}
                    allowFullScreen={true}
                    loading="lazy"
                  />
                ) : houseData.location === "San Teodoro, Italy" ? (
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d96676.16370648757!2d9.57069580343338!3d40.781153532781175!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12decebe826f755d%3A0x408be15cb105080!2s07052%20San%20Teodoro%2C%20Sassari%2C%20Italien!5e0!3m2!1ssv!2sse!4v1731946490544!5m2!1ssv!2sse"
                    width="400"
                    height="300"
                    style={{ border: "0" }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                ) : houseData.location === "Paros, Greece" ? (
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d101877.55854713084!2d25.113206413473492!3d37.065258185052734!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1498722c121b38ab%3A0x6cdef18eb96cf52a!2sParos!5e0!3m2!1ssv!2sse!4v1731946581043!5m2!1ssv!2sse"
                    width="400"
                    height="300"
                    style={{ border: "0" }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                ) : houseData.location === "Cassis, France" ? (
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d46521.05752361921!2d5.509103971331081!3d43.21858945791603!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12c9bac66b7ee435%3A0x40819a5fd970430!2s13260%20Cassis%2C%20Frankrike!5e0!3m2!1ssv!2sse!4v1731946681184!5m2!1ssv!2sse"
                    width="400"
                    height="300"
                    style={{ border: "0" }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                ) : (
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d102630.49740197028!2d-4.947392656665678!3d36.50096051255102!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd72d809904dabdf%3A0xe6c9db907b5ecab!2sMarbella%2C%20M%C3%A1laga%2C%20Spanien!5e0!3m2!1ssv!2sse!4v1731945852787!5m2!1ssv!2sse"
                    width="400"
                    height="300"
                    style={{ border: "0" }}
                    allowFullScreen={true}
                    loading="lazy"
                  />
                )}
              </div>

              {/* What this place offers */}
              <div className="block lg:hidden">
                <h2 className="text-2xl font-bold mt-3">
                  What this place offers
                </h2>
                <div className="mt-2 border-b border-gray-300 pb-3">
                  {houseData.offers.map((offer, index) => (
                    <div key={index} className="flex items-center mt-1">
                      {offer === "Wifi" && <FaWifi className="mr-2 text-2xl" />}
                      {offer === "Kitchen" && (
                        <TbToolsKitchen2 className="mr-2 text-2xl" />
                      )}
                      {offer === "Free parking" && (
                        <CiParking1 className="mr-2 text-2xl" />
                      )}
                      {offer === "Pets allowed" && (
                        <PiPawPrint className="mr-2 text-2xl" />
                      )}
                      {offer === "Pool" && (
                        <MdOutlinePool className="mr-2 text-2xl" />
                      )}
                      {offer === "Sauna" && (
                        <FaTemperatureHigh className="mr-2 text-2xl" />
                      )}
                      {offer === "Football field" && (
                        <GiSoccerField className="mr-2 text-2xl" />
                      )}
                      {offer === "Beach Volleyball" && (
                        <TbPlayVolleyball className="mr-2 text-2xl" />
                      )}
                      {offer === "Private beach" && (
                        <FaUmbrellaBeach className="mr-2 text-2xl" />
                      )}
                      <p>{offer}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* House Rules */}
              <div className="flex flex-col border-b border-gray-300 pb-3 mb-2 lg:hidden">
                <h2 className="text-2xl font-bold mt-3 mb-2">House rules</h2>
                {houseData.house_rules.map((rule, index) => (
                  <p key={index}>{rule}</p>
                ))}
              </div>

              {/* Safety */}
              <div className="flex flex-col border-b border-gray-300 pb-3 mb-2 lg:hidden">
                <h2 className="text-2xl font-bold mt-3 mb-2">Safety</h2>
                {houseData.safety.map((safety, index) => (
                  <p key={index}>{safety}</p>
                ))}
              </div>

              {/* Property Features */}
              <div className="flex flex-col border-b border-gray-300 pb-3 mb-2 lg:hidden">
                <h2 className="text-2xl font-bold mt-3 mb-2">
                  Property features
                </h2>
                {houseData.property_features.map((property, index) => (
                  <p key={index}>{property}</p>
                ))}
              </div>

              {/* Services */}
              <div className="flex flex-col border-b border-gray-300 pb-3 mb-2 lg:hidden">
                <h2 className="text-2xl font-bold mt-3 mb-2">Services</h2>
                {houseData.services.map((service, index) => (
                  <p key={index}>{service}</p>
                ))}
              </div>

              {/* Reviews */}
              <div className="flex flex-col border-b border-gray-300 pb-3 mb-2 pt-4 lg:hidden">
                <div className="flex items-center mb-2">
                  <FaStar className="mr-2" />
                  {reviews.length > 0 && (
                    <div className="text-xl font-bold">
                      <span>{houseData.stars}</span> •{" "}
                      <span>
                        {reviews.length}{" "}
                        {reviews.length === 1 ? "review" : "reviews"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Draggable reviews container */}
                <div
                  ref={scrollRef}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  className="flex space-x-14 overflow-hidden pb-4 cursor-grab"
                >
                  {reviews.length > 0 ? (
                    reviews.map((review, index) => {
                      const wordCount = review.message.split(" ").length;
                      const showMore = wordCount > 50;

                      return (
                        <div
                          key={index}
                          className="flex-shrink-0 w-80 bg-white p-4 rounded-lg shadow-md"
                          style={{
                            marginRight:
                              index < reviews.length - 1 ? "-40px" : "0", // Slight overlap of the next card
                          }}
                        >
                          {/* Review content */}
                          <div className="w-12 h-12 bg-gray-300 mb-4 rounded-full mr-4"></div>
                          <div className="flex flex-col">
                            <div className="flex items-center">
                              <p className="font-semibold mr-2">
                                {review.name}
                              </p>
                            </div>
                            <p className="text-gray-400 text-sm mb-2">
                              {review.date}
                            </p>
                            <p className="text-gray-500 mb-2">
                              {showMore
                                ? `${review.message
                                    .split(" ")
                                    .slice(0, 40)
                                    .join(" ")}...`
                                : review.message}
                            </p>
                            {showMore && (
                              <a href="#" className="text-blue-500 underline">
                                Show more
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p>No reviews available for this house.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Booking Component) */}
          <div className="lg:col-span-1">
            <BookingComponent
              housePrice={houseData.price}
              onSubmit={(data) => {
                console.log("Booking submitted", data);
                router.push(`/house/${id}/confirmation`);
              }}
            />
          </div>
        </div>

        {/* Fixed Request Button */}
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-accent text-white py-3 px-10 rounded shadow-lg block lg:hidden">
          <button
            className="w-full"
            onClick={() => router.push(`/house/${id}/request`)}
          >
            Request
          </button>
        </div>
      </div>
      <Footer className="hidden lg:block" />
    </>
  );
};

export default HouseDetails;
