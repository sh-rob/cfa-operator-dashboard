"use client";

import { useEffect, useRef, useState } from "react";
import beacon from "./beaconPath";
import { motion } from "framer-motion";

const AnimatedLogo = ({ delay = 0 }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setShow(true), delay * 1000);
    return () => clearTimeout(timeout);
  }, [delay]);

  return (
    <motion.svg
      width="300"
      height="80"
      viewBox="0 0 600 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Stroke path — handwriting animation */}
      {show && (
        <motion.path
          d={beacon}
          stroke="#EF4444"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 1 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            duration: 4,
            ease: "easeInOut",
          }}
        />
      )}
      {/* Fill path — fades in after stroke completes */}
      {show && (
        <motion.path
          d={beacon}
          fill="#EF4444"
          stroke="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 1.8,
            duration: 0.4,
            ease: "easeInOut",
          }}
        />
      )}
    </motion.svg>
  );
};

export default AnimatedLogo;
