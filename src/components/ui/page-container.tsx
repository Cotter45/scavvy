"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import clsx from "clsx";

export function PageContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className={clsx(
        "relative min-h-full w-full p-6 lg:px-12 max-w-7xl mx-auto",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
