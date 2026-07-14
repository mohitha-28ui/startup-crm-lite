import { useMemo, useState } from "react";
import { useLeads } from "../context/LeadContext";
import {
  parseLeadDate,
  getStatusDistribution,
  getMonthlyLeads,
  getConversionByMonth,
  getRevenueByMonth,
  getPipelineValue,
  getWonRevenue,
  getAverageSalesCycle,
  getLostRate,
  getLeadSourceStats,
  getFunnelData,
  getSalesVelocity,
  getForecastRevenue,
  getTopPerformers,
  getActivityHeatmapData,
} from "../utils/analyticsHelpers";

/**
 * Custom hook to filter leads by date ranges and calculate advanced analytics.
 *
 * @returns {Object} Analytics state, current/previous leads, and filters.
 */
export function useAnalytics() {
  const { leads = [] } = useLeads();
  const [filterRange, setFilterRange] = useState("30 Days"); // "7 Days" | "30 Days" | "90 Days" | "This Year" | "All" | "Custom"
  const [customRange, setCustomRange] = useState({ startDate: "", endDate: "" });

  // 1. Determine date boundaries for current and previous periods
  const periods = useMemo(() => {
    const now = new Date();
    let currentStart = new Date(0); // Epoch start by default for "All"
    let currentEnd = new Date(now);
    let prevStart = new Date(0);
    let prevEnd = new Date(0);

    if (filterRange === "7 Days") {
      currentStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
      prevStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 14);
      prevEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    } else if (filterRange === "30 Days") {
      currentStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
      prevStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 60);
      prevEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
    } else if (filterRange === "90 Days") {
      currentStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 90);
      prevStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 180);
      prevEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 90);
    } else if (filterRange === "This Year") {
      currentStart = new Date(now.getFullYear(), 0, 1);
      prevStart = new Date(now.getFullYear() - 1, 0, 1);
      prevEnd = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59);
    } else if (filterRange === "Custom" && customRange.startDate && customRange.endDate) {
      currentStart = new Date(customRange.startDate);
      currentStart.setHours(0, 0, 0, 0);
      currentEnd = new Date(customRange.endDate);
      currentEnd.setHours(23, 59, 59, 999);

      const diffTime = Math.abs(currentEnd - currentStart);
      prevEnd = new Date(currentStart.getTime() - 1);
      prevStart = new Date(currentStart.getTime() - diffTime);
    }

    return { currentStart, currentEnd, prevStart, prevEnd };
  }, [filterRange, customRange]);

  // 2. Filter current and previous leads collections
  const { currentLeads, previousLeads } = useMemo(() => {
    const current = [];
    const prev = [];

    leads.forEach((lead) => {
      const d = parseLeadDate(lead);
      if (d >= periods.currentStart && d <= periods.currentEnd) {
        current.push(lead);
      } else if (d >= periods.prevStart && d <= periods.prevEnd) {
        prev.push(lead);
      }
    });

    return { currentLeads: current, previousLeads: prev };
  }, [leads, periods]);

  // 3. Compute KPI metrics for current and previous collections to determine relative growth
  const analytics = useMemo(() => {
    // Current KPIs
    const totalLeads = currentLeads.length;
    const conversionRate = totalLeads > 0 
      ? Math.round((currentLeads.filter((l) => l.status === "Won").length / totalLeads) * 100) 
      : 0;
    const pipelineValue = getPipelineValue(currentLeads);
    const wonRevenue = getWonRevenue(currentLeads);
    const avgSalesCycle = getAverageSalesCycle(currentLeads);
    const lostRate = getLostRate(currentLeads);

    // Previous KPIs (for comparisons)
    const prevTotal = previousLeads.length;
    const prevConversion = prevTotal > 0 
      ? Math.round((previousLeads.filter((l) => l.status === "Won").length / prevTotal) * 100) 
      : 0;
    const prevPipeline = getPipelineValue(previousLeads);
    const prevWonRev = getWonRevenue(previousLeads);
    const prevAvgCycle = getAverageSalesCycle(previousLeads);
    const prevLostRate = getLostRate(previousLeads);

    // Growth calculations (percentage)
    const getGrowth = (currentVal, prevVal) => {
      if (prevVal === 0) return currentVal > 0 ? 100 : 0;
      return Math.round(((currentVal - prevVal) / prevVal) * 100);
    };

    const totalLeadsGrowth = getGrowth(totalLeads, prevTotal);
    const conversionRateGrowth = conversionRate - prevConversion; // absolute difference
    const pipelineValueGrowth = getGrowth(pipelineValue, prevPipeline);
    const wonRevenueGrowth = getGrowth(wonRevenue, prevWonRev);
    const avgSalesCycleGrowth = avgSalesCycle - prevAvgCycle; // absolute difference
    const lostRateGrowth = lostRate - prevLostRate; // absolute difference

    // Sales Velocity
    const salesVelocity = getSalesVelocity(currentLeads);
    const prevSalesVelocity = getSalesVelocity(previousLeads);
    const salesVelocityGrowth = getGrowth(salesVelocity, prevSalesVelocity);

    // Revenue Forecast
    const forecastRevenue = getForecastRevenue(currentLeads);

    // Sub-chart metrics aggregations
    const statusDistribution = getStatusDistribution(currentLeads);
    const monthlyLeads = getMonthlyLeads(leads); // always last 6 months globally for trend clarity
    const monthlyConversion = getConversionByMonth(leads); // always last 6 months globally
    const monthlyRevenue = getRevenueByMonth(leads); // always last 6 months globally
    const leadSources = getLeadSourceStats(currentLeads);
    const funnelData = getFunnelData(currentLeads);
    const topPerformers = getTopPerformers(currentLeads);
    const heatmapData = getActivityHeatmapData(currentLeads);

    return {
      kpis: {
        totalLeads: { value: totalLeads, growth: totalLeadsGrowth },
        conversionRate: { value: conversionRate, growth: conversionRateGrowth },
        pipelineValue: { value: pipelineValue, growth: pipelineValueGrowth },
        wonRevenue: { value: wonRevenue, growth: wonRevenueGrowth },
        avgSalesCycle: { value: avgSalesCycle, growth: avgSalesCycleGrowth },
        lostRate: { value: lostRate, growth: lostRateGrowth },
      },
      salesVelocity: { value: salesVelocity, growth: salesVelocityGrowth },
      forecastRevenue,
      statusDistribution,
      monthlyLeads,
      monthlyConversion,
      monthlyRevenue,
      leadSources,
      funnelData,
      topPerformers,
      heatmapData,
    };
  }, [currentLeads, previousLeads, leads]);

  return {
    filterRange,
    setFilterRange,
    customRange,
    setCustomRange,
    currentLeads,
    analytics,
  };
}

export default useAnalytics;
