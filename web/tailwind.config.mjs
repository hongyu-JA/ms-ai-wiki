/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}"],
  theme: {
    extend: {
      colors: {
        // Tier badges
        "tier-1": "#16a34a",  // green
        "tier-2": "#ca8a04",  // amber
        "tier-3": "#6b7280",  // gray
        // Watch badges
        "watch-close": "#dc2626",     // red
        "watch-standard": "#2563eb",  // blue
        "watch-passive": "#9ca3af",   // gray
        // Status badges
        "status-ga": "#059669",
        "status-preview": "#7c3aed",
        "status-deprecated": "#dc2626",
        "status-eos": "#991b1b",
      },
    },
  },
};
