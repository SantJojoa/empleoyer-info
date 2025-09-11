import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    theme: {
        extend: {},
    },
    plugins: [],
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
};

export default config;
