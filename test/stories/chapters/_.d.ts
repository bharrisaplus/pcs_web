import axe from "axe-core";

declare global {
  var
    printTestGlobals: () => void,
    runTests: () => Promise<boolean>;


  interface Window {
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
