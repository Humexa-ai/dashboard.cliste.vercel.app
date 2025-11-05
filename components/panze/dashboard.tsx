"use client";
import React from "react";
import { Users, DollarSign, Image as ImageIcon, Code, Globe, Settings, ChevronDown, TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PanzeDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Globe className="h-5 w-5 text-gray-600" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <ChevronDown className="h-5 w-5 text-gray-600" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Settings className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          icon={Users}
          title="Users"
          value="430"
          trend="32.54%"
          trendUp={true}
          period="Last 30 days"
        />
        <SummaryCard
          icon={DollarSign}
          title="Subscriptions"
          value="360"
          trend="32.54%"
          trendUp={false}
          period="Last 30 days"
        />
        <SummaryCard
          icon={ImageIcon}
          title="Generated Images"
          value="43,583"
          trend="32.54%"
          trendUp={true}
          period="Last 30 days"
        />
        <SummaryCard
          icon={Code}
          title="Generated Codes"
          value="34,385"
          trend="32.54%"
          trendUp={true}
          period="Last 30 days"
        />
      </div>

      {/* Chart Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Total New Users"
          period="6 months"
          type="bar"
        />
        <ChartCard
          title="Total New Users"
          period="15 days"
          type="line"
        />
      </div>

      {/* Table Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TableCard
          title="Latest Registrations"
          columns={["Name", "Status", "Reg. Date", "Actions"]}
          rows={[
            ["Stella Powell", "Active", "03/27/2026", "View"],
            ["Aaron Dunn", "Pending", "08/14/2026", "View"],
            ["Eleanor Kim", "Active", "11/17/2026", "View"],
            ["Joshua Cook", "Active", "08/09/2026", "View"],
            ["Anna Russell", "Pending", "08/09/2026", "View"],
          ]}
        />
        <TableCard
          title="Latest Transactions"
          period="Last Month"
          columns={["Paid By", "Package Name", "Price", "Status", "Paid Date"]}
          rows={[
            ["Stella Powell", "Starter", "$11.99", "Expired", "03/27/2026"],
            ["Aaron Dunn", "Professional", "$24", "Active", "08/14/2026"],
            ["Eleanor Kim", "Organization", "$39", "Active", "11/17/2026"],
            ["Joshua Cook", "Starter", "$11.99", "Expired", "08/09/2026"],
            ["Anna Russell", "Starter", "$11.99", "Active", "08/09/2026"],
          ]}
        />
      </div>
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  title,
  value,
  trend,
  trendUp,
  period,
}: {
  icon: React.ElementType;
  title: string;
  value: string;
  trend: string;
  trendUp: boolean;
  period: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 rounded-lg bg-purple-100">
          <Icon className="h-5 w-5 text-purple-600" />
        </div>
      </div>
      <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 mb-2">{value}</p>
      <div className="flex items-center gap-2">
        {trendUp ? (
          <TrendingUp className="h-4 w-4 text-green-500" />
        ) : (
          <TrendingDown className="h-4 w-4 text-red-500" />
        )}
        <span className={cn("text-sm font-medium", trendUp ? "text-green-500" : "text-red-500")}>
          {trend}
        </span>
        <span className="text-sm text-gray-500">{period}</span>
      </div>
    </div>
  );
}

function ChartCard({ title, period, type }: { title: string; period: string; type: "bar" | "line" }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50">
          <span className="text-sm text-gray-600">{period}</span>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </div>
      </div>
      <div className="h-64 flex items-end justify-center">
        {type === "bar" ? (
          <div className="w-full h-full flex items-end justify-between gap-2">
            {[45, 55, 25, 40, 10, 30].map((height, i) => (
              <div
                key={i}
                className="flex-1 bg-purple-500 rounded-t-lg hover:bg-purple-600 transition-colors"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center border border-gray-200 rounded-lg bg-gray-50">
            <div className="text-gray-400 text-sm">Line Chart Placeholder</div>
          </div>
        )}
      </div>
    </div>
  );
}

function TableCard({
  title,
  period,
  columns,
  rows,
}: {
  title: string;
  period?: string;
  columns: string[];
  rows: string[][];
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {period && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50">
            <span className="text-sm text-gray-600">{period}</span>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </div>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              {columns.map((col, i) => (
                <th key={i} className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                {row.map((cell, j) => (
                  <td key={j} className="py-3 px-4 text-sm text-gray-900">
                    {cell === "Active" ? (
                      <span className="text-green-500 font-medium">{cell}</span>
                    ) : cell === "Pending" ? (
                      <span className="text-blue-500 font-medium">{cell}</span>
                    ) : cell === "Expired" ? (
                      <span className="text-red-500 font-medium">{cell}</span>
                    ) : cell === "View" ? (
                      <button className="px-3 py-1 rounded-lg bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors text-xs font-medium">
                        {cell}
                      </button>
                    ) : (
                      cell
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


