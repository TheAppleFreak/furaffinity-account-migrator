module.exports = {
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    plugins: [require('daisyui')],
    daisyui: {
        themes: ["business"],
        darkTheme: "business",
        base: true,
        styled: true,
        utils: true
    }
};
  