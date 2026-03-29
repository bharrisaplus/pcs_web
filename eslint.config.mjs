import { default as ESLintJS } from '@eslint/js';
import { defineConfig } from "eslint/config";
import { default as stylistic } from '@stylistic/eslint-plugin';
import { default as BrowserCompat } from 'eslint-plugin-compat';

const demoLintConfig = defineConfig([
  ESLintJS.configs.recommended,
  BrowserCompat.configs["flat/recommended"],
  {
    plugins: {
      "@stylistic": stylistic
    },
    rules: {
      '@stylistic/max-len': ["warn", {
        "tabWidth": 4,
        "code": 111,
        "comments": 102,
        "ignorePattern": "@(import|typedef|property)",
        "ignoreComments": false,
        "ignoreTrailingComments": false,
        "ignoreUrls": false,
        "ignoreStrings": false,
        "ignoreTemplateLiterals": false,
        "ignoreRegExpLiterals": false
      }]
    },
    languageOptions: {
    	globals: {
        arguments: "readonly",
        // web api
    		window: "readonly",
    		document: "readonly",
        HTMLElement: "readonly",
        console: "readonly",
        fetch: "readonly",
        navigator: "readonly",
        localStorage: "readonly",
        DOMParser: "readonly",
        XMLSerializer: "readonly",
        CustomEvent: "readonly",
        AbortController: "readonly",
        DOMException: "readonly",
        URL: "readonly",
        Image: "readonly",
        Blob: "readonly",
        // third party
        html2canvas: "readonly",
        chance: "readonly",
    	}
    }
  }
]);


export default demoLintConfig;
