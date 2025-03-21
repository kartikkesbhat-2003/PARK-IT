/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      inter: ["Inter", "sans-serif"],
      "edu-sa": ["Edu SA Beginner", "cursive"],
      mono: ["Roboto Mono", "monospace"],
    },
    colors: {
      white: "#fff",
      black: "#000",
      transparent: "#ffffff00",
      richblack: {
        5: "#F1F2FF",
        25: "#DBDDEA",
        50: "#C5C7D4",
        100: "#AFB2BF",
        200: "#999DAA",
        300: "#838894",
        400: "#6E727F",
        500: "#585D69",
        600: "#424854",
        700: "#2C333F",
        800: "#161D29",
        900: "#000814",
      },
      richblue: {
        5: "#ECF5FF",
        25: "#C6D6E1",
        50: "#A0B7C3",
        100: "#7A98A6",
        200: "#537988",
        300: "#2D5A6A",
        400: "#073B4C",
        500: "#063544",
        600: "#042E3B",
        700: "#032833",
        800: "#01212A",
        900: "#001B22",
      },
      blue: {
        5: "#EAF5FF",
        25: "#B4DAEC",
        50: "#7EC0D9",
        100: "#47A5C5",
        200: "#118AB2",
        300: "#0F7A9D",
        400: "#0C6A87",
        500: "#0A5A72",
        600: "#074B5D",
        700: "#053B48",
        800: "#022B32",
        900: "#001B1D",
      },
      caribbeangreen: {
        5: "#C1FFFD",
        25: "#83F1DE",
        50: "#44E4BF",
        100: "#06D6A0",
        200: "#05BF8E",
        300: "#05A77B",
        400: "#049069",
        500: "#037957",
        600: "#026144",
        700: "#014A32",
        800: "#01321F",
        900: "#001B0D",
      },
      brown: {
        5: "#FFF4C4",
        25: "#FFE395",
        50: "#FFD166",
        100: "#E7BC5B",
        200: "#CFA64F",
        300: "#B89144",
        400: "#A07C39",
        500: "#88662D",
        600: "#705122",
        700: "#593C17",
        800: "#41260B",
        900: "#291100",
      },
      pink: {
        5: "#FFF1F1",
        25: "#FBC7D1",
        50: "#F79CB0",
        100: "#F37290",
        200: "#EF476F",
        300: "#D43D63",
        400: "#BA3356",
        500: "#9F294A",
        600: "#841E3E",
        700: "#691432",
        800: "#4F0A25",
        900: "#340019",
      },
      yellow: {
        5: "#FFF970",
        25: "#FFE83D",
        50: "#FFD60A",
        100: "#E7C009",
        200: "#CFAB08",
        300: "#B69507",
        400: "#9E8006",
        500: "#866A04",
        600: "#6E5503",
        700: "#553F02",
        800: "#3D2A01",
        900: "#251400",
      },
      violet: {
        5: "#F3EBFF",
        25: "#D6C8FF",
        50: "#B8A6FF",
        100: "#9B83FF",
        200: "#7E61FF",
        300: "#6F54E0",
        400: "#5F47C2",
        500: "#503AA3",
        600: "#402C85",
        700: "#301F66",
        800: "#201248",
        900: "#10062A",
      },
      "pure-greys": {
        5: "#F9F9F9",
        25: "#E2E2E2",
        50: "#CCCCCC",
        100: "#B5B5B5",
        200: "#9E9E9E",
        300: "#888888",
        400: "#717171",
        500: "#5B5B5B",
        600: "#444444",
        700: "#2D2D2D",
        800: "#171717",
        900: "#141414",
      },
      purple: {
        5: "#FAF5FF",
        25: "#E9D8FD",
        50: "#D6BCFA",
        100: "#B794F4",
        200: "#9F7AEA",
        300: "#805AD5",
        400: "#6B46C1",
        500: "#553C9A",
        600: "#44337A",
        700: "#322659",
        800: "#21183C",
        900: "#190B28",
      },
      red: {
        5: "#FFF5F5",
        25: "#FED7D7",
        50: "#FEB2B2",
        100: "#FC8181",
        200: "#F56565",
        300: "#E53E3E",
        400: "#C53030",
        500: "#9B2C2C",
        600: "#742A2A",
        700: "#63171B",
        800: "#4A1212",
        900: "#2C0D0D",
      },
      gray: {
        5: "#F7FAFC",
        25: "#EDF2F7",
        50: "#E2E8F0",
        100: "#CBD5E0",
        200: "#A0AEC0",
        300: "#718096",
        400: "#4A5568",
        500: "#2D3748",
        600: "#1A202C",
        700: "#1C1F2E",
        800: "#2B2F3A",
        900: "#2D3748",
    },
      green: {
        5: "#F0FFF4",
        25: "#C6F6D5",
        50: "#9AE6B4",
        100: "#68D391",
        200: "#48BB78",
        300: "#38A169",
        400: "#2F855A",
        500: "#276749",
        600: "#22543D",
        700: "#1C4532",
        800: "#153E25",
        900: "#0C2910",
      },
    },
    extend: {
      maxWidth: {
        maxContent: "1260px",
        maxContentTab: "650px",
      },
    },
  },
  plugins: [],
};
