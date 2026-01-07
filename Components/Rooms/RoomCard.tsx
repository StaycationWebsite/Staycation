"use client";

import { Star, User, MapPin, Video, X } from "lucide-react";
import RoomImageGallery from "./RoomImageGallery";
import AmenityBadge from "./AmenityBadge";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Room {
  id: string;
  name: string;
  price: string;
  pricePerNight: string;
  images: string[];
  rating: number;
  reviews: number;
  capacity: number;
  amenities: string[];
  description: string;
  fullDescription?: string;
  beds?: string;
  roomSize?: string;
  location?: string;
  tower?: string;
  youtubeUrl?: string;
}
interface RoomCardsProps {
  room: Room;
  mode?: "select" | "browse"; // 'select' for filtered search, 'browse' for homepage
}
const RoomCard = ({ room, mode = "browse" }: RoomCardsProps) => {
  const router = useRouter();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const handleSelect = () => {
    // Navigate to room details for booking
    router.push(`/rooms/${room.id}`);
  };

  const handleImageClick = () => {
    // Navigate to room details when image is clicked
    router.push(`/rooms/${room.id}`);
  };

  const handleVideoClick = () => {
    // Open video modal
    if (room.youtubeUrl) {
      setIsVideoModalOpen(true);
    }
  };

  const closeVideoModal = () => {
    setIsVideoModalOpen(false);
  };

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-t-lg sm:rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 animate-fade-in slide-in-from-bottom duration-500">
      {/* Image Gallery - Clickable */}
      <div onClick={handleImageClick} className="cursor-pointer">
        <RoomImageGallery images={room.images} />
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        {/* Rating and Revies */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                className={`w-4 h-4 ${
                  index < Math.floor(room.rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300 dark:text-gray-600"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {room.rating} ({room.reviews} reviews)
          </span>
        </div>

        {/* Room Name */}
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-2 line-clamp-2">
          {room.name}
        </h3>

        {/* Location */}
        {room.location && room.tower && (
          <div className="flex items-center gap-1 mb-2">
            <MapPin className="w-4 h-4 text-orange-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              {room.tower}, {room.location}
            </span>
          </div>
        )}

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
          {room.description}
        </p>

        {/* Amenities */}
        <div className="flex flex-wrap gap-2 mb-4">
          {(Array.isArray(room.amenities) ? room.amenities : [])
            .slice(0, 2)
            .map((amenity, index) => (
              <AmenityBadge key={index} amenity={amenity} />
            ))}
        </div>

        {/* Capacity */}
        <div className="flex items-center gap-2 mb-4 text-sm text-gray-600 dark:text-gray-300">
          <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Up to {room.capacity} guests</span>
        </div>

        {/* Price and Button */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Starting from</p>
            <p className="text-2xl sm:text-3xl font-bold text-orange-400">
              {room.price}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{room.pricePerNight}</p>
          </div>

          {/* Conditional Button based on mode */}
          {mode === "select" ? (
            // SELECT button for filtered search results
            <button
              onClick={handleSelect}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 text-sm sm:text-base whitespace-nowrap shadow-md hover:shadow-lg"
            >
              SELECT
            </button>
          ) : (
            // VIDEO LINKS button for homepage browse
            <button
              onClick={handleVideoClick}
              disabled={!room.youtubeUrl}
              className={`flex items-center gap-2 font-semibold px-4 py-2 rounded-lg transition-all duration-300 transform text-sm sm:text-base whitespace-nowrap ${
                room.youtubeUrl
                  ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white hover:scale-105 active:scale-95 shadow-md hover:shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Video className="w-4 h-4" />
              Video Links
            </button>
          )}
        </div>
      </div>

      {/* Video Modal */}
      {isVideoModalOpen && room.youtubeUrl && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={closeVideoModal}
        >
          <div
            className="relative w-full max-w-4xl bg-black rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeVideoModal}
              className="absolute top-4 right-4 z-10 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 transition-colors shadow-lg"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Video Title */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Video className="w-5 h-5" />
                {room.name} - Virtual Tour
              </h3>
            </div>

            {/* YouTube Video Embed */}
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${getYouTubeVideoId(room.youtubeUrl)}?autoplay=1`}
                title={`${room.name} Video Tour`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomCard;
