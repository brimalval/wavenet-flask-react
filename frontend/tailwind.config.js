module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      xs: "0px",
      sm: "600px",
      md: "900px",
      lg: "1200px",
      xl: "1536px",
    },
    extend: {
      colors: {
        primary: "#577B7C",
        secondary: {
          400: "#345556",
          // Hover color
          500: "#3a6477",
        },
      },
    },
  },
  plugins: [],
};
