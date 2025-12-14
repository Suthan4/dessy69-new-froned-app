"use client";

import { motion } from "framer-motion";
import { IceCream } from "lucide-react";

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-neutral-950">
      <div className="text-center">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="mb-8 inline-block"
        >
          <IceCream size={64} className="text-primary-500" />
        </motion.div>

        <motion.h2
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="mb-2 text-2xl font-bold text-gradient-primary"
        >
          Dessy69 Cafe
        </motion.h2>

        <motion.p
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.2,
          }}
          className="text-neutral-600 dark:text-neutral-400"
        >
          Fruit Fuelled! #dessy69
        </motion.p>

        <motion.div
          className="mt-8 flex justify-center gap-2"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <motion.div
            animate={{ scale: [1, 1.5, 1] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: 0,
            }}
            className="h-2 w-2 rounded-full bg-primary-500"
          />
          <motion.div
            animate={{ scale: [1, 1.5, 1] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: 0.2,
            }}
            className="h-2 w-2 rounded-full bg-secondary-500"
          />
          <motion.div
            animate={{ scale: [1, 1.5, 1] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: 0.4,
            }}
            className="h-2 w-2 rounded-full bg-accent-500"
          />
        </motion.div>
      </div>
    </div>
  );
}
