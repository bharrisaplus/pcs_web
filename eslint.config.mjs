import { default as ESLintJS } from '@eslint/js';
import { defineConfig } from "eslint/config";


const demoLintConfig = defineConfig([
  ESLintJS.configs.recommended,
  {
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
        CustomEvent: "readonly"
    	}
    }
  }
]);


export default demoLintConfig;
