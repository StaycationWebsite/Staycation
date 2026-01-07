"use client";

import {
  FileText,
  Search,
  Filter,
  ArrowUpDown,
  MapPin,
  User,
  CheckCircle,
  Clock,
  Truck,
  Eye,
  XCircle,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";
import { useMemo, useState } from "react";

type DeliverableItem =
  | "Pool pass"
  | "Bath robe"
  | "Guest kit"
  | "Towels"
  | "Extra comforter"
  | "Extra slippers";

interface RequestedDeliverable {
  item: DeliverableItem;
  qty: number;
  price: number;
}

type DeliverableStatus = "Pending" | "Prepared" | "Delivered" | "Cancelled";

interface DeliverableRow {
  deliverables_id: string;
  guest: string;
  haven: string;
  checkin: string;
  checkout: string;
  status: DeliverableStatus;
  statusColor: string;
  requested: RequestedDeliverable[];
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 2,
  }).format(value);
};

export default function DeliverablesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | DeliverableStatus>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [sortField, setSortField] = useState<keyof DeliverableRow | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const [rows, setRows] = useState<DeliverableRow[]>([
    {
      deliverables_id: "DL-001",
      guest: "John Smith",
      haven: "Haven 2",
      checkin: "2024-03-15 15:00",
      checkout: "2024-03-20 11:00",
      status: "Prepared",
      statusColor: "bg-indigo-100 text-indigo-700",
      requested: [
        { item: "Guest kit", qty: 1, price: 0 },
        { item: "Towels", qty: 4, price: 0 },
      ],
    },
    {
      deliverables_id: "DL-002",
      guest: "Sarah Johnson",
      haven: "Haven 1",
      checkin: "2024-03-18 14:00",
      checkout: "2024-03-22 11:00",
      status: "Pending",
      statusColor: "bg-yellow-100 text-yellow-700",
      requested: [
        { item: "Pool pass", qty: 2, price: 150 },
        { item: "Bath robe", qty: 2, price: 120 },
      ],
    },
    {
      deliverables_id: "DL-003",
      guest: "Mike Wilson",
      haven: "Haven 3",
      checkin: "2024-03-20 15:00",
      checkout: "2024-03-25 11:00",
      status: "Delivered",
      statusColor: "bg-green-100 text-green-700",
      requested: [
        { item: "Guest kit", qty: 1, price: 0 },
        { item: "Extra slippers", qty: 3, price: 80 },
      ],
    },
    {
      deliverables_id: "DL-004",
      guest: "Emily Brown",
      haven: "Haven 4",
      checkin: "2024-03-22 15:00",
      checkout: "2024-03-27 11:00",
      status: "Pending",
      statusColor: "bg-yellow-100 text-yellow-700",
      requested: [
        { item: "Extra comforter", qty: 1, price: 250 },
        { item: "Towels", qty: 2, price: 0 },
      ],
    },
    {
      deliverables_id: "DL-005",
      guest: "David Lee",
      haven: "Haven 2",
      checkin: "2024-03-25 15:00",
      checkout: "2024-03-30 11:00",
      status: "Cancelled",
      statusColor: "bg-red-100 text-red-700",
      requested: [{ item: "Pool pass", qty: 0, price: 150 }],
    },
  ]);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchesSearch =
        row.deliverables_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.guest.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter = filterStatus === "all" || row.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [filterStatus, rows, searchTerm]);

  const sortedRows = useMemo(() => {
    const copy = [...filteredRows];
    if (!sortField) return copy;
    return copy.sort((a, b) => {
      if (String(a[sortField] ?? "").toLowerCase() < String(b[sortField] ?? "").toLowerCase()) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (String(a[sortField] ?? "").toLowerCase() > String(b[sortField] ?? "").toLowerCase()) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [filteredRows, sortDirection, sortField]);

  const totalPages = Math.ceil(sortedRows.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const paginatedRows = sortedRows.slice(startIndex, endIndex);

  const handleSort = (field: keyof DeliverableRow) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const updateRequestedQty = (deliverables_id: string, item: DeliverableItem, qty: number) => {
    const safeQty = Number.isFinite(qty) ? Math.max(0, Math.floor(qty)) : 0;
    setRows((prev) =>
      prev.map((row) => {
        if (row.deliverables_id !== deliverables_id) return row;
        return {
          ...row,
          requested: row.requested.map((r) => (r.item === item ? { ...r, qty: safeQty } : r)),
        };
      })
    );
  };

  const setRowStatus = (deliverables_id: string, status: DeliverableStatus, statusColor: string) => {
    setRows((prev) =>
      prev.map((row) =>
        row.deliverables_id === deliverables_id
          ? {
              ...row,
              status,
              statusColor,
            }
          : row
      )
    );
  };

  const totalCount = rows.length;
  const pendingCount = rows.filter((r) => r.status === "Pending").length;
  const preparedCount = rows.filter((r) => r.status === "Prepared").length;
  const deliveredCount = rows.filter((r) => r.status === "Delivered").length;

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Deliverables Management</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Prepare and track guest deliverables per booking</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Deliverables", value: String(totalCount), color: "bg-purple-500", icon: FileText },
          { label: "Pending", value: String(pendingCount), color: "bg-yellow-500", icon: Clock },
          { label: "Prepared", value: String(preparedCount), color: "bg-indigo-500", icon: CheckCircle },
          { label: "Delivered", value: String(deliveredCount), color: "bg-green-500", icon: Truck },
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
                placeholder="Search by deliverables ID or guest name..."
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
              <option value="Pending">Pending</option>
              <option value="Prepared">Prepared</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1250px]">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border-b-2 border-gray-200 dark:border-gray-600">
              <tr>
                <th
                  onClick={() => handleSort("deliverables_id")}
                  className="text-left py-4 px-4 text-sm font-bold text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors group whitespace-nowrap"
                >
                  <div className="flex items-center gap-2">
                    Deliverables ID
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
                  onClick={() => handleSort("haven")}
                  className="text-left py-4 px-4 text-sm font-bold text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors group whitespace-nowrap"
                >
                  <div className="flex items-center gap-2">
                    Haven
                    <ArrowUpDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:text-gray-300 dark:group-hover:text-gray-100" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("checkin")}
                  className="text-left py-4 px-4 text-sm font-bold text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors group whitespace-nowrap"
                >
                  <div className="flex items-center gap-2">
                    Check-In
                    <ArrowUpDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:text-gray-300 dark:group-hover:text-gray-100" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("checkout")}
                  className="text-left py-4 px-4 text-sm font-bold text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors group whitespace-nowrap"
                >
                  <div className="flex items-center gap-2">
                    Check-Out
                    <ArrowUpDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:text-gray-300 dark:group-hover:text-gray-100" />
                  </div>
                </th>
                <th className="text-left py-4 px-4 text-sm font-bold text-gray-700 dark:text-gray-200 whitespace-nowrap">Deliverables</th>
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
              {paginatedRows.map((row) => (
                <tr key={row.deliverables_id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="py-4 px-4">
                    <span className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{row.deliverables_id}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2 min-w-[180px]">
                      <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="font-semibold text-gray-800 dark:text-gray-100 text-sm">{row.guest}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-orange-500 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">{row.haven}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">{row.checkin}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">{row.checkout}</span>
                  </td>
                  <td className="py-4 px-4">
                    {row.requested.length === 0 || row.requested.every((r) => r.qty === 0) ? (
                      <span className="text-sm text-gray-400 dark:text-gray-500">No requested deliverables</span>
                    ) : (
                      <div className="min-w-[420px]">
                        <div className="grid grid-cols-12 gap-2 text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-2">
                          <div className="col-span-5">Item</div>
                          <div className="col-span-3 text-center">Qty</div>
                          <div className="col-span-2 text-right">Price</div>
                          <div className="col-span-2 text-right">Total</div>
                        </div>
                        <div className="space-y-2">
                          {row.requested
                            .filter((r) => r.qty > 0)
                            .map((r) => (
                              <div key={r.item} className="grid grid-cols-12 gap-2 items-center">
                                <div className="col-span-5">
                                  <span className="text-sm font-medium text-gray-800 dark:text-gray-100">{r.item}</span>
                                </div>
                                <div className="col-span-3 flex justify-center">
                                  <input
                                    type="number"
                                    min={0}
                                    value={r.qty}
                                    onChange={(e) => updateRequestedQty(row.deliverables_id, r.item, Number(e.target.value))}
                                    className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg text-sm text-center focus:ring-2 focus:ring-brand-primary focus:border-orange-500"
                                  />
                                </div>
                                <div className="col-span-2 text-right">
                                  <span className="text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">{formatCurrency(r.price)}</span>
                                </div>
                                <div className="col-span-2 text-right">
                                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-100 whitespace-nowrap">
                                    {formatCurrency(r.price * r.qty)}
                                  </span>
                                </div>
                              </div>
                            ))}
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600 flex items-center justify-end">
                          <span className="text-sm font-bold text-gray-800 dark:text-gray-100 whitespace-nowrap">
                            Subtotal: {formatCurrency(row.requested.reduce((sum, r) => sum + r.price * r.qty, 0))}
                          </span>
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${row.statusColor}`}>
                      {row.status}
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
                        className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                        title="Mark Prepared"
                        type="button"
                        onClick={() => setRowStatus(row.deliverables_id, "Prepared", "bg-indigo-100 text-indigo-700")}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                        title="Mark Delivered"
                        type="button"
                        onClick={() => setRowStatus(row.deliverables_id, "Delivered", "bg-green-100 text-green-700")}
                      >
                        <Truck className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        title="Cancel"
                        type="button"
                        onClick={() => setRowStatus(row.deliverables_id, "Cancelled", "bg-red-100 text-red-700")}
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

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 px-6 py-4 border-t border-gray-200 dark:border-gray-600">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Showing {sortedRows.length === 0 ? 0 : startIndex + 1} to {Math.min(endIndex, sortedRows.length)} of {sortedRows.length} entries
              {searchTerm || filterStatus !== "all" ? ` (filtered from ${rows.length} total entries)` : ""}
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