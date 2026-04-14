import { useState } from "react";
import { motion } from "framer-motion";
import { useStore, Category } from "@/store";
import DashboardLayout from "@/components/DashboardLayout";
import GlassCard from "@/components/GlassCard";
import Modal from "@/components/Modal";
import ConfirmDialog from "@/components/ConfirmDialog";
import { Plus, Pencil, Trash2, FolderOpen } from "lucide-react";

const uid = () => Math.random().toString(36).slice(2, 10);

const CategoriesPage = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", description: "" });

  const openAdd = () => { setEditing(null); setForm({ name: "", description: "" }); setModalOpen(true); };
  const openEdit = (c: Category) => { setEditing(c); setForm({ name: c.name, description: c.description }); setModalOpen(true); };

  const handleSave = () => {
    if (!form.name) return;
    if (editing) {
      updateCategory(editing.id, form);
    } else {
      addCategory({ ...form, id: uid(), productCount: 0 });
    }
    setModalOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-display text-foreground">Categories</h1>
            <p className="text-sm text-muted-foreground">{categories.length} categories</p>
          </div>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={openAdd} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground font-medium text-sm glow-purple">
            <Plus size={16} /> Add Category
          </motion.button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <GlassCard tilt>
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                    <FolderOpen size={18} className="text-primary" />
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground"><Pencil size={14} /></button>
                    <button onClick={() => setDeleteId(c.id)} className="p-1.5 rounded-lg hover:bg-destructive/15 text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
                  </div>
                </div>
                <h3 className="font-semibold text-foreground mt-3">{c.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{c.description}</p>
                <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border/30">{c.productCount} products</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Category" : "Add Category"}>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none" />
          </div>
          <motion.button whileTap={{ scale: 0.97 }} onClick={handleSave} className="w-full py-2.5 rounded-xl bg-gradient-primary text-primary-foreground font-medium text-sm">
            {editing ? "Update" : "Create"} Category
          </motion.button>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteId} title="Delete Category" message="This will remove the category permanently." onConfirm={() => { if (deleteId) deleteCategory(deleteId); setDeleteId(null); }} onCancel={() => setDeleteId(null)} />
    </DashboardLayout>
  );
};

export default CategoriesPage;
