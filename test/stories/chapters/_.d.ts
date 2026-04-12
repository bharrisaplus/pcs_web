import axe from "axe-core";

declare global {
  interface Window {
    printTestGlobals: () => void;
    __coverage__;
    __tap__ :string;
    __stampt__ :number;
    axe: {
      run: typeof axe.run,
      configure: typeof axe.configure
    };
  };
};

export {};
