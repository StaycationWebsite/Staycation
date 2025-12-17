"use client";

import { Calendar, Search, Filter, Plus, Eye, Edit, Trash2, MapPin, User, Phone, Mail, CheckCircle, Clock, LogIn, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown } from "lucide-react";
import { useState } from "react";
import ViewBookings from "./Modals/ViewBookings";
import NewBookings from "./Modals/NewBookings";

export default function BookingsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedBooking, setSelectedBooking] = useState<typeof bookings[0] | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);

  const bookings = [
    {
      id: "BK-001",
      guestName: "John Smith",
      email: "john.smith@email.com",
      phone: "+63 912 345 6789",
      haven: "Haven 2",
      checkIn: "2024-03-15",
      checkOut: "2024-03-20",
      guests: 4,
      status: "Confirmed",
      statusColor: "bg-green-100 text-green-700",
      total: "₱25,000",
    },
    {
      id: "BK-002",
      guestName: "Sarah Johnson",
      email: "sarah.j@email.com",
      phone: "+63 923 456 7890",
      haven: "Haven 1",
      checkIn: "2024-03-18",
      checkOut: "2024-03-22",
      guests: 2,
      status: "Pending",
      statusColor: "bg-yellow-100 text-yellow-700",
      total: "₱18,000",
    },
    {
      id: "BK-003",
      guestName: "Mike Wilson",
      email: "mike.w@email.com",
      phone: "+63 934 567 8901",
      haven: "Haven 3",
      checkIn: "2024-03-20",
      checkOut: "2024-03-25",
      guests: 6,
      status: "Cancelled",
      statusColor: "bg-red-100 text-red-700",
      total: "₱30,000",
    },
    {
      id: "BK-004",
      guestName: "Emily Brown",
      email: "emily.b@email.com",
      phone: "+63 945 678 9012",
      haven: "Haven 4",
      checkIn: "2024-03-22",
      checkOut: "2024-03-27",
      guests: 3,
      status: "Confirmed",
      statusColor: "bg-green-100 text-green-700",
      total: "₱22,500",
    },
    {
      id: "BK-005",
      guestName: "David Lee",
      email: "david.lee@email.com",
      phone: "+63 956 789 0123",
      haven: "Haven 2",
      checkIn: "2024-03-25",
      checkOut: "2024-03-30",
      guests: 5,
      status: "Checked-In",
      statusColor: "bg-blue-100 text-blue-700",
      total: "₱27,500",
    },
  ];

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.haven.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterStatus === "all" || booking.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  // Sort bookings
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    if (!sortField) return 0;

    const aValue = a[sortField as keyof typeof a];
    const bValue = b[sortField as keyof typeof b];

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Paginate bookings
  const totalPages = Math.ceil(sortedBookings.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const paginatedBookings = sortedBookings.slice(startIndex, endIndex);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleViewBooking = (booking: typeof bookings[0]) => {
    setSelectedBooking(booking);
    setIsViewModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsViewModalOpen(false);
    setSelectedBooking(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Bookings Management</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage all customer bookings and reservations</p>
        </div>
        <button
          onClick={() => setIsNewBookingModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-primary to-brand-primaryDark text-white rounded-lg hover:shadow-lg hover:scale-[1.02] transition-all font-semibold shadow-[rgba(186,144,60,0.35)]"
        >
          <Plus className="w-5 h-5" />
          New Booking
        </button>

      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Bookings", value: "156", color: "bg-blue-500", icon: Calendar },
          { label: "Confirmed", value: "89", color: "bg-green-500", icon: CheckCircle },
          { label: "Pending", value: "45", color: "bg-yellow-500", icon: Clock },
          { label: "Checked-In", value: "22", color: "bg-indigo-500", icon: LogIn },
        ].map((stat, i) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={i}
              className={`${stat.color} text-white rounded-lg p-6 shadow hover:shadow-lg transition-all`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">{stat.label}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                </div>
                <IconComponent className="w-12 h-12 opacity-50" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900 p-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
            {/* Entries Per Page */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">Show</label>
              <select
                value={entriesPerPage}
                onChange={(e) => {
                  setEntriesPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary text-sm"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
              <label className="text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">entries</label>
            </div>

            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by booking ID, guest name, or haven..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
              />
            </div>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
            >
              <option value="all">All Status</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Checked-In">Checked-In</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings Table - Desktop View */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900 overflow-hidden hidden lg:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border-b-2 border-gray-200 dark:border-gray-600">
              <tr>
                <th
                  onClick={() => handleSort("id")}
                  className="text-left py-4 px-4 text-sm font-bold text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors group whitespace-nowrap"
                >
                  <div className="flex items-center gap-2">
                    Booking ID
                    <ArrowUpDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("guestName")}
                  className="text-left py-4 px-4 text-sm font-bold text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors group whitespace-nowrap"
                >
                  <div className="flex items-center gap-2">
                    Guest Details
                    <ArrowUpDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("haven")}
                  className="text-left py-4 px-4 text-sm font-bold text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors group whitespace-nowrap"
                >
                  <div className="flex items-center gap-2">
                    Haven
                    <ArrowUpDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("checkIn")}
                  className="text-left py-4 px-4 text-sm font-bold text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors group whitespace-nowrap"
                >
                  <div className="flex items-center gap-2">
                    Check-In
                    <ArrowUpDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("checkOut")}
                  className="text-left py-4 px-4 text-sm font-bold text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors group whitespace-nowrap"
                >
                  <div className="flex items-center gap-2">
                    Check-Out
                    <ArrowUpDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                  </div>
                </th>
                <th className="text-center py-4 px-4 text-sm font-bold text-gray-700 dark:text-gray-200 whitespace-nowrap">Guests</th>
                <th
                  onClick={() => handleSort("status")}
                  className="text-center py-4 px-4 text-sm font-bold text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors whitespace-nowrap"
                >
                  <div className="flex items-center justify-center gap-2">
                    Status
                    <ArrowUpDown className="w-4 h-4 text-gray-400" />
                  </div>
                </th>
                <th className="text-right py-4 px-4 text-sm font-bold text-gray-700 dark:text-gray-200 whitespace-nowrap">Total</th>
                <th className="text-center py-4 px-4 text-sm font-bold text-gray-700 dark:text-gray-200 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedBookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="py-4 px-4">
                    <span className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{booking.id}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="space-y-1 min-w-[200px]">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{booking.guestName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <Mail className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{booking.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <Phone className="w-3 h-3 flex-shrink-0" />
                        {booking.phone}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-orange-500 flex-shrink-0" />
                      <span className="font-medium text-gray-700 dark:text-gray-200 text-sm whitespace-nowrap">{booking.haven}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">{booking.checkIn}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">{booking.checkOut}</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{booking.guests}</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${booking.statusColor}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="font-bold text-gray-800 dark:text-gray-100 text-sm whitespace-nowrap">{booking.total}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => handleViewBooking(booking)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-brand-primary hover:bg-brand-primaryLighter rounded-lg transition-colors" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile/Tablet Card View */}
      <div className="lg:hidden space-y-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900 overflow-hidden">
        {paginatedBookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900 p-4 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Booking ID</p>
                <p className="font-bold text-gray-800 dark:text-gray-100">{booking.id}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${booking.statusColor}`}>
                {booking.status}
              </span>
            </div>

            {/* Guest Info */}
            <div className="mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Guest Details</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{booking.guestName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-xs text-gray-600 dark:text-gray-300 break-all">{booking.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-xs text-gray-600 dark:text-gray-300">{booking.phone}</span>
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div className="grid grid-cols-2 gap-3 mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Haven</p>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-orange-500 flex-shrink-0" />
                  <span className="font-medium text-gray-700 dark:text-gray-200 text-sm">{booking.haven}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Guests</p>
                <p className="font-semibold text-gray-800 dark:text-gray-100">{booking.guests}</p>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Check-In</p>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{booking.checkIn}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Check-Out</p>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{booking.checkOut}</p>
              </div>
            </div>

            {/* Total and Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Amount</p>
                <p className="font-bold text-gray-800 dark:text-gray-100 text-lg">{booking.total}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleViewBooking(booking)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="View"
                >
                  <Eye className="w-5 h-5" />
                </button>
                <button className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors" title="Edit">
                  <Edit className="w-5 h-5" />
                </button>
                <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 px-6 py-4 border-t border-gray-200 dark:border-gray-600">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Showing {startIndex + 1} to {Math.min(endIndex, sortedBookings.length)} of {sortedBookings.length} entries
              {searchTerm || filterStatus !== "all" ? ` (filtered from ${bookings.length} total entries)` : ""}
            </p>
            <div className="flex gap-1">
              {/* First Page */}
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="First Page"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>

              {/* Previous Page */}
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Page Numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                      currentPage === pageNum
                        ? "bg-gradient-to-r from-brand-primary to-brand-primaryDark text-white shadow-md"
                        : "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {/* Next Page */}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Last Page */}
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Last Page"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* View Booking Modal */}
      {isViewModalOpen && selectedBooking && (
        <ViewBookings booking={selectedBooking} onClose={handleCloseModal} />
      )}

      {isNewBookingModalOpen && (
        <NewBookings onClose={() => setIsNewBookingModalOpen(false)} />
      )}

    </div>
  );
}