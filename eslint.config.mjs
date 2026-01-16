import { default as NodeProcess } from 'node:process';
import { default as NodePath } from 'node:path';

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
        HTMLElement: "readonly"
    	}
    }
  }
]);


export default demoLintConfig;
