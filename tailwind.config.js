module.exports = {
  theme: {
    extend: {},
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".bg-clip-text": {
          "-webkit-background-clip": "text",
          "background-clip": "text",
        },
        ".text-transparent": {
          "-webkit-text-fill-color": "transparent",
          color: "transparent",
        },
      });
    },
  ],
};
