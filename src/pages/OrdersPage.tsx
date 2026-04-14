import { useState } from "react";
import { motion } from "framer-motion";
import { useStore, Order } from "@/store";
import DashboardLayout from "@/components/DashboardLayout";
import GlassCard from "@/components/GlassCard";
import Modal from "@/components/Modal";
import { Eye, Search } from "lucide-react";

const statuses: Order["status"][] = ["pending", "processing", "shipped", "delivered", "cancelled"];

const statusColor = (s: Order["status"]) => {
  switch (s) {
    case "delivered": return "bg-success/15 text-success";
    case "shipped": return "bg-neon-cyan/15 text-neon-cyan";
    case "processing": return "bg-primary/15 text-primary";
    case "cancelled": return "bg-destructive/15 text-destructive";
    default: return "bg-warning/15 text-warning";
  }
};

const OrdersPage = () => {
  const { orders, updateOrder } = useStore();
  const [search, setSearch] = useState("");
  const [detail, setDetail] = useState<Order | null>(null);

  const filtered = orders.filter((o) => o.customer.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">Orders</h1>
          <p className="text-sm text-muted-foreground">{orders.length} total orders</p>
        </div>

        <GlassCard>
          <div className="relative max-w-sm mb-4">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search orders..." className="w-full pl-9 pr-4 py-2 rounded-xl bg-secondary/60 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-3 px-3 text-muted-foreground font-medium">Order</th>
                  <th className="text-left py-3 px-3 text-muted-foreground font-medium hidden sm:table-cell">Customer</th>
                  <th className="text-left py-3 px-3 text-muted-foreground font-medium">Total</th>
                  <th className="text-left py-3 px-3 text-muted-foreground font-medium">Status</th>
                  <th className="text-right py-3 px-3 text-muted-foreground font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o, i) => (
                  <motion.tr key={o.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
                    <td className="py-3 px-3 font-medium text-foreground">{o.id}</td>
                    <td className="py-3 px-3 text-muted-foreground hidden sm:table-cell">{o.customer}</td>
                    <td className="py-3 px-3 font-medium text-foreground">${o.total.toFixed(2)}</td>
                    <td className="py-3 px-3">
                      <select
                        value={o.status}
                        onChange={(e) => updateOrder(o.id, { status: e.target.value as Order["status"] })}
                        className={`px-2 py-1 rounded-lg text-xs font-medium border-0 focus:outline-none cursor-pointer ${statusColor(o.status)}`}
                      >
                        {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button onClick={() => setDetail(o)} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground">
                        <Eye size={14} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>

      <Modal open={!!detail} onClose={() => setDetail(null)} title={`Order ${detail?.id || ""}`}>
        {detail && (
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Customer</span><span className="text-foreground font-medium">{detail.customer}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span className="text-foreground">{detail.email}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Items</span><span className="text-foreground">{detail.items}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Total</span><span className="text-foreground font-bold">${detail.total.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span className="text-foreground">{detail.date}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Status</span><span className={`px-2 py-0.5 rounded-full text-xs ${statusColor(detail.status)}`}>{detail.status}</span></div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
};

export default OrdersPage;
