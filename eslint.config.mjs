import { default as NodeProcess } from 'node:process';
import { default as NodePath } from 'node:path';

import { default as ESLintJS } from '@eslint/js';


const
  _dir = import.meta.dirname,
  buildInfo = {
    common: {
      behavior_path: NodeProcess.env.BEHAVIOR_DIR || NodePath.resolve(_dir, './source/behavior')
    }
  };


const demoLintConfig = {
  ...ESLintJS.configs.recommended,
  files: [
    NodePath.resolve(buildInfo.common.behavior_path, 'demo.{js,mjs}')
  ],
  languageOptions: {
  	globals: {
  		document: "readonly",
  		window: "readonly",
  	}
  }
}


export default demoLintConfig
