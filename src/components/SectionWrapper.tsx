"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface SectionWrapperProps {
  id: string;
  children: ReactNode;
  className?: string;
}

export default function SectionWrapper({
  id,
  children,
  className = "",
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={`relative min-h-screen py-24 px-6 ${className}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-7xl"
      >
        {children}
      </motion.div>
    </section>
  );
}
