module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        muted: "#6B7280",
        secondary: "#4B5563",
        brand: "#0F766E",
        "brand-hover": "#0F5F59",
        "brand-soft": "#F0FDFA",
        paper: "#FAFAF8",
        border: "#E5E7EB",
        "border-strong": "#D1D5DB",
        "warning-soft": "#FFFBEB",
        "warning-border": "#FDE68A",
        danger: "#DC2626"
      }
    }
  },
  plugins: []
};
