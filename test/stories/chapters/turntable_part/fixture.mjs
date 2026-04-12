
import { default as _tg } from './clones/_glods.clone.mjs';


const getFixtures = () => {
  return Object.freeze({
    sanitize_card_id: (cur = 0) => {
      let result;

      switch (true) {
        case (cur >= _tg.c_Max): result = _tg.c_Max - 1; break;
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

window.axe.configure({
  rules: [ // Just testing a popover so not all rules need apply
    {id: "landmark-one-main",  enabled: false },
    {id: "page-has-heading-one",  enabled: false }
  ]
});

export default apparatus;
