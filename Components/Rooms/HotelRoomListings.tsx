"use client";

import { useState } from "react";
import RoomCard from "./RoomCard";
import { SlidersHorizontal, ChevronRight, ChevronLeft } from "lucide-react";
import { useGetHavensQuery } from "@/redux/api/roomApi";
import { useRouter } from "next/navigation";

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
  floor?: string;
  photoTour?: {
    livingArea?: string[];
    kitchenette?: string[];
    diningArea?: string[];
    fullBathroom?: string[];
    garage?: string[];
    exterior?: string[];
    pool?: string[];
    bedroom?: string[];
    additional?: string[];
  };
  youtubeUrl?: string;
}

interface Haven {
  uuid_id?: string;
  id?: string;
  haven_name?: string;
  name?: string;
  six_hour_rate?: number;
  weekday_rate?: number;
  weekend_rate?: number;
  images?: Array<{ url: string }>;
  rating?: number;
  review_count?: number;
  capacity?: number;
  amenities?: Record<string, boolean>;
  description?: string;
  full_description?: string;
  beds?: string;
  room_size?: string;
  location?: string;
  tower?: string;
  floor?: string;
  photo_tours?: Array<{ category: string; url: string }>;
  youtube_url?: string;
}

interface HotelRoomListingsProps {
  initialHavens: Haven[];
}

const HotelRoomListings = ({ initialHavens  }: HotelRoomListingsProps) => {
  const { isError } = useGetHavensQuery({});
  const [sortBy, setSortBy] = useState<string>("recommended");
  const [currentPage, setCurrentPage] = useState<Record<string, number>>({});
  const router = useRouter();
  const ROOMS_PER_PAGE = 5;
  // const [rooms] = useState<Room[]>([
  //   {
  //     id: "1",
  //     name: "6-Hour Short Stay",
  //     price: "₱999",
  //     pricePerNight: "6 hours",
  //     images: [
  //       "/Images/haven_9_Living Area_haven_5_jpg_30.jpg",
  //       "/Images/haven9_Living_Area_haven_4_1763025826_3659.jpg",
  //       "/Images/haven9_Full_Bathroom_haven_7_1763025826_8427.jpg",
  //     ],
  //     rating: 4.8,
  //     reviews: 245,
  //     capacity: 2,
  //     amenities: ["WiFi", "AC", "TV", "Comfortable Bed"],
  //     description:
  //       "Perfect for a quick rest or day stay with all essential amenities.",
  //     fullDescription:
  //       "Our 6-Hour Short Stay is ideal for travelers needing a quick rest or day stay. Enjoy comfortable accommodations with all modern amenities in a cozy setting at Haven 9, Tower A.",
  //     beds: "Queen Size Bed",
  //     roomSize: "28 sq.m",
  //     location: "Haven 9",
  //     tower: "Tower A",
  //     photoTour: {
  //       livingArea: [
  //         "/Images/haven_9_Living Area_haven_5_jpg_30.jpg",
  //         "/Images/haven9_Living_Area_haven_4_1763025826_3659.jpg",
  //         "/Images/haven9_Living_Area_haven_7_1764217597_1817.jpg",
  //       ],
  //       kitchenette: [
  //         "/Images/haven9_Kitchenette_haven_7_1763025826_3190.jpg",
  //       ],
  //       fullBathroom: [
  //         "/Images/haven9_Full_Bathroom_haven_7_1763025826_8427.jpg",
  //       ],
  //       bedroom: [
  //         "/Images/haven9_Living_Area_haven_4_1764219962_3222.jpg",
  //       ],
  //     },
  //     youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  //   },
  //   {
  //     id: "2",
  //     name: "10-Hour Extended Stay",
  //     price: "₱1,599",
  //     pricePerNight: "10 hours",
  //     images: [
  //       "/Images/haven_9_Living Area_haven_5_jpg_31.jpg",
  //       "/Images/haven9_Kitchenette_haven_7_1763025826_3190.jpg",
  //       "/Images/haven9_Living_Area_haven_4_1764219962_3222.jpg",
  //     ],
  //     rating: 4.9,
  //     reviews: 189,
  //     capacity: 2,
  //     amenities: ["WiFi", "AC", "Kitchen", "Living Area"],
  //     description:
  //       "Extended stay option with kitchenette and comfortable living space.",
  //     fullDescription:
  //       "Our 10-Hour Extended Stay offers more time to relax and unwind. Features a kitchenette and spacious living area, perfect for those who need a longer stay at Haven 67, Tower A.",
  //     beds: "King Size Bed",
  //     roomSize: "35 sq.m",
  //     location: "Haven 67",
  //     tower: "Tower A",
  //     photoTour: {
  //       livingArea: [
  //         "/Images/haven_9_Living Area_haven_5_jpg_31.jpg",
  //         "/Images/haven9_Living_Area_haven_4_1764219962_3222.jpg",
  //       ],
  //       kitchenette: [
  //         "/Images/haven9_Kitchenette_haven_7_1763025826_3190.jpg",
  //       ],
  //       diningArea: [
  //         "/Images/haven_9_Dining Area_haven_7_jpg_35.jpg",
  //       ],
  //       garage: [
  //         "/Images/haven_9_Garage_haven_4_jpg_37.jpg",
  //       ],
  //     },
  //     youtubeUrl: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
  //   },
  //   {
  //     id: "3",
  //     name: "21-Hour Full Day",
  //     price: "₱1,799",
  //     pricePerNight: "21 hours",
  //     images: [
  //       "/Images/haven9_Living_Area_haven_7_1764217597_1817.jpg",
  //       "/Images/haven_9_Dining Area_haven_7_jpg_35.jpg",
  //       "/Images/haven9_Pool_Black_and_Orange_Illustrative_Happy_Halloween_Instagram_Post_1763025712_1833.jpg",
  //     ],
  //     rating: 5,
  //     reviews: 312,
  //     capacity: 3,
  //     amenities: ["WiFi", "AC", "Kitchen", "Dining Area"],
  //     description:
  //       "Almost a full day experience with premium amenities and spacious layout.",
  //     fullDescription:
  //       "Enjoy 21 hours of comfort in our spacious haven. Features full kitchen, dining area, and modern furnishings perfect for a full day stay at Haven 1, Tower D.",
  //     beds: "1 King + 1 Single Bed",
  //     roomSize: "45 sq.m",
  //     location: "Haven 1",
  //     tower: "Tower D",
  //     photoTour: {
  //       livingArea: [
  //         "/Images/haven9_Living_Area_haven_7_1764217597_1817.jpg",
  //         "/Images/haven_9_Living Area_haven_5_jpg_30.jpg",
  //       ],
  //       diningArea: [
  //         "/Images/haven_9_Dining Area_haven_7_jpg_35.jpg",
  //       ],
  //       pool: [
  //         "/Images/haven9_Pool_Black_and_Orange_Illustrative_Happy_Halloween_Instagram_Post_1763025712_1833.jpg",
  //       ],
  //       exterior: [
  //         "/Images/haven_9_Exterior_haven_5_jpg_38.jpg",
  //       ],
  //       garage: [
  //         "/Images/haven_9_Garage_haven_4_jpg_37.jpg",
  //       ],
  //       fullBathroom: [
  //         "/Images/haven9_Full_Bathroom_haven_7_1763025826_8427.jpg",
  //       ],
  //     },
  //     youtubeUrl: "https://www.youtube.com/watch?v=9bZkp7q19f0",
  //   },
  //   {
  //     id: "4",
  //     name: "Weekday Special",
  //     price: "₱1,999",
  //     pricePerNight: "Mon-Thu",
  //     images: [
  //       "/Images/haven_9_Living Area_haven_5_jpg_30.jpg",
  //       "/Images/haven9_Full_Bathroom_haven_7_1763025826_8427.jpg",
  //       "/Images/haven9_Kitchenette_haven_7_1763025826_3190.jpg",
  //     ],
  //     rating: 4.6,
  //     reviews: 567,
  //     capacity: 2,
  //     amenities: ["WiFi", "AC", "Workstation", "Comfortable Bed"],
  //     description:
  //       "Perfect weekday rate for business travelers and mid-week getaways.",
  //     fullDescription:
  //       "Our Weekday Special offers the best value from Monday to Thursday. Ideal for business travelers with a comfortable workstation and all essential amenities at Haven 2, Tower D.",
  //     beds: "Queen Bed",
  //     roomSize: "30 sq.m",
  //     location: "Haven 2",
  //     tower: "Tower D",
  //   },
  //   {
  //     id: "5",
  //     name: "Weekend Haven",
  //     price: "₱2,499",
  //     pricePerNight: "Fri-Sat",
  //     images: [
  //       "/Images/haven9_Living_Area_haven_4_1764219962_3222.jpg",
  //       "/Images/haven_9_Dining Area_haven_7_jpg_35.jpg",
  //       "/Images/haven_9_Garage_haven_4_jpg_37.jpg",
  //     ],
  //     rating: 4.7,
  //     reviews: 421,
  //     capacity: 2,
  //     amenities: ["WiFi", "AC", "Premium Bedding", "Entertainment"],
  //     description:
  //       "Weekend special rate with premium amenities for a perfect getaway.",
  //     fullDescription:
  //       "Make the most of your weekend with our Friday-Saturday special. Features premium bedding, entertainment options, and modern amenities at Haven 3, Tower D.",
  //     beds: "King Size Bed",
  //     roomSize: "32 sq.m",
  //     location: "Haven 3",
  //     tower: "Tower D",
  //   },
  //   {
  //     id: "6",
  //     name: "Multi-Day Suite",
  //     price: "₱1,899",
  //     pricePerNight: "per night",
  //     images: [
  //       "/Images/haven_9_Exterior_haven_5_jpg_38.jpg",
  //       "/Images/haven9_Pool_Black_and_Orange_Illustrative_Happy_Halloween_Instagram_Post_1763025712_1833.jpg",
  //       "/Images/haven9_Living_Area_haven_7_1764217597_1817.jpg",
  //     ],
  //     rating: 5,
  //     reviews: 98,
  //     capacity: 4,
  //     amenities: ["WiFi", "AC", "Full Kitchen", "Living Room", "Pool Access"],
  //     description:
  //       "Perfect for extended stays with custom rates and flexible schedules.",
  //     fullDescription:
  //       "Our Multi-Day Suite is designed for guests planning longer stays. Enjoy spacious accommodations with full kitchen, living room, and pool access. Custom rates available for extended bookings at Haven 4, Tower D.",
  //     beds: "1 King + 2 Single Beds",
  //     roomSize: "50 sq.m",
  //     location: "Haven 4",
  //     tower: "Tower D",
  //   },
  //   {
  //     id: "7",
  //     name: "Luxury Haven 5",
  //     price: "₱2,299",
  //     pricePerNight: "per night",
  //     images: [
  //       "/Images/haven9_Living_Area_haven_7_1764217597_1817.jpg",
  //       "/Images/haven_9_Dining Area_haven_7_jpg_35.jpg",
  //       "/Images/haven9_Kitchenette_haven_7_1763025826_3190.jpg",
  //     ],
  //     rating: 4.9,
  //     reviews: 156,
  //     capacity: 3,
  //     amenities: ["WiFi", "AC", "Kitchenette", "Dining Area", "Smart TV"],
  //     description:
  //       "Modern luxury haven with premium furnishings and smart home features.",
  //     fullDescription:
  //       "Experience modern luxury at Haven 5. Features smart home technology, premium furnishings, and a fully equipped kitchenette for your convenience at Tower D.",
  //     beds: "1 King + 1 Queen Bed",
  //     roomSize: "42 sq.m",
  //     location: "Haven 5",
  //     tower: "Tower D",
  //   },
  //   {
  //     id: "8",
  //     name: "Family Haven 6",
  //     price: "₱2,799",
  //     pricePerNight: "per night",
  //     images: [
  //       "/Images/haven_9_Living Area_haven_5_jpg_31.jpg",
  //       "/Images/haven9_Living_Area_haven_4_1764219962_3222.jpg",
  //       "/Images/haven9_Full_Bathroom_haven_7_1763025826_8427.jpg",
  //     ],
  //     rating: 4.8,
  //     reviews: 203,
  //     capacity: 5,
  //     amenities: ["WiFi", "AC", "Full Kitchen", "2 Bathrooms", "Kids Area"],
  //     description:
  //       "Spacious family haven with multiple rooms and kid-friendly amenities.",
  //     fullDescription:
  //       "Perfect for families, Haven 6 offers spacious accommodations with separate kids area, two bathrooms, and full kitchen facilities at Tower D.",
  //     beds: "2 King Beds + 1 Single",
  //     roomSize: "60 sq.m",
  //     location: "Haven 6",
  //     tower: "Tower D",
  //   },
  //   {
  //     id: "9",
  //     name: "Premium Haven 7",
  //     price: "₱2,199",
  //     pricePerNight: "per night",
  //     images: [
  //       "/Images/haven9_Pool_Black_and_Orange_Illustrative_Happy_Halloween_Instagram_Post_1763025712_1833.jpg",
  //       "/Images/haven_9_Garage_haven_4_jpg_37.jpg",
  //       "/Images/haven9_Living_Area_haven_7_1764217597_1817.jpg",
  //     ],
  //     rating: 4.7,
  //     reviews: 178,
  //     capacity: 2,
  //     amenities: ["WiFi", "AC", "Pool View", "Balcony", "Mini Bar"],
  //     description:
  //       "Premium room with stunning pool views and private balcony.",
  //     fullDescription:
  //       "Enjoy breathtaking pool views from your private balcony at Haven 7. Features modern amenities and a mini bar for your convenience at Tower D.",
  //     beds: "King Size Bed",
  //     roomSize: "38 sq.m",
  //     location: "Haven 7",
  //     tower: "Tower D",
  //   },
  //   {
  //     id: "10",
  //     name: "Cozy Haven 8",
  //     price: "₱1,699",
  //     pricePerNight: "per night",
  //     images: [
  //       "/Images/haven_9_Living Area_haven_5_jpg_30.jpg",
  //       "/Images/haven9_Kitchenette_haven_7_1763025826_3190.jpg",
  //       "/Images/haven9_Living_Area_haven_4_1763025826_3659.jpg",
  //     ],
  //     rating: 4.6,
  //     reviews: 289,
  //     capacity: 2,
  //     amenities: ["WiFi", "AC", "Kitchenette", "Work Desk"],
  //     description:
  //       "Comfortable and affordable haven perfect for couples and solo travelers.",
  //     fullDescription:
  //       "Haven 8 offers great value with modern comforts. Features a kitchenette and work desk, ideal for both leisure and business stays at Tower D.",
  //     beds: "Queen Bed",
  //     roomSize: "30 sq.m",
  //     location: "Haven 8",
  //     tower: "Tower D",
  //   },
  // ]);

  const rooms: Room[] = initialHavens.map((haven: Haven) => ({
    id: haven.uuid_id ?? haven.id ?? '',
    name: haven.haven_name ?? haven.name ?? "Unnamed Haven",
    price: `₱${haven.six_hour_rate ?? haven.weekday_rate ?? haven.weekend_rate ?? "N/A"}`,
    pricePerNight: "per night",
    images: haven.images?.map((img) => img.url) ?? [],
    rating: haven.rating ?? 4.5,
    reviews: haven.review_count ?? 0,
    capacity: haven.capacity ?? 2,
    amenities: Object.entries(haven.amenities || {})
      .filter(([, value]) => value === true)
      .map(([key]) => key),
    description: haven.description ?? "",
    fullDescription: haven.full_description,
    beds: haven.beds,
    roomSize: haven.room_size,
    location: haven.location,
    tower: haven.tower,
    floor: haven.floor,
    photoTour: haven.photo_tours
      ? haven.photo_tours.reduce((acc: Record<string, string[]>, item) => {
          acc[item.category] = acc[item.category] || [];
          acc[item.category].push(item.url);
          return acc;
        }, {} as Record<string, string[]>)
      : {},
    youtubeUrl: haven.youtube_url,
  })) ?? [];

  // Group rooms by haven number
  const groupedRooms = rooms.reduce((acc, room) => {
    // Extract haven number from room name or location
    const havenMatch = room.name.match(/Haven (\d+)/) || room.location?.match(/Haven (\d+)/);
    const havenNumber = havenMatch ? `Haven ${havenMatch[1]}` : 'Other Havens';
    
    if (!acc[havenNumber]) {
      acc[havenNumber] = [];
    }
    acc[havenNumber].push(room);
    return acc;
  }, {} as Record<string, Room[]>);

  // Sort haven numbers
  const sortedHavenNumbers = Object.keys(groupedRooms).sort((a, b) => {
    const aNum = parseInt(a.replace('Haven ', '')) || 999;
    const bNum = parseInt(b.replace('Haven ', '')) || 999;
    return aNum - bNum;
  });

  const handlePageChange = (havenNumber: string, page: number) => {
    setCurrentPage(prev => ({
      ...prev,
      [havenNumber]: page
    }));
  };

  const handleHavenClick = (havenNumber: string) => {
    // Navigate to haven-specific page
    const havenId = havenNumber.replace('Haven ', '');
    router.push(`/havens/${havenId}`);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-6 sm:py-8">
      <div className="max-w-[2520px] mx-auto px-4 sm:px-6 lg:px-20 xl:px-20">
        {/* Header Section - Airbnb style */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          {/* Results Count */}
          <h2 className="text-sm text-gray-600 dark:text-gray-400">
            {rooms.length} havens
          </h2>

          {/* Filter Dropdown - Airbnb style */}
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl hover:border-gray-400 dark:hover:border-gray-500">
              <SlidersHorizontal className="w-4 h-4 text-gray-700 dark:text-gray-300" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters</span>
            </button>
            
            {/* Price Range Filter */}
            <select className="px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-sm text-gray-700 dark:text-gray-300">
              <option>Price Range</option>
              <option>Under ₱2,000</option>
              <option>₱2,000 - ₱5,000</option>
              <option>₱5,000 - ₱10,000</option>
              <option>Above ₱10,000</option>
            </select>
            
            {/* Room Type Filter */}
            <select className="px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-sm text-gray-700 dark:text-gray-300">
              <option>Room Type</option>
              <option>Standard Room</option>
              <option>Deluxe Room</option>
              <option>Suite</option>
              <option>Family Room</option>
            </select>
          </div>
        </div>

        {isError && (
          <div className="text-center py-20 text-red-500">
            Failed to load rooms
          </div>
        )}

        {/* Room Groups by Haven */}
        {sortedHavenNumbers.map((havenNumber) => {
          const havenRooms = groupedRooms[havenNumber];
          const page = currentPage[havenNumber] || 1;
          const totalPages = Math.ceil(havenRooms.length / ROOMS_PER_PAGE);
          const startIndex = (page - 1) * ROOMS_PER_PAGE;
          const endIndex = startIndex + ROOMS_PER_PAGE;
          const displayedRooms = havenRooms.slice(startIndex, endIndex);

          return (
            <div key={havenNumber} className="mb-12">
              {/* Haven Header - Clickable */}
              <div
                className="mb-6 flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity w-fit"
                onClick={() => handleHavenClick(havenNumber)}
              >
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {havenNumber}
                </h2>
                <ChevronRight className="w-5 h-5 text-brand-primary" />
              </div>

              {/* Room Grid for this Haven */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-6 gap-y-8">
                {displayedRooms.map((room) => (
                  <div key={room.id}>
                    <RoomCard room={room} mode="browse" />
                  </div>
                ))}
              </div>

              {/* Pagination Dots for this Haven */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-8">
                  {/* Previous Button Icon */}
                  <button
                    onClick={() => handlePageChange(havenNumber, Math.max(1, page - 1))}
                    disabled={page === 1}
                    className={`p-2 rounded-full transition-all duration-200 ${
                      page === 1
                        ? 'bg-gray-200 dark:bg-gray-700 cursor-not-allowed opacity-50'
                        : 'bg-brand-primary hover:bg-brand-primaryDark'
                    }`}
                    aria-label="Previous page"
                  >
                    <ChevronLeft className={`w-5 h-5 ${
                      page === 1
                        ? 'text-gray-400 dark:text-gray-500'
                        : 'text-white'
                    }`} />
                  </button>

                  {/* Page Dots */}
                  <div className="flex gap-2 items-center">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(havenNumber, pageNum)}
                        className={`transition-all duration-200 rounded-full ${
                          page === pageNum
                            ? 'w-8 h-3 bg-brand-primary'
                            : 'w-3 h-3 bg-gray-300 dark:bg-gray-600 hover:bg-brand-primary/50 dark:hover:bg-brand-primary/50'
                        }`}
                        aria-label={`Go to page ${pageNum}`}
                      />
                    ))}
                  </div>

                  {/* Next Button Icon */}
                  <button
                    onClick={() => handlePageChange(havenNumber, Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className={`p-2 rounded-full transition-all duration-200 ${
                      page === totalPages
                        ? 'bg-gray-200 dark:bg-gray-700 cursor-not-allowed opacity-50'
                        : 'bg-brand-primary hover:bg-brand-primaryDark'
                    }`}
                    aria-label="Next page"
                  >
                    <ChevronRight className={`w-5 h-5 ${
                      page === totalPages
                        ? 'text-gray-400 dark:text-gray-500'
                        : 'text-white'
                    }`} />
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* Show more button - Airbnb style */}
        {rooms.length > 20 && (
          <div className="flex justify-center mt-12">
            <button className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-100">
              Show more
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelRoomListings;
