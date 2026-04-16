
const getFixtures = () => {
  return Object.freeze({
    i_capp: (/** @type {number} */ cur, /** @type {number} */ upperBound) => {
      let result = 0;

      if (!cur || !upperBound || !Number.isInteger(cur) || !Number.isInteger(upperBound)) { return result; }

      switch (true) {
        case (cur >= upperBound): result = upperBound - 1; break;
        case (cur < 0): result = 0; break;
        default: result = cur;
      }

      return result;
    },

    waaitt: async (ms = 2000) => { // Shinynew but no Safari for now
      const fMS = ms >= 1000 ? ms : 1000;

      // oxlint-disable-next-line compat/compat
      return window.scheduler.postTask(() => {}, {
        delay: fMS <= 30000 ? fMS : 30000,
        priority: 'user-blocking'
      });
    },

    wait: async (msec = 2000) => { // The classic
      const fMSec = msec >= 1000 ? msec : 1000;

      return new Promise(function (resolve) {
        setTimeout(resolve, fMSec <= 30000 ? fMSec : 30000)
      });
    }
  });
};


const apparatus = getFixtures();

export default apparatus;
