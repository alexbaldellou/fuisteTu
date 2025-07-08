// tailwind.config.js
import { nextui } from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
export const content = [
  "./index.html", "./src/**/*.{js,ts,jsx,tsx}",
  "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
];
export const theme = {
  extend: {
    animation: {
      'ping-2': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
    },
  },
};
export const darkMode = "class";
export const plugins = [nextui()];