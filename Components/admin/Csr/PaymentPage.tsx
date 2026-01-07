"use client";

import {
  DollarSign,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  ArrowUpDown,
  User,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  Image as ImageIcon,
} from "lucide-react";
import { useMemo, useState } from "react";

type PaymentStatus = "Paid" | "Pending" | "Rejected";

interface PaymentRow {
  booking_id: string;
  guest: string;
  amount: string;
  payment_proof?: string;
  status: PaymentStatus;
  statusColor: string;
}

export default function PaymentPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | PaymentStatus>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [sortField, setSortField] = useState<keyof PaymentRow | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const payments: PaymentRow[] = [
    {
      booking_id: "BK-001",
      guest: "John Smith",
      amount: "₱25,000",
      payment_proof: "/payment_proofs/sample-proof-1.jpg",
      status: "Paid",
      statusColor: "bg-green-100 text-green-700",
    },
    {
      booking_id: "BK-002",
      guest: "Sarah Johnson",
      amount: "₱18,000",
      payment_proof: "/payment_proofs/sample-proof-2.jpg",
      status: "Pending",
      statusColor: "bg-yellow-100 text-yellow-700",
    },
    {
      booking_id: "BK-003",
      guest: "Mike Wilson",
      amount: "₱30,000",
      payment_proof: "/payment_proofs/sample-proof-3.jpg",
      status: "Rejected",
      statusColor: "bg-red-100 text-red-700",
    },
    {
      booking_id: "BK-004",
      guest: "Emily Brown",
      amount: "₱22,500",
      payment_proof: "/payment_proofs/sample-proof-4.jpg",
      status: "Paid",
      statusColor: "bg-green-100 text-green-700",
    },
    {
      booking_id: "BK-005",
      guest: "David Lee",
      amount: "₱27,500",
      payment_proof: "/payment_proofs/sample-proof-5.jpg",
      status: "Pending",
      statusColor: "bg-yellow-100 text-yellow-700",
    },
    {
      booking_id: "BK-002",
      guest: "Sarah Johnson",
      amount: "₱18,000",
      payment_proof: "/payment_proofs/sample-proof-2.jpg",
      status: "Pending",
      statusColor: "bg-yellow-100 text-yellow-700",
    },
    {
      booking_id: "BK-003",
      guest: "Mike Wilson",
      amount: "₱30,000",
      payment_proof: "/payment_proofs/sample-proof-3.jpg",
      status: "Rejected",
      statusColor: "bg-red-100 text-red-700",
    },
    {
      booking_id: "BK-004",
      guest: "Emily Brown",
      amount: "₱22,500",
      payment_proof: "/payment_proofs/sample-proof-4.jpg",
      status: "Paid",
      statusColor: "bg-green-100 text-green-700",
    },
    {
      booking_id: "BK-005",
      guest: "David Lee",
      amount: "₱27,500",
      payment_proof: "/payment_proofs/sample-proof-5.jpg",
      status: "Pending",
      statusColor: "bg-yellow-100 text-yellow-700",
    },
  ];

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const matchesSearch =
        payment.booking_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.guest.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter = filterStatus === "all" || payment.status === filterStatus;

      return matchesSearch && matchesFilter;
    });
  }, [filterStatus, payments, searchTerm]);

  const sortedPayments = useMemo(() => {
    const copy = [...filteredPayments];
    if (!sortField) return copy;
    return copy.sort((a, b) => {
      if (String(a[sortField] ?? "").toLowerCase() < String(b[sortField] ?? "").toLowerCase()) return sortDirection === "asc" ? -1 : 1;
      if (String(a[sortField] ?? "").toLowerCase() > String(b[sortField] ?? "").toLowerCase()) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredPayments, sortDirection, sortField]);

  const totalPages = Math.ceil(sortedPayments.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const paginatedPayments = sortedPayments.slice(startIndex, endIndex);

  const handleSort = (field: keyof PaymentRow) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const totalCount = payments.length;
  const paidCount = payments.filter((p) => p.status === "Paid").length;
  const pendingCount = payments.filter((p) => p.status === "Pending").length;
  const rejectedCount = payments.filter((p) => p.status === "Rejected").length;

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Payments Management</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Review and manage payment submissions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Payments", value: String(totalCount), color: "bg-green-500", icon: DollarSign },
          { label: "Paid", value: String(paidCount), color: "bg-emerald-500", icon: CheckCircle },
          { label: "Pending", value: String(pendingCount), color: "bg-yellow-500", icon: Clock },
          { label: "Rejected", value: String(rejectedCount), color: "bg-red-500", icon: XCircle },
        ].map((stat, i) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={i}
              className={`${stat.color} text-white rounded-lg p-6 shadow dark:shadow-gray-900 hover:shadow-lg transition-all`}
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

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900 p-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">Show</label>
              <select
                value={entriesPerPage}
                onChange={(e) => {
                  setEntriesPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-orange-500 text-sm"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
              <label className="text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">entries</label>
            </div>

            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search by booking ID or guest name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-orange-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value as any);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-orange-500"
            >
              <option value="all">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900 overflow-hidden hidden lg:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border-b-2 border-gray-200 dark:border-gray-600">
              <tr>
                <th
                  onClick={() => handleSort("booking_id")}
                  className="text-left py-4 px-4 text-sm font-bold text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors group whitespace-nowrap"
                >
                  <div className="flex items-center gap-2">
                    Booking ID
                    <ArrowUpDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:text-gray-300 dark:group-hover:text-gray-100" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("guest")}
                  className="text-left py-4 px-4 text-sm font-bold text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors group whitespace-nowrap"
                >
                  <div className="flex items-center gap-2">
                    Guest
                    <ArrowUpDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:text-gray-300 dark:group-hover:text-gray-100" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("amount")}
                  className="text-right py-4 px-4 text-sm font-bold text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors group whitespace-nowrap"
                >
                  <div className="flex items-center justify-end gap-2">
                    Amount
                    <ArrowUpDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:text-gray-300 dark:group-hover:text-gray-100" />
                  </div>
                </th>
                <th className="text-center py-4 px-4 text-sm font-bold text-gray-700 dark:text-gray-200 whitespace-nowrap">Payment Proof</th>
                <th
                  onClick={() => handleSort("status")}
                  className="text-center py-4 px-4 text-sm font-bold text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors whitespace-nowrap"
                >
                  <div className="flex items-center justify-center gap-2">
                    Status
                    <ArrowUpDown className="w-4 h-4 text-gray-400 dark:text-gray-300" />
                  </div>
                </th>
                <th className="text-center py-4 px-4 text-sm font-bold text-gray-700 dark:text-gray-200 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPayments.map((payment) => (
                <tr
                  key={payment.booking_id}
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="py-4 px-4">
                    <span className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{payment.booking_id}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2 min-w-[200px]">
                      <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{payment.guest}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="font-bold text-gray-800 dark:text-gray-100 text-sm whitespace-nowrap">{payment.amount}</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    {payment.payment_proof ? (
                      <a
                        href={payment.payment_proof}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                      >
                        <ImageIcon className="w-4 h-4" />
                        View
                      </a>
                    ) : (
                      <span className="text-sm text-gray-400 dark:text-gray-500">No proof</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${payment.statusColor}`}
                    >
                      {payment.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                        title="View"
                        type="button"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                        title="Approve"
                        type="button"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        title="Reject"
                        type="button"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="lg:hidden space-y-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900 overflow-hidden">
        {paginatedPayments.map((payment) => (
          <div
            key={payment.booking_id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900 p-4 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all"
          >
            <div className="flex items-start justify-between mb-3 pb-3 border-b border-gray-200 dark:border-gray-600">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Booking ID</p>
                <p className="font-bold text-gray-800 dark:text-gray-100">{payment.booking_id}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${payment.statusColor}`}>
                {payment.status}
              </span>
            </div>

            <div className="mb-3 pb-3 border-b border-gray-200 dark:border-gray-600">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Guest</p>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{payment.guest}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3 pb-3 border-b border-gray-200 dark:border-gray-600">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Amount</p>
                <p className="font-bold text-gray-800 dark:text-gray-100">{payment.amount}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Payment Proof</p>
                {payment.payment_proof ? (
                  <a
                    href={payment.payment_proof}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 dark:hover:text-blue-400"
                  >
                    <ImageIcon className="w-4 h-4" />
                    View
                  </a>
                ) : (
                  <span className="text-sm text-gray-400 dark:text-gray-500">No proof</span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200 dark:border-gray-600">
              <button
                className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                title="View"
                type="button"
              >
                <Eye className="w-5 h-5" />
              </button>
              <button
                className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                title="Approve"
                type="button"
              >
                <CheckCircle className="w-5 h-5" />
              </button>
              <button
                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                title="Reject"
                type="button"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 px-6 py-4 border-t border-gray-200 dark:border-gray-600">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Showing {sortedPayments.length === 0 ? 0 : startIndex + 1} to {Math.min(endIndex, sortedPayments.length)} of {sortedPayments.length} entries
              {searchTerm || filterStatus !== "all" ? ` (filtered from ${payments.length} total entries)` : ""}
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1 || totalPages === 0}
                className="p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="First Page"
                type="button"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1 || totalPages === 0}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                type="button"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: Math.min(5, totalPages || 1) }, (_, i) => {
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
                        ? "bg-orange-500 text-white shadow-md"
                        : "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600"
                    }`}
                    disabled={totalPages === 0}
                    type="button"
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                type="button"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages || totalPages === 0}
                className="p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Last Page"
                type="button"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}