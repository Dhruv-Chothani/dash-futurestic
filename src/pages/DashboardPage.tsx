import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useStore } from "@/store";
import GlassCard from "@/components/GlassCard";
import DashboardLayout from "@/components/DashboardLayout";
import { Users, DollarSign, ShoppingCart, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

const revenueData = [
  { month: "Jan", revenue: 4200 }, { month: "Feb", revenue: 5800 },
  { month: "Mar", revenue: 4900 }, { month: "Apr", revenue: 7200 },
  { month: "May", revenue: 6100 }, { month: "Jun", revenue: 8400 },
  { month: "Jul", revenue: 7600 }, { month: "Aug", revenue: 9200 },
  { month: "Sep", revenue: 8800 }, { month: "Oct", revenue: 10500 },
  { month: "Nov", revenue: 9700 }, { month: "Dec", revenue: 12400 },
];

const orderData = [
  { day: "Mon", orders: 32 }, { day: "Tue", orders: 45 },
  { day: "Wed", orders: 28 }, { day: "Thu", orders: 56 },
  { day: "Fri", orders: 43 }, { day: "Sat", orders: 67 },
  { day: "Sun", orders: 38 },
];

const categoryData = [
  { name: "Electronics", value: 35, color: "hsl(270,100%,65%)" },
  { name: "Displays", value: 25, color: "hsl(185,100%,50%)" },
  { name: "Components", value: 20, color: "hsl(142,71%,45%)" },
  { name: "Accessories", value: 20, color: "hsl(38,92%,50%)" },
];

const StatCard = ({ icon: Icon, label, value, change, positive, delay }: any) => {
  const [displayed, setDisplayed] = useState(0);
  const numVal = parseInt(value.replace(/[^0-9]/g, ""));

  useEffect(() => {
    let start = 0;
    const end = numVal;
    const duration = 1200;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setDisplayed(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [numVal]);

  const prefix = value.startsWith("$") ? "$" : "";
  const suffix = value.endsWith("%") ? "%" : value.endsWith("+") ? "+" : "";
  const formatted = prefix + displayed.toLocaleString() + suffix;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1 }}
    >
      <GlassCard tilt glow={delay % 2 === 0 ? "purple" : "cyan"}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold font-display text-foreground mt-1">{formatted}</p>
            <div className={`flex items-center gap-1 mt-2 text-xs ${positive ? "text-success" : "text-destructive"}`}>
              {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              <span>{change}</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
            <Icon size={20} className="text-primary" />
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-lg p-3 text-xs border border-border/50">
      <p className="text-foreground font-medium">{label}</p>
      <p className="text-primary">{typeof payload[0].value === "number" ? `$${payload[0].value.toLocaleString()}` : payload[0].value}</p>
    </div>
  );
};

const DashboardPage = () => {
  const { users, orders, products } = useStore();
  const totalRevenue = orders.reduce((a, o) => a + o.total, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Welcome back, here is your overview</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard icon={Users} label="Total Users" value={`${users.length * 247}`} change="+12.5% from last month" positive delay={0} />
          <StatCard icon={DollarSign} label="Revenue" value={`$${Math.floor(totalRevenue * 8.4)}`} change="+23.1% from last month" positive delay={1} />
          <StatCard icon={ShoppingCart} label="Orders" value={`${orders.length * 184}`} change="+8.3% from last month" positive delay={2} />
          <StatCard icon={TrendingUp} label="Growth" value="24%" change="+4.2% from last month" positive delay={3} />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-2">
            <GlassCard>
              <h3 className="text-sm font-semibold text-foreground mb-4 font-display">Revenue Trend</h3>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(270,100%,65%)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(270,100%,65%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(240,6%,18%)" />
                  <XAxis dataKey="month" tick={{ fill: "hsl(240,5%,55%)", fontSize: 12 }} />
                  <YAxis tick={{ fill: "hsl(240,5%,55%)", fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="revenue" stroke="hsl(270,100%,65%)" fill="url(#revGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </GlassCard>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <GlassCard className="h-full">
              <h3 className="text-sm font-semibold text-foreground mb-4 font-display">By Category</h3>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={4}>
                    {categoryData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {categoryData.map((c) => (
                  <div key={c.name} className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 rounded-full" style={{ background: c.color }} />
                    <span className="text-muted-foreground">{c.name}</span>
                    <span className="ml-auto text-foreground font-medium">{c.value}%</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Orders chart + Recent orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <GlassCard>
              <h3 className="text-sm font-semibold text-foreground mb-4 font-display">Weekly Orders</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={orderData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(240,6%,18%)" />
                  <XAxis dataKey="day" tick={{ fill: "hsl(240,5%,55%)", fontSize: 12 }} />
                  <YAxis tick={{ fill: "hsl(240,5%,55%)", fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="orders" fill="hsl(185,100%,50%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </GlassCard>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
            <GlassCard>
              <h3 className="text-sm font-semibold text-foreground mb-4 font-display">Recent Orders</h3>
              <div className="space-y-3">
                {orders.slice(0, 5).map((o) => (
                  <div key={o.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-foreground">{o.customer}</p>
                      <p className="text-xs text-muted-foreground">{o.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">${o.total.toFixed(2)}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        o.status === "delivered" ? "bg-success/15 text-success" :
                        o.status === "shipped" ? "bg-neon-cyan/15 text-neon-cyan" :
                        o.status === "processing" ? "bg-primary/15 text-primary" :
                        o.status === "cancelled" ? "bg-destructive/15 text-destructive" :
                        "bg-warning/15 text-warning"
                      }`}>
                        {o.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
