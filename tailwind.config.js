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
      borderRadius: {
        primary: "30px",
        secondary: "20px",
        tertiary: "16px",
      },
      textColor: {
        skin: {
          primary: withOpacity("--color-primary"),
          success: withOpacity("--color-success"),
          error: withOpacity("--color-error"),
          warning: withOpacity("--color-warning"),
          info: withOpacity("--color-info"),
        },
      },
      backgroundColor: {
        skin: {
          primary: withOpacity("--color-primary"),
          success: withOpacity("--color-success"),
          error: withOpacity("--color-error"),
          warning: withOpacity("--color-warning"),
          info: withOpacity("--color-info"),
        },
      },
      borderColor: {
        skin: {
          primary: withOpacity("--color-primary"),
          success: withOpacity("--color-success"),
          error: withOpacity("--color-error"),
          warning: withOpacity("--color-warning"),
          info: withOpacity("--color-info"),
        },
      },
      ringColor: {
        skin: {
          primary: withOpacity("--color-primary"),
          success: withOpacity("--color-success"),
          error: withOpacity("--color-error"),
          warning: withOpacity("--color-warning"),
          info: withOpacity("--color-info"),
        },
      },
      gradientColorStops: {
        skin: {
          primary: withOpacity("--color-primary"),
          success: withOpacity("--color-success"),
          error: withOpacity("--color-error"),
          warning: withOpacity("--color-warning"),
          info: withOpacity("--color-info"),
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
