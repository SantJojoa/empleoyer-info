import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#1173d4",
                "background-light": "#f6f7f8",
                "background-dark": "#101922",
            },
            borderRadius: {
                "DEFAULT": "0.25rem",
                "lg": "0.5rem",
                "xl": "0.75rem",
                "full": "9999px"
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/container-queries'), // 👈 este habilita el @container
    ],
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
};

export default config;
