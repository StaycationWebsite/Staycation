import SearchBarSticky from "@/Components/HeroSection/SearchBarSticky";
import HotelRoomListings from "@/Components/Rooms/HotelRoomListings";
import Footer from "@/Components/Footer";
import FeatureSectionMain from "@/Components/Features/FeatureSectionMain";


const getAllHavens = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/haven`, {
    cache: 'no-cache'
  });

  if (!res.ok) {
    return null;
  }

  return res.json();
}

export default async function RoomsPage() {
  const response = await getAllHavens();
  const havens = response?.data || [];
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <SearchBarSticky />
      {/* Add top padding to account for fixed header + sticky search bar */}
      <div className="pt-[220px] sm:pt-[240px] md:pt-[260px] lg:pt-[280px] bg-white dark:bg-gray-900">
        <HotelRoomListings initialHavens={havens}/>
      </div>
      <FeatureSectionMain />
      <Footer />
    </div>
  )
}