import React, { useEffect, useState, useRef } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~|}{[]:;?><";

interface ScrambleTextProps {
  text: string;
  isHovered: boolean;
  className?: string;
}

export function ScrambleText({ text, isHovered, className = "" }: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const frameRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isHovered) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      setDisplayText(text);
      return;
    }

    frameRef.current = 0;
    let lastTime = performance.now();
    
    const update = (time: number) => {
      if (time - lastTime >= 25) {
        frameRef.current += 1; // 1 frame per interval
        lastTime = time;
        
        let result = "";
        let finished = true;
        
        // 4 frames per character reveal
        const charsRevealed = Math.floor(frameRef.current / 4);
        
        for (let i = 0; i < text.length; i++) {
          if (text[i] === " ") {
            result += " ";
            continue;
          }
          
          if (i < charsRevealed) {
            result += text[i];
          } else {
            result += CHARS[Math.floor(Math.random() * CHARS.length)];
            finished = false;
          }
        }
        
        setDisplayText(result);
        
        if (finished) {
          setDisplayText(text);
          return;
        }
      }
      rafRef.current = requestAnimationFrame(update);
    };
    
    rafRef.current = requestAnimationFrame(update);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isHovered, text]);

  return <span className={className}>{displayText}</span>;
}
