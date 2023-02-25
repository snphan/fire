/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    fontFamily: {
      ubuntu: ["Ubuntu"]
    },
    extend: {
      fontSize: {
        '2xs': '0.5rem'
      },
      dropShadow: {
        'strong': '0 4px 4px rgba(0, 0, 0, 0.5)',
        '4xl': [
          '0 35px 35px rgba(0, 0, 0, 0.25)',
          '0 45px 65px rgba(0, 0, 0, 0.15)'
        ]
      },
      width: {
        '128': '32rem',
      },
      colors: {
        sky: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
        zinc: {
          100: "rgb(244 244 245)",
          200: "rgb(228 228 231)",
          300: "rgb(212 212 216)",
          400: "rgb(161 161 170)",
          500: "rgb(113 113 122)",
          600: "rgb(82 82 91)",
          700: "rgb(63 63 70)",
          800: "rgb(37 37 40)",
          900: "rgb(26 26 29)"
        }
      },
      animation: {
        bounceMiddle: 'bounceMiddle 1s infinite'
      },
      keyframes: {
        bounceMiddle: {
          '0%, 100%': { transform: 'translateY(-25%) translateX(-50%)', 'animation-timing-function': 'cubic-bezier(0.8,0,1,1)' },
          '50%': { transform: 'translateX(-50%)', 'animation-timing-function': 'cubic-bezier(0,0,0.2,1)' },
        }
      }
    }
  },
  plugins: [
    require('tailwind-scrollbar')({ nocompatible: true })
  ],
});
