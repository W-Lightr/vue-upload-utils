/** @type {path.PlatformPath | path} */
const path = require('path');

module.exports = {
    content: [
        path.join(__dirname, './src/**/*.{vue,js,ts,jsx,tsx,html}'),
        path.join(__dirname, './vue3-playground/*.{vue,js,ts,jsx,tsx,html}'),
        path.join(__dirname, './vue2-playground/*.{vue,js,ts,jsx,tsx,html}'),
        path.join(__dirname, './vue2.7-playground/*.{vue,js,ts,jsx,tsx,html}')
    ],
    theme: {
        extend: {},
    },
    plugins: [],
}

