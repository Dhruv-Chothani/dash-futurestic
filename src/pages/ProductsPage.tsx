import { useState } from "react";
import { motion } from "framer-motion";
import { useStore, Product } from "@/store";
import DashboardLayout from "@/components/DashboardLayout";
import GlassCard from "@/components/GlassCard";
import Modal from "@/components/Modal";
import ConfirmDialog from "@/components/ConfirmDialog";
import { Plus, Pencil, Trash2, Search, ImageIcon } from "lucide-react";

const uid = () => Math.random().toString(36).slice(2, 10);

const ProductsPage = () => {
  const { products, addProduct, updateProduct, deleteProduct, categories } = useStore();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [form, setForm] = useState({ name: "", category: "", price: "", stock: "", status: "active" as Product["status"], image: "" });

  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", category: categories[0]?.name || "", price: "", stock: "", status: "active", image: "" });
    setModalOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({ name: p.name, category: p.category, price: String(p.price), stock: String(p.stock), status: p.status, image: p.image || "" });
    setModalOpen(true);
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm({ ...form, image: reader.result as string });
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!form.name || !form.price) return;
    const data = { name: form.name, category: form.category, price: Number(form.price), stock: Number(form.stock), status: form.status, image: form.image };
    if (editing) {
      updateProduct(editing.id, data);
    } else {
      addProduct({ ...data, id: uid() });
    }
    setModalOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-display text-foreground">Products</h1>
            <p className="text-sm text-muted-foreground">{products.length} products</p>
          </div>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={openAdd} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground font-medium text-sm glow-purple">
            <Plus size={16} /> Add Product
          </motion.button>
        </div>

        <div className="relative max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="w-full pl-9 pr-4 py-2 rounded-xl bg-secondary/60 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <GlassCard tilt>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center overflow-hidden">
                    {p.image ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" /> : <ImageIcon size={20} className="text-muted-foreground" />}
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${p.status === "active" ? "bg-success/15 text-success" : "bg-warning/15 text-warning"}`}>{p.status}</span>
                </div>
                <h3 className="font-semibold text-foreground text-sm">{p.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{p.category}</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-lg font-bold text-gradient">${p.price.toFixed(2)}</span>
                  <span className="text-xs text-muted-foreground">{p.stock} in stock</span>
                </div>
                <div className="flex items-center gap-1 mt-3 pt-3 border-t border-border/30">
                  <button onClick={() => openEdit(p)} className="flex-1 py-1.5 rounded-lg bg-secondary text-foreground text-xs font-medium hover:bg-secondary/80 transition-colors flex items-center justify-center gap-1">
                    <Pencil size={12} /> Edit
                  </button>
                  <button onClick={() => setDeleteId(p.id)} className="flex-1 py-1.5 rounded-lg bg-destructive/10 text-destructive text-xs font-medium hover:bg-destructive/20 transition-colors flex items-center justify-center gap-1">
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Product" : "Add Product"}>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Price</label>
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Stock</label>
              <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </div>
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Category</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
              {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Image</label>
            <input type="file" accept="image/*" onChange={handleImage} className="w-full text-sm text-muted-foreground file:mr-3 file:px-3 file:py-1.5 file:rounded-lg file:bg-secondary file:border-0 file:text-foreground file:text-xs" />
          </div>
          <motion.button whileTap={{ scale: 0.97 }} onClick={handleSave} className="w-full py-2.5 rounded-xl bg-gradient-primary text-primary-foreground font-medium text-sm">
            {editing ? "Update" : "Create"} Product
          </motion.button>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteId} title="Delete Product" message="This action cannot be undone." onConfirm={() => { if (deleteId) deleteProduct(deleteId); setDeleteId(null); }} onCancel={() => setDeleteId(null)} />
    </DashboardLayout>
  );
};

export default ProductsPage;
