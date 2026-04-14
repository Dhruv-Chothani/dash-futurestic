import { useState } from "react";
import { motion } from "framer-motion";
import { useStore } from "@/store";
import DashboardLayout from "@/components/DashboardLayout";
import GlassCard from "@/components/GlassCard";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line } from "recharts";
import { Download } from "lucide-react";

const monthlyRevenue = [
  { month: "Jan", revenue: 42000, expenses: 28000 },
  { month: "Feb", revenue: 58000, expenses: 31000 },
  { month: "Mar", revenue: 49000, expenses: 27000 },
  { month: "Apr", revenue: 72000, expenses: 35000 },
  { month: "May", revenue: 61000, expenses: 29000 },
  { month: "Jun", revenue: 84000, expenses: 38000 },
  { month: "Jul", revenue: 76000, expenses: 33000 },
  { month: "Aug", revenue: 92000, expenses: 41000 },
  { month: "Sep", revenue: 88000, expenses: 37000 },
  { month: "Oct", revenue: 105000, expenses: 45000 },
  { month: "Nov", revenue: 97000, expenses: 42000 },
  { month: "Dec", revenue: 124000, expenses: 52000 },
];

const userGrowth = [
  { month: "Jan", users: 1200 }, { month: "Feb", users: 1800 },
  { month: "Mar", users: 2400 }, { month: "Apr", users: 3100 },
  { month: "May", users: 3900 }, { month: "Jun", users: 4800 },
  { month: "Jul", users: 5500 }, { month: "Aug", users: 6400 },
  { month: "Sep", users: 7200 }, { month: "Oct", users: 8100 },
  { month: "Nov", users: 9000 }, { month: "Dec", users: 10200 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-lg p-3 text-xs border border-border/50">
      <p className="text-foreground font-medium mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>{p.dataKey}: ${(p.value).toLocaleString()}</p>
      ))}
    </div>
  );
};

const ReportsPage = () => {
  const { orders, users, products } = useStore();

  const exportCSV = () => {
    const headers = "Month,Revenue,Expenses\n";
    const rows = monthlyRevenue.map((r) => `${r.month},${r.revenue},${r.expenses}`).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "revenue-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-display text-foreground">Reports</h1>
            <p className="text-sm text-muted-foreground">Analytics and insights</p>
          </div>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={exportCSV} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground font-medium text-sm glow-purple">
            <Download size={16} /> Export CSV
          </motion.button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <GlassCard glow="purple">
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-2xl font-bold font-display text-foreground mt-1">$948,000</p>
          </GlassCard>
          <GlassCard glow="cyan">
            <p className="text-sm text-muted-foreground">Total Users</p>
            <p className="text-2xl font-bold font-display text-foreground mt-1">10,200</p>
          </GlassCard>
          <GlassCard>
            <p className="text-sm text-muted-foreground">Total Orders</p>
            <p className="text-2xl font-bold font-display text-foreground mt-1">{orders.length * 184}</p>
          </GlassCard>
        </div>

        {/* Revenue vs Expenses */}
        <GlassCard>
          <h3 className="text-sm font-semibold text-foreground mb-4 font-display">Revenue vs Expenses</h3>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={monthlyRevenue}>
              <defs>
                <linearGradient id="revGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(270,100%,65%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(270,100%,65%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(185,100%,50%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(185,100%,50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240,6%,18%)" />
              <XAxis dataKey="month" tick={{ fill: "hsl(240,5%,55%)", fontSize: 12 }} />
              <YAxis tick={{ fill: "hsl(240,5%,55%)", fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="hsl(270,100%,65%)" fill="url(#revGrad2)" strokeWidth={2} />
              <Area type="monotone" dataKey="expenses" stroke="hsl(185,100%,50%)" fill="url(#expGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* User Growth */}
        <GlassCard>
          <h3 className="text-sm font-semibold text-foreground mb-4 font-display">User Growth</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={userGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240,6%,18%)" />
              <XAxis dataKey="month" tick={{ fill: "hsl(240,5%,55%)", fontSize: 12 }} />
              <YAxis tick={{ fill: "hsl(240,5%,55%)", fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="users" stroke="hsl(185,100%,50%)" strokeWidth={2} dot={{ fill: "hsl(185,100%,50%)", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>
    </DashboardLayout>
  );
};

export default ReportsPage;
