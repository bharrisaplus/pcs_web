
declare global {
  const td;

  interface Window {
    printTestGlobals: () => void
  };
};

export {};
