// eslint-disable-next-line @typescript-eslint/no-require-imports
const { heroui } = require("@heroui/theme");

module.exports = {
  content: [
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.tsx",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [heroui()],
};
