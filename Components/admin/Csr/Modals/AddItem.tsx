"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Package, X } from "lucide-react";

type InventoryStatus = "In Stock" | "Low Stock" | "Out of Stock";

export interface NewInventoryItem {
  name: string;
  stock: number;
  price: number;
  status: InventoryStatus;
}

interface AddItemProps {
  onClose: () => void;
  onAdd?: (item: NewInventoryItem) => Promise<void>;
}

export default function AddItem({ onClose, onAdd }: AddItemProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    stock: 0,
    price: 0,
    status: "In Stock" as InventoryStatus,
  });

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const isValid = useMemo(() => {
    return form.name.trim().length > 0 && Number.isFinite(form.stock) && Number.isFinite(form.price);
  }, [form.name, form.price, form.stock]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isSaving) return;
    setError(null);
    setIsSaving(true);
    try {
      await onAdd?.({
        name: form.name.trim(),
        stock: Math.max(0, Math.floor(form.stock)),
        price: Math.max(0, Number(form.price)),
        status: form.status,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to add item");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isMounted) return null;

  return createPortal(
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center px-4 py-8 z-[9999]">
        <div
          className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-yellow-50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center">
                <Package className="w-6 h-6 text-brand-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-orange-500 uppercase tracking-[0.2em]">
                  Inventory
                </p>
                <h2 className="text-2xl font-bold text-gray-900 mt-1">Add New Item</h2>
                <p className="text-sm text-gray-500 mt-1">Create an inventory item and set initial stock.</p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isSaving}
              className="p-2 rounded-full hover:bg-white/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                {error}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Item Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  disabled={isSaving}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="e.g. Bath Towel"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Stock</label>
                <input
                  type="number"
                  min={0}
                  value={form.stock}
                  onChange={(e) => setForm((p) => ({ ...p, stock: Number(e.target.value) }))}
                  disabled={isSaving}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Price (PHP)</label>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm((p) => ({ ...p, price: Number(e.target.value) }))}
                  disabled={isSaving}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as InventoryStatus }))}
                  disabled={isSaving}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="In Stock">In Stock</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>
            </div>
          </form>

          <div className="sticky bottom-0 bg-gray-50 px-8 py-5 border-t border-gray-200 flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValid || isSaving}
              className="px-6 py-2 bg-gradient-to-r from-brand-primary to-brand-primaryDark text-white rounded-lg hover:shadow-lg hover:scale-[1.02] transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? "Saving..." : "Add Item"}
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}