/** @type {import('tailwindcss').Config} */

// Renk değişkenlerini Tailwind formatına çeviren yardımcı fonksiyon
function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `hsla(var(${variableName}), ${opacityValue})`;
    }
    return `hsl(var(${variableName}))`;
  };
}

module.exports = {
  darkMode: "class",
  mode: "jit",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    // "./contexts/**/*.{js,ts,jsx,tsx,mdx}", // Gerekirse ekle
  ],
  theme: {
    extend: {
      // Renkleri CSS değişkenlerinden alacak şekilde tanımla
      textColor: {
        skin: {
          base: withOpacity("--color-text-base"),
          muted: withOpacity("--color-text-muted"),
          accent: withOpacity("--color-accent"),
          success: withOpacity("--color-success"),
          error: withOpacity("--color-error"),
          warning: withOpacity("--color-warning"),
          info: withOpacity("--color-info"),
        },
      },
      backgroundColor: {
        skin: {
          base: withOpacity("--color-bg-base"),
          muted: withOpacity("--color-bg-muted"),
          primary: withOpacity("--color-primary"),
          secondary: withOpacity("--color-secondary"),
          accent: withOpacity("--color-accent"),
          success: withOpacity("--color-success"),
          "success-muted": withOpacity("--color-success-muted"), // Soluk ton
          error: withOpacity("--color-error"),
          "error-muted": withOpacity("--color-error-muted"), // Soluk ton
          warning: withOpacity("--color-warning"),
          "warning-muted": withOpacity("--color-warning-muted"), // Soluk ton
          info: withOpacity("--color-info"),
          "info-muted": withOpacity("--color-info-muted"), // Soluk ton
        },
      },
      borderColor: {
        skin: {
          base: withOpacity("--color-border"),
          primary: withOpacity("--color-primary"),
          accent: withOpacity("--color-accent"),
          success: withOpacity("--color-success"),
          error: withOpacity("--color-error"),
          warning: withOpacity("--color-warning"),
          info: withOpacity("--color-info"),
        },
      },
      ringColor: {
        skin: {
          primary: withOpacity("--color-primary"),
          accent: withOpacity("--color-accent"),
          success: withOpacity("--color-success"),
          error: withOpacity("--color-error"),
          warning: withOpacity("--color-warning"),
          info: withOpacity("--color-info"),
        },
      },
      gradientColorStops: {
        // İsteğe bağlı: Gradient'ler için
        skin: {
          primary: withOpacity("--color-primary"),
          secondary: withOpacity("--color-secondary"),
          accent: withOpacity("--color-accent"),
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
