import axe from "axe-core";

declare global {
  const td;

  interface Window {
    printTestGlobals: () => void;
    axe: {
      run: typeof axe.run,
      configure: typeof axe.configure
    };
  };
};

export {};
