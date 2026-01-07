'use client';

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import AnalyticsClient from "./AnalyticsClient";
import type { AnalyticsSummary, RevenueByRoom, MonthlyRevenue } from "@/backend/controller/analyticsController";

const AnalyticsPage = () => {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [revenueByHaven, setRevenueByHaven] = useState<RevenueByRoom[]>([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, revenueRes, monthlyRes] = await Promise.all([
          fetch('/api/admin/analytics/summary?period=30'),
          fetch('/api/admin/analytics/revenue-by-room?period=30'),
          fetch('/api/admin/analytics/monthly-revenue?months=6')
        ]);

        const summaryData = await summaryRes.json();
        const revenueData = await revenueRes.json();
        const monthlyData = await monthlyRes.json();

        if (summaryData.success) setSummary(summaryData.data);
        if (revenueData.success) setRevenueByHaven(revenueData.data);
        if (monthlyData.success) setMonthlyRevenue(monthlyData.data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || !summary) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        <span className="ml-3 text-gray-600">Loading analytics...</span>
      </div>
    );
  }

  return (
    <AnalyticsClient
      summary={summary}
      revenueByHaven={revenueByHaven}
      monthlyRevenue={monthlyRevenue}
    />
  );
};

export default AnalyticsPage;
