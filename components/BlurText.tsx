"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface BlurTextProps {
  text: string;
  delay?: number;
  animateBy?: "words" | "characters";
  direction?: "top" | "bottom" | "left" | "right";
  onAnimationComplete?: () => void;
  className?: string;
}

export default function BlurText({
  text,
  delay = 150,
  animateBy = "words",
  direction = "top",
  onAnimationComplete,
  className = "",
}: BlurTextProps) {
  const elements = animateBy === "words" ? text.split(" ") : text.split("");
  
  // 1. Create a reference to attach to our text container
  const ref = useRef(null);
  
  // 2. Set up the intersection observer
  // once: true means it won't re-animate every time you scroll up and down
  // margin: "-10%" means it waits until it crosses 10% into the screen before firing
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  const getDirectionOffset = () => {
    switch (direction) {
      case "top":
        return { y: -20 };
      case "bottom":
        return { y: 20 };
      case "left":
        return { x: -20 };
      case "right":
        return { x: 20 };
      default:
        return { y: 0, x: 0 };
    }
  };

  return (
    // 3. Attach the ref to the parent div
    <div ref={ref} className={`flex flex-wrap ${className}`}>
      {elements.map((element, index) => (
        <motion.span
          key={index}
          initial={{ 
            filter: "blur(10px)", 
            opacity: 0, 
            ...getDirectionOffset() 
          }}
          // 4. Only trigger the animation IF the element is in view
          animate={
            isInView 
              ? { filter: "blur(0px)", opacity: 1, x: 0, y: 0 } 
              : {} // Do nothing until it scrolls into view
          }
          transition={{
            duration: 0.5,
            delay: (index * delay) / 1000,
          }}
          className={animateBy === "words" ? "mr-[0.25em]" : ""}
          onAnimationComplete={
            index === elements.length - 1 ? onAnimationComplete : undefined
          }
        >
          {element === " " ? "\u00A0" : element}
        </motion.span>
      ))}
    </div>
  );
}