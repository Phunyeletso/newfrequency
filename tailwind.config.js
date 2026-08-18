/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Ground — near-black, matches the app
        ground: "#0A0A0B",
        surface: "#141416",
        raised: "#1C1C20",
        line: "#2A2A30",
        // Accent — anything positive or monetary
        accent: "#22C55E",
        "accent-dim": "#16A34A",
        // Identity colours: ONLY for naming the four content types
        reels: "#7C3AED",
        tunes: "#10B981",
        snaps: "#F59E0B",
        chats: "#3B82F6",
        ink: "#F4F4F5",
        muted: "#A1A1AA",
        faint: "#71717A",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      },
      maxWidth: { content: "68rem", prose: "42rem" },
    },
  },
  plugins: [],
};
