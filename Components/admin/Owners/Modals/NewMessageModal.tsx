"use client";

import { useState, useMemo } from "react";
import { X, Search, UserCircle, MessageSquare, Loader2 } from "lucide-react";
import { useGetEmployeesQuery } from "@/redux/api/employeeApi";
import { useCreateConversationMutation } from "@/redux/api/messagesApi";
import toast from "react-hot-toast";

interface NewMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId: string;
  onConversationCreated?: (conversationId: string) => void;
}

export default function NewMessageModal({
  isOpen,
  onClose,
  currentUserId,
  onConversationCreated,
}: NewMessageModalProps) {
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const { data: employeesData, isLoading } = useGetEmployeesQuery({});
  const [createConversation, { isLoading: isCreating }] = useCreateConversationMutation();

  const employees = employeesData?.data || [];

  // Filter out current user and filter by search
  const filteredEmployees = useMemo(() => {
    const term = search.trim().toLowerCase();
    return employees
      .filter((emp) => emp.id !== currentUserId)
      .filter((emp) => {
        if (!term) return true;
        const fullName = `${emp.first_name} ${emp.last_name}`.toLowerCase();
        const role = emp.role?.toLowerCase() || "";
        const email = emp.email?.toLowerCase() || "";
        return fullName.includes(term) || role.includes(term) || email.includes(term);
      });
  }, [employees, currentUserId, search]);

  const handleCreateConversation = async () => {
    if (!selectedUser) {
      toast.error("Please select a user to message");
      return;
    }

    try {
      const conversationName = `${selectedUser.first_name} ${selectedUser.last_name}`;
      const result = await createConversation({
        name: conversationName,
        type: "internal",
        participant_ids: [currentUserId, selectedUser.id],
      }).unwrap();

      toast.success(`Conversation with ${conversationName} created!`);

      // Notify parent component
      if (onConversationCreated && result.data?.id) {
        onConversationCreated(result.data.id);
      }

      // Reset and close
      setSelectedUser(null);
      setSearch("");
      onClose();
    } catch (error: any) {
      console.error("Failed to create conversation:", error);
      toast.error(error?.data?.error || "Failed to create conversation");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-yellow-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">New Message</h2>
              <p className="text-sm text-gray-500">Select a staff member to message</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-orange-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, role, or email..."
              className="w-full pl-10 pr-3 py-2.5 rounded-full bg-gray-100 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-orange-200 focus:border-orange-300 transition-all"
            />
          </div>
        </div>

        {/* Staff List */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
          ) : filteredEmployees.length > 0 ? (
            <div className="space-y-2">
              {filteredEmployees.map((employee) => {
                const isSelected = selectedUser?.id === employee.id;
                const fullName = `${employee.first_name} ${employee.last_name}`;

                return (
                  <button
                    key={employee.id}
                    type="button"
                    onClick={() => setSelectedUser(employee)}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      isSelected
                        ? "border-orange-500 bg-gradient-to-r from-orange-50 to-yellow-50 shadow-md"
                        : "border-gray-200 hover:border-orange-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      {employee.profile_image_url ? (
                        <img
                          src={employee.profile_image_url}
                          alt={fullName}
                          className="w-12 h-12 rounded-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "";
                            target.onerror = null;
                          }}
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {employee.first_name.charAt(0)}
                          {employee.last_name.charAt(0)}
                        </div>
                      )}

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                          {fullName}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-gray-600 capitalize">
                            {employee.role || "Staff"}
                          </span>
                          {employee.department && (
                            <>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-sm text-gray-500">
                                {employee.department}
                              </span>
                            </>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-1 truncate">
                          {employee.email}
                        </p>
                      </div>

                      {/* Selection Indicator */}
                      {isSelected && (
                        <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <UserCircle className="w-16 h-16 text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium mb-1">No staff members found</p>
              <p className="text-gray-400 text-sm">
                {search ? "Try a different search term" : "No employees available"}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between gap-4">
            <div className="text-sm text-gray-600">
              {selectedUser ? (
                <span>
                  Selected:{" "}
                  <span className="font-semibold text-gray-900">
                    {selectedUser.first_name} {selectedUser.last_name}
                  </span>
                </span>
              ) : (
                <span>Select a staff member to start messaging</span>
              )}
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateConversation}
                disabled={!selectedUser || isCreating}
                className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <MessageSquare className="w-4 h-4" />
                    Start Conversation
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
