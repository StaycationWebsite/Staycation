'use client';

import { useState } from 'react';
import { Heart, MapPin, Star, Trash2 } from 'lucide-react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import { useGetUserWishlistQuery, useRemoveFromWishlistMutation } from '@/redux/api/wishlistApi';

interface MyWishlistPageProps {
  initialData: {
    success: boolean;
    data: any[];
  };
  userId: string;
}

const MyWishlistPage = ({ initialData, userId }: MyWishlistPageProps) => {
  // RTK Query hooks - skip if we have initial data on first render
  const { data: wishlistData, isLoading, error, refetch } = useGetUserWishlistQuery(userId);

  const [removeFromWishlist, { isLoading: isRemoving }] = useRemoveFromWishlistMutation();

  // Use SSR data if RTK Query hasn't loaded yet, otherwise use RTK Query data
  const wishlistItems = (wishlistData?.data || initialData?.data || []);

  const handleRemoveFromWishlist = async (wishlistId: string) => {
    try {
      await removeFromWishlist(wishlistId).unwrap();
      toast.success('Removed from wishlist');
      refetch(); // Refetch the wishlist
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove from wishlist');
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
              My Wishlist
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {wishlistItems.length} saved {wishlistItems.length === 1 ? 'room' : 'rooms'}
            </p>
          </div>

          {/* Empty State */}
          {wishlistItems.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center">
            <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Your wishlist is empty
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start adding rooms you love to your wishlist!
            </p>
            <Link href="/rooms">
              <button className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105">
                Browse Rooms
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item: any) => {
              const firstImage = Array.isArray(item.images) && item.images.length > 0
                ? item.images[0]
                : '/Images/bg.jpg';

              return (
                <div
                  key={item.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group"
                >
                  {/* Room Image */}
                  <div className="relative h-64">
                    <img
                      src={firstImage}
                      alt={item.room_name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <button
                      onClick={() => handleRemoveFromWishlist(item.id)}
                      disabled={isRemoving}
                      className="absolute top-4 right-4 p-2.5 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-all duration-300 group/btn disabled:opacity-50"
                    >
                      <Heart className="w-5 h-5 fill-red-500 text-red-500 group-hover/btn:scale-110 transition-transform" />
                    </button>
                  </div>

                  {/* Room Details */}
                  <div className="p-6">
                    {/* Room Name */}
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 line-clamp-1">
                      {item.room_name}
                    </h3>

                    {/* Location */}
                    <div className="flex items-center gap-1 mb-4">
                      <MapPin className="w-4 h-4 text-orange-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {item.tower || 'Quezon City'}
                      </span>
                    </div>

                    {/* Price and Button */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Starting from</p>
                        <p className="text-2xl font-bold text-orange-500">₱{item.price}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">per 6 hours</p>
                      </div>
                      <Link href={`/rooms/${item.haven_id}`}>
                        <button className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md">
                          Book Now
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        </div>
      </div>
    </>
  );
};

export default MyWishlistPage;
