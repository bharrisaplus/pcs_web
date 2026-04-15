/**
 * @import { CSSelector, Hand, Part } from 'pcs:types'
 * @import { ITestFunction } from 'zora'
 */

/* This files imports should be specified as part of the importmap in subject.page.pug */
import { hold as zaHold, createHarness, createTAPReporter } from 'zora';
import { default as td } from 'testdouble';

import { default as _tg } from './clones/_glods.clone.mjs';
import { default as fx } from './fixture.mjs';


const
  /** @type {CSSelector} */
  ribbonID = '#ribbon',

  modulePaths = { // see importmap in subject.page.pug
    hands: {
      egress: 'egress_hand_clone',
    },
    parts: {
      ribbon: 'ribbon_part'
    }
  },

  getImport = async () => {
    const _mockEgress = (await import(modulePaths.hands.egress)).default;

    return {
      /** @type {Part.Ribbon} */
      freshModule: (await import(modulePaths.parts.ribbon)).default(ribbonID),
      /** @type {Hand.Egress} */
      moduleExporter: _mockEgress,
    };
  };


const turntable_part_tests = async (/** @type {ITestFunction} */ zaTest) => {
  const
    /** @type {HTMLElement} */
    $ribbon = document.querySelector(ribbonID);


  if (!$ribbon) {
    console.warn("Missing required $elements to run test(s)");
    return;
  }


  try {
    await zaTest('Should handle color pick', async (z) => {
      let
        swearBhvRslts = {
          /** @type {boolean[]} */
          busyChecks: [],
          /** @type {string[]} */
          eventChecks: []
        },
        swearUIRslts = [];
      const
        swearTxt = "Totheclipboard\nAndanother",
        abCntrllr = new AbortController(),
        /** @type {HTMLElement} */
        $testshell = document.querySelector(`#${_tg.appID}`),
        impMeta = await getImport(),
        /** @type {HTMLSelectElement} */
        $colorChng = document.querySelector(impMeta.freshModule.dyeInput);


      td.when(impMeta.moduleExporter.exportText(swearTxt)).thenResolve(true);

      $testshell.addEventListener(_tg.notices.blend, () => {
        swearBhvRslts.eventChecks.push(_tg.notices.blend);
      }, { signal: abCntrllr.signal });

      $testshell.addEventListener(_tg.notices.chop, () => {
        swearBhvRslts.eventChecks.push(_tg.notices.chop);
      }, { signal: abCntrllr.signal });

      $testshell.addEventListener(_tg.notices.trace, () => {
        swearBhvRslts.eventChecks.push(_tg.notices.trace);
      }, { signal: abCntrllr.signal });

      $testshell.addEventListener(_tg.notices.splash, () => {
        swearBhvRslts.eventChecks.push(_tg.notices.splash);
      }, { signal: abCntrllr.signal });

      $testshell.addEventListener(_tg.notices.fresh, () => {
        swearBhvRslts.eventChecks.push(_tg.notices.fresh);
      }, { signal: abCntrllr.signal });

      swearBhvRslts.busyChecks.push(impMeta.freshModule.isBusy);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.dyeInput}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.clearBtn}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.copyBtn}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.mingleBtn}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.downloadBtn}:disabled`).length);

      $colorChng.value = '1';

      $colorChng.dispatchEvent(new Event('change'));
      swearBhvRslts.busyChecks.push(impMeta.freshModule.isBusy);
      await fx.waaitt(50);
      swearBhvRslts.busyChecks.push(impMeta.freshModule.isBusy);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.dyeInput}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.clearBtn}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.copyBtn}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.mingleBtn}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.downloadBtn}:disabled`).length);

      td.reset();
      impMeta.freshModule = null;
      impMeta.moduleExporter = null;
      abCntrllr.abort();


      z.same($colorChng.value, '0', "reset select element");
      z.same(swearUIRslts.toString(), "0,0,0,0,0,0,0,0,0,0", "no inputs disabled");
      z.same(swearBhvRslts.busyChecks.toString(), 'false,false,false', "no busy signal");
      z.same(swearBhvRslts.eventChecks.toString(), 'splash', 'events fired as expected');
    }); // May need to set timeout in ms specificaly like { timeout: 6000 }
  } catch (t1E) {
    console.error(t1E);
  }


  try {
    await zaTest('Should handle click (1)', async (z) => {
      let
        swearBhvRslts = {
          /** @type {boolean[]} */
          busyChecks: [],
          /** @type {string[]} */
          eventChecks: []
        },
        swearUIRslts = [];
      const
        abCntrllr = new AbortController(),
        /** @type {HTMLElement} */
        $testshell = document.querySelector(`#${_tg.appID}`),
        impMeta = await getImport(),
        /** @type {HTMLButtonElement} */
        $txtCpy = document.querySelector(impMeta.freshModule.copyBtn);


      $testshell.addEventListener(_tg.notices.blend, () => {
        swearBhvRslts.eventChecks.push(_tg.notices.blend);
      }, { signal: abCntrllr.signal });

      $testshell.addEventListener(_tg.notices.chop, () => {
        swearBhvRslts.eventChecks.push(_tg.notices.chop);
      }, { signal: abCntrllr.signal });

      $testshell.addEventListener(_tg.notices.trace, () => {
        swearBhvRslts.eventChecks.push(_tg.notices.trace);
      }, { signal: abCntrllr.signal });

      $testshell.addEventListener(_tg.notices.splash, () => {
        swearBhvRslts.eventChecks.push(_tg.notices.splash);
      }, { signal: abCntrllr.signal });

      $testshell.addEventListener(_tg.notices.fresh, () => {
        swearBhvRslts.eventChecks.push(_tg.notices.fresh);
      }, { signal: abCntrllr.signal });

      swearBhvRslts.busyChecks.push(impMeta.freshModule.isBusy);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.dyeInput}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.clearBtn}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.copyBtn}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.mingleBtn}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.downloadBtn}:disabled`).length);

      $txtCpy.click();
      swearBhvRslts.busyChecks.push(impMeta.freshModule.isBusy);
      await fx.waaitt(50);
      swearBhvRslts.busyChecks.push(impMeta.freshModule.isBusy);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.dyeInput}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.clearBtn}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.copyBtn}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.mingleBtn}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.downloadBtn}:disabled`).length);

      td.reset();
      impMeta.freshModule = null;
      impMeta.moduleExporter = null;
      abCntrllr.abort();


      z.same(swearUIRslts.toString(), "0,0,0,0,0,0,0,0,0,0", "no inputs disabled");
      z.same(swearBhvRslts.busyChecks.toString(), 'false,false,false', "no busy signal");
      z.same(swearBhvRslts.eventChecks.toString(), 'chop', 'events fired as expected');
    });
  } catch (t2E) {
    console.error(t2E);
  }


  try {
    await zaTest('Should handle click (2)', async (z) => {
      let
        swearBhvRslts = {
          /** @type {boolean[]} */
          busyChecks: [],
          /** @type {string[]} */
          eventChecks: []
        },
        swearUIRslts = [];
      const
        abCntrllr = new AbortController(),
        /** @type {HTMLElement} */
        $testshell = document.querySelector(`#${_tg.appID}`),
        impMeta = await getImport(),
        /** @type {HTMLButtonElement} */
        $imgCpy = document.querySelector(impMeta.freshModule.downloadBtn);


      $testshell.addEventListener(_tg.notices.blend, () => {
        swearBhvRslts.eventChecks.push(_tg.notices.blend);
      }, { signal: abCntrllr.signal });

      $testshell.addEventListener(_tg.notices.chop, () => {
        swearBhvRslts.eventChecks.push(_tg.notices.chop);
      }, { signal: abCntrllr.signal });

      $testshell.addEventListener(_tg.notices.trace, () => {
        swearBhvRslts.eventChecks.push(_tg.notices.trace);
      }, { signal: abCntrllr.signal });

      $testshell.addEventListener(_tg.notices.splash, () => {
        swearBhvRslts.eventChecks.push(_tg.notices.splash);
      }, { signal: abCntrllr.signal });

      $testshell.addEventListener(_tg.notices.fresh, () => {
        swearBhvRslts.eventChecks.push(_tg.notices.fresh);
      }, { signal: abCntrllr.signal });

      swearBhvRslts.busyChecks.push(impMeta.freshModule.isBusy);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.dyeInput}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.clearBtn}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.copyBtn}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.mingleBtn}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.downloadBtn}:disabled`).length);

      $imgCpy.click();
      swearBhvRslts.busyChecks.push(impMeta.freshModule.isBusy);
      await fx.waaitt(50);
      swearBhvRslts.busyChecks.push(impMeta.freshModule.isBusy);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.dyeInput}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.clearBtn}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.copyBtn}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.mingleBtn}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.downloadBtn}:disabled`).length);

      td.reset();
      impMeta.freshModule = null;
      impMeta.moduleExporter = null;
      abCntrllr.abort();


      z.same(swearUIRslts.toString(), "0,0,0,0,0,0,0,0,0,0", "no inputs disabled");
      z.same(swearBhvRslts.busyChecks.toString(), 'false,false,false', "no busy signal");
      z.same(swearBhvRslts.eventChecks.toString(), 'trace', 'events fired as expected');
    });
  } catch (t2E) {
    console.error(t2E);
  }


  try {
    await zaTest('Should handle click (3)', async (z) => {
      let
        swearBhvRslts = {
          /** @type {boolean[]} */
          busyChecks: [],
          /** @type {string[]} */
          eventChecks: []
        },
        swearUIRslts = [];
      const
        abCntrllr = new AbortController(),
        /** @type {HTMLElement} */
        $testshell = document.querySelector(`#${_tg.appID}`),
        impMeta = await getImport(),
        /** @type {HTMLButtonElement} */
        $shfflr = document.querySelector(impMeta.freshModule.mingleBtn);


      $testshell.addEventListener(_tg.notices.blend, () => {
        swearBhvRslts.eventChecks.push(_tg.notices.blend);
      }, { signal: abCntrllr.signal });

      $testshell.addEventListener(_tg.notices.chop, () => {
        swearBhvRslts.eventChecks.push(_tg.notices.chop);
      }, { signal: abCntrllr.signal });

      $testshell.addEventListener(_tg.notices.trace, () => {
        swearBhvRslts.eventChecks.push(_tg.notices.trace);
      }, { signal: abCntrllr.signal });

      $testshell.addEventListener(_tg.notices.splash, () => {
        swearBhvRslts.eventChecks.push(_tg.notices.splash);
      }, { signal: abCntrllr.signal });

      $testshell.addEventListener(_tg.notices.fresh, () => {
        swearBhvRslts.eventChecks.push(_tg.notices.fresh);
      }, { signal: abCntrllr.signal });

      swearBhvRslts.busyChecks.push(impMeta.freshModule.isBusy);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.dyeInput}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.clearBtn}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.copyBtn}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.mingleBtn}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.downloadBtn}:disabled`).length);

      $shfflr.click();
      swearBhvRslts.busyChecks.push(impMeta.freshModule.isBusy);
      await fx.waaitt(50);
      swearBhvRslts.busyChecks.push(impMeta.freshModule.isBusy);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.dyeInput}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.clearBtn}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.copyBtn}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.mingleBtn}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.downloadBtn}:disabled`).length);

      td.reset();
      impMeta.freshModule = null;
      impMeta.moduleExporter = null;
      abCntrllr.abort();


      z.same(swearUIRslts.toString(), "0,0,0,0,0,0,0,0,0,0", "no inputs disabled");
      z.same(swearBhvRslts.busyChecks.toString(), 'false,false,false', "no busy signal");
      z.same(swearBhvRslts.eventChecks.toString(), 'blend', 'events fired as expected');
    });
  } catch (t2E) {
    console.error(t2E);
  }


  try {
    await zaTest('Should handle click (4)', async (z) => {
      let
        swearBhvRslts = {
          /** @type {boolean[]} */
          busyChecks: [],
          /** @type {string[]} */
          eventChecks: []
        },
        swearUIRslts = [];
      const
        abCntrllr = new AbortController(),
        /** @type {HTMLElement} */
        $testshell = document.querySelector(`#${_tg.appID}`),
        impMeta = await getImport(),
        /** @type {HTMLButtonElement} */
        $blnkr = document.querySelector(impMeta.freshModule.clearBtn);


      $testshell.addEventListener(_tg.notices.blend, () => {
        swearBhvRslts.eventChecks.push(_tg.notices.blend);
      }, { signal: abCntrllr.signal });

      $testshell.addEventListener(_tg.notices.chop, () => {
        swearBhvRslts.eventChecks.push(_tg.notices.chop);
      }, { signal: abCntrllr.signal });

      $testshell.addEventListener(_tg.notices.trace, () => {
        swearBhvRslts.eventChecks.push(_tg.notices.trace);
      }, { signal: abCntrllr.signal });

      $testshell.addEventListener(_tg.notices.splash, () => {
        swearBhvRslts.eventChecks.push(_tg.notices.splash);
      }, { signal: abCntrllr.signal });

      $testshell.addEventListener(_tg.notices.fresh, () => {
        swearBhvRslts.eventChecks.push(_tg.notices.fresh);
      }, { signal: abCntrllr.signal });

      swearBhvRslts.busyChecks.push(impMeta.freshModule.isBusy);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.dyeInput}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.clearBtn}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.copyBtn}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.mingleBtn}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.downloadBtn}:disabled`).length);

      $blnkr.click();
      swearBhvRslts.busyChecks.push(impMeta.freshModule.isBusy);
      await fx.waaitt(50);
      swearBhvRslts.busyChecks.push(impMeta.freshModule.isBusy);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.dyeInput}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.clearBtn}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.copyBtn}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.mingleBtn}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.downloadBtn}:disabled`).length);

      td.reset();
      impMeta.freshModule = null;
      impMeta.moduleExporter = null;
      abCntrllr.abort();


      z.same(swearUIRslts.toString(), "0,0,0,0,0,0,0,0,0,0", "no inputs disabled");
      z.same(swearBhvRslts.busyChecks.toString(), 'false,false,false', "no busy signal");
      z.same(swearBhvRslts.eventChecks.toString(), 'fresh', 'events fired as expected');
    });
  } catch (t2E) {
    console.error(t2E);
  }
};


const test_routine = async () => {
  /** @type {string[]} */
  let zaTapLines = [];
  const
    zaHarness = createHarness({onlyMode: false}),
    zaTapReporter = createTAPReporter({
      log: (/** @type {string} */ zaTapLogLine) => { zaTapLines.push(zaTapLogLine); },
      serialize: (/** @type {any} */ zaTapVal) => { return JSON.stringify(zaTapVal); },
    });


  try {
    window.__stampt__ = Date.now();

    await turntable_part_tests(zaHarness.test);
    await zaHarness.report({ reporter: zaTapReporter });

    window.__tap__ = zaTapLines.join('\n');
    zaTapLines = [];

    window.parent.postMessage({type: 'finished'});
  } catch (tstErr) {
    console.warn("Issue during test routine");
    console.error(tstErr);
  }
};


zaHold();

export default {
  go: test_routine
};
