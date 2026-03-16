import { default as ESLintJS } from '@eslint/js';
import { defineConfig } from "eslint/config";
import stylistic from '@stylistic/eslint-plugin';

const demoLintConfig = defineConfig([
  ESLintJS.configs.recommended,
  {
    plugins: {
      "@stylistic": stylistic
    },
    rules: {
      '@stylistic/max-len': ["warn", {
        "tabWidth": 4,
        "code": 111,
        "comments": 102,
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
    		document: "readonly",
    		window: "readonly",
        html2canvas: "readonly",
        chance: "readonly",
        HTMLElement: "readonly",
        console: "readonly",
        DOMParser: "readonly",
        fetch: "readonly",
        CustomEvent: "readonly",
        AbortController: "readonly",
        navigator: "readonly",
        DOMException: "readonly",
        URL: "readonly",
        Image: "readonly",
        XMLSerializer: "readonly",
        Blob: "readonly",
        arguments: "readonly",
        localStorage: "readonly"
    	}
    }
  }
]);


export default demoLintConfig;
