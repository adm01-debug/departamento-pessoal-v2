import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface TypewriterProps {
  text: string | string[];
  speed?: number;
  deleteSpeed?: number;
  delay?: number;
  loop?: boolean;
  cursor?: boolean;
  className?: string;
  onComplete?: () => void;
}

export function Typewriter({ text, speed = 50, deleteSpeed = 30, delay = 1500, loop = false, cursor = true, className, onComplete }: TypewriterProps) {
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const texts = Array.isArray(text) ? text : [text];

  useEffect(() => {
    const currentText = texts[index % texts.length];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && displayText === currentText) {
      if (loop || index < texts.length - 1) {
        timeout = setTimeout(() => setIsDeleting(true), delay);
      } else {
        onComplete?.();
      }
    } else if (isDeleting && displayText === "") {
      setIsDeleting(false);
      setIndex(i => i + 1);
    } else {
      timeout = setTimeout(() => {
        setDisplayText(isDeleting ? currentText.slice(0, displayText.length - 1) : currentText.slice(0, displayText.length + 1));
      }, isDeleting ? deleteSpeed : speed);
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, index, texts, speed, deleteSpeed, delay, loop, onComplete]);

  return (
    <span className={cn("inline-block", className)}>
      {displayText}
      {cursor && <span className="animate-pulse">|</span>}
    </span>
  );
}

export default Typewriter;
