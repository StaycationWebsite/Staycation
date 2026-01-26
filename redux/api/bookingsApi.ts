import { Booking } from "@/types/booking";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const bookingsApi = createApi({
  reducerPath: "bookingsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Booking"],
  endpoints: (builder) => ({
    getBookings: builder.query<Booking[], { status?: string } | void>({
      query(params?: { status?: string }) {
        return {
          url: "/bookings",
          params,
        };
      },
      transformResponse: (response: { success: boolean; data: Booking[] }) => {
        return response.data || [];
      },
      providesTags: ["Booking"],
    }),

    // Get booking by ID
    getBookingById: builder.query({
      query(id) {
        return {
          url: `/bookings/${id}`,
        };
      },
      providesTags: ["Booking"],
    }),

    // Create booking
    createBooking: builder.mutation({
      query(body) {
        return {
          url: "/bookings",
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["Booking"],
    }),

    // Update booking status
    updateBookingStatus: builder.mutation({
      query(body) {
        const { id } = body;
        return {
          url: `/bookings/${id}`,
          method: "PUT",
          body,
        };
      },
      async onQueryStarted({ id, status }, { dispatch, queryFulfilled }) {
        // Optimistically update the getBookings cache
        const patchResult = dispatch(
          bookingsApi.util.updateQueryData("getBookings", undefined, (draft) => {
            const booking = draft.find((b) => b.id === id);
            if (booking) {
              booking.status = status;
            }
          })
        );

        // Also handle the case where it might be called with {}
        const patchResultEmpty = dispatch(
          bookingsApi.util.updateQueryData(
            "getBookings",
            {} as any,
            (draft) => {
              const booking = draft.find((b) => b.id === id);
              if (booking) {
                booking.status = status;
              }
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
          patchResultEmpty.undo();
        }
      },
      invalidatesTags: ["Booking"],
    }),

    // Delete booking
    deleteBooking: builder.mutation({
      query(id) {
        return {
          url: `/bookings`,
          method: "DELETE",
          params: { id },
        };
      },
      invalidatesTags: ["Booking"],
    }),

    // Get user's bookings
    getUserBookings: builder.query({
      query({ userId, status }) {
        return {
          url: `/bookings/user/${userId}`,
          params: status ? { status } : {},
        };
      },
      providesTags: ["Booking"],
    }),

    // Get bookings for a specific room/haven
    getRoomBookings: builder.query({
      query(havenId) {
        return {
          url: `/bookings/room/${havenId}`,
        };
      },
      providesTags: ["Booking"],
    }),

    // Update cleaning status
    updateCleaningStatus: builder.mutation({
      query({ id, cleaning_status }) {
        return {
          url: `/bookings/${id}/cleaning`,
          method: "PUT",
          body: { cleaning_status },
        };
      },
      invalidatesTags: ["Booking"],
    }),
  }),
});

export const {
  useGetBookingsQuery,
  useGetBookingByIdQuery,
  useCreateBookingMutation,
  useUpdateBookingStatusMutation,
  useDeleteBookingMutation,
  useGetUserBookingsQuery,
  useGetRoomBookingsQuery,
  useUpdateCleaningStatusMutation,
} = bookingsApi;
