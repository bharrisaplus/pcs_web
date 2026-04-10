import axe from "axe-core";

declare global {
  interface Window {
    printTestGlobals: () => void;
    __coverage__;
    __tap__;
    axe: {
      run: typeof axe.run,
      configure: typeof axe.configure
    };
  };
};

export {};
