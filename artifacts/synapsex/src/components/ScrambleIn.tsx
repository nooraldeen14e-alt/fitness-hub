import React, { useEffect, useState, useRef } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~|}{[]:;?><";

interface ScrambleInProps {
  text: string;
  delay: number;
  triggered: boolean;
}

export function ScrambleIn({ text, delay, triggered }: ScrambleInProps) {
  const [displayText, setDisplayText] = useState<string>("");
  const frameRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!triggered) {
      setDisplayText("\u00A0");
      return;
    }

    let timeout: ReturnType<typeof setTimeout>;
    
    const startScrambling = () => {
      frameRef.current = 0;
      let lastTime = performance.now();
      
      const update = (time: number) => {
        if (time - lastTime >= 25) {
          frameRef.current += 0.5;
          lastTime = time;
          
          let result = "";
          let finished = true;
          
          const maxRevealed = Math.floor(frameRef.current);
          
          for (let i = 0; i < text.length; i++) {
            if (text[i] === " ") {
              result += " ";
              continue;
            }
            
            if (i < maxRevealed) {
              result += text[i];
            } else if (i < maxRevealed + 3) {
              result += CHARS[Math.floor(Math.random() * CHARS.length)];
              finished = false;
            } else {
              result += "";
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
    };

    timeout = setTimeout(startScrambling, delay);

    return () => {
      clearTimeout(timeout);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [text, delay, triggered]);

  // Use dangerouslySetInnerHTML to properly handle HTML entities if needed (like <br/>)
  // Wait, text might contain <br/>? No, the prompt says "Each line wrapped in ScrambleIn".
  return <span>{displayText}</span>;
}
