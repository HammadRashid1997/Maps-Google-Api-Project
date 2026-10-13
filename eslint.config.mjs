
import js from "@eslint/js";
import globals from "globals";

export default [
    {
        ignores: [
            "node_modules/**",
            "config.js"
        ]
    },
    {
        files: ["**/*.js"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "script",
            globals: {
                ...globals.browser,
                google: "readonly",
                GOOGLE_MAPS_API_KEY: "readonly"
            }
        },
        rules: {
            ...js.configs.recommended.rules
        }
    }
];
