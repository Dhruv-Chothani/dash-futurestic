import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glow?: "purple" | "cyan" | "none";
  tilt?: boolean;
}

const GlassCard = ({ children, className = "", glow = "none", tilt = false }: GlassCardProps) => {
  const glowClass = glow === "purple" ? "glow-purple" : glow === "cyan" ? "glow-cyan" : "";

  return (
    <motion.div
      whileHover={tilt ? { rotateX: -2, rotateY: 3, scale: 1.02 } : { scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`glass rounded-2xl p-6 ${glowClass} ${className}`}
      style={tilt ? { transformStyle: "preserve-3d", perspective: "1000px" } : {}}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
