import React from "react";
import { motion } from "framer-motion";

interface SquashHamburgerProps {
  isOpen: boolean;
}

export function SquashHamburger({ isOpen }: SquashHamburgerProps) {
  const springConfig = { stiffness: 300, damping: 20 };

  return (
    <div className="relative w-[15px] h-[10px] md:w-[18px] md:h-[12px]">
      <motion.span
        className="absolute left-0 w-full bg-white rounded-full h-[1.2px] md:h-[1.5px]"
        initial={false}
        animate={isOpen ? { top: "50%", y: "-50%", rotate: 45 } : { top: "0%", y: "0%", rotate: 0 }}
        transition={springConfig}
      />
      <motion.span
        className="absolute left-0 top-1/2 -translate-y-1/2 w-full bg-white rounded-full h-[1.2px] md:h-[1.5px]"
        initial={false}
        animate={isOpen ? { opacity: 0, scale: 0.5 } : { opacity: 1, scale: 1 }}
        transition={springConfig}
      />
      <motion.span
        className="absolute left-0 w-full bg-white rounded-full h-[1.2px] md:h-[1.5px]"
        initial={false}
        animate={isOpen ? { bottom: "50%", y: "50%", rotate: -45 } : { bottom: "0%", y: "0%", rotate: 0 }}
        transition={springConfig}
      />
    </div>
  );
}
