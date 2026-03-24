/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./index.html', './src/**/*.{ts,tsx}'],
    theme: {
        extend: {
            colors: {
                brand: {
                    50: '#eef4ff',
                    100: '#dfe9ff',
                    200: '#c6d8ff',
                    300: '#a4beff',
                    400: '#7a99ff',
                    500: '#586eff',
                    600: '#4b53f5',
                    700: '#3f41dd',
                    800: '#3536b3',
                    900: '#30348d',
                },
            },
            boxShadow: {
                soft: '0 10px 30px -12px rgba(20, 30, 70, 0.18)',
            },
            borderRadius: {
                '2xl': '1rem',
            },
        },
    },
    plugins: [],
};
