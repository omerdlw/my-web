import { useState, useCallback } from "react";
import { FastAverageColor } from "fast-average-color";

export function useDominantColor() {
  const [color, setColor] = useState(null);

  const imageRef = useCallback((node) => {
    if (node !== null) {
      const fac = new FastAverageColor();
      fac
        .getColorAsync(node)
        .then((extractedColor) => {
          const saturated = extractedColor.value.map((v, i) =>
            i < 3 ? Math.min(255, v * 1.2) : v
          );
          setColor(saturated);
        })
        .catch((e) => console.error("Color extraction failed:", e));
    }
  }, []);

  const colorStyle = color
    ? { backgroundColor: `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.3)` }
    : { backgroundColor: "rgba(255, 255, 255, 0.05)" };

  return { imageRef, colorStyle };
}
