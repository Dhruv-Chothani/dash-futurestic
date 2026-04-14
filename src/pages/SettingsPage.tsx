import { useState } from "react";
import { motion } from "framer-motion";
import { useStore } from "@/store";
import DashboardLayout from "@/components/DashboardLayout";
import GlassCard from "@/components/GlassCard";
import { toast } from "sonner";
import { User as UserIcon, Lock, Palette } from "lucide-react";

const SettingsPage = () => {
  const { adminUser } = useStore();
  const [name, setName] = useState(adminUser?.name || "Admin");
  const [email, setEmail] = useState(adminUser?.email || "admin@admin.com");
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");

  const handleProfileSave = () => {
    toast.success("Profile updated successfully");
  };

  const handlePasswordSave = () => {
    if (!currentPw || !newPw) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (currentPw !== "admin123") {
      toast.error("Current password is incorrect");
      return;
    }
    toast.success("Password changed successfully");
    setCurrentPw("");
    setNewPw("");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your account</p>
        </div>

        {/* Profile */}
        <GlassCard>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center">
              <UserIcon size={18} className="text-primary" />
            </div>
            <h3 className="font-semibold font-display text-foreground">Profile</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </div>
            <motion.button whileTap={{ scale: 0.97 }} onClick={handleProfileSave} className="px-6 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground font-medium text-sm glow-purple">
              Save Changes
            </motion.button>
          </div>
        </GlassCard>

        {/* Password */}
        <GlassCard>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center">
              <Lock size={18} className="text-primary" />
            </div>
            <h3 className="font-semibold font-display text-foreground">Change Password</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Current Password</label>
              <input type="password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">New Password</label>
              <input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </div>
            <motion.button whileTap={{ scale: 0.97 }} onClick={handlePasswordSave} className="px-6 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground font-medium text-sm glow-purple">
              Update Password
            </motion.button>
          </div>
        </GlassCard>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
