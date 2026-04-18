/**
 * @import { CSSelector, Hand, Part } from 'pcs:types'
 * @import { ITestFunction } from 'zora'
 */

/* This files imports should be specified as part of the importmap in desk.page.pug */
import { hold as zaHold, createHarness, createTAPReporter } from 'zora';
import { default as td } from 'testdouble';

import { default as _tg } from './clones/_glods.clone.mjs';
import { default as fx } from 'storey:fixtures';


const
  /** @type {CSSelector} */
  ribbonID = '#ribbon',
  /** @type {CSSelector} */
  ribbonRedownloadSelector = '.claw-drop',

  modulePaths = { // see importmap in desk.page.pug
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
        abCntrllr = new AbortController(),
        /** @type {HTMLBodyElement} */
        $testshell = document.querySelector(`#${_tg.appID}`),
        impMeta = await getImport(),
        /** @type {HTMLSelectElement} */
        $colorChng = document.querySelector(impMeta.freshModule.dyeInput);


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
        /** @type {HTMLBodyElement} */
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
        /** @type {HTMLBodyElement} */
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
  } catch (t3E) {
    console.error(t3E);
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
        /** @type {HTMLBodyElement} */
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
  } catch (t4E) {
    console.error(t4E);
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
        /** @type {HTMLBodyElement} */
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
  } catch (t5E) {
    console.error(t5E);
  }


  try {
    await zaTest("Should handle copy to clipboard", async (z) => {
      let outcome, swearBhvRslts = [], swearUIRslts = [], swearExplntns = [];
      const
        imagineTxt = "Totheclipboard\nAndanother",
        impMeta = await getImport();


      td.when(impMeta.moduleExporter.exportText(imagineTxt)).thenResolve(true);

      swearBhvRslts.push(impMeta.freshModule.isBusy);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.dyeInput}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.clearBtn}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.copyBtn}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.mingleBtn}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.downloadBtn}:disabled`).length);

      outcome = await impMeta.freshModule.composeTxt(imagineTxt.split("\n"));

      swearBhvRslts.push(impMeta.freshModule.isBusy);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.dyeInput}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.clearBtn}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.copyBtn}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.mingleBtn}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.downloadBtn}:disabled`).length);
      await fx.waaitt(1501);
      swearBhvRslts.push(impMeta.freshModule.isBusy);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.dyeInput}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.clearBtn}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.copyBtn}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.mingleBtn}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.downloadBtn}:disabled`).length);
      swearExplntns.push(td.explain(impMeta.moduleExporter.exportText));

      td.reset();
      impMeta.freshModule = null;
      impMeta.moduleExporter = null;


      z.ok(outcome, "result is truthy");
      z.same(swearExplntns[0].callCount, 1, "attempted clipboard write");
      z.same(swearUIRslts.toString(), "0,0,0,0,0,1,1,1,1,1,0,0,0,0,0", "disabled inputs as expected");
      z.same(swearBhvRslts.toString(), 'false,true,false', "busy as expected");
    });
  } catch (t6E) {
    console.error(t6E);
  }


  try {
    await zaTest("Should handle canvas rasterizing", async (z) => {
      let outcomes = [], swearBhvRslts = [], swearUIRslts = [], swearExplntns = [];
      const
        imagineColor = '',
        imagineSprites = [''],
        imagineSelector = '.thing',
        imagineUrl = ' ',
        $dropZone = document.querySelector(`${ribbonID} ${ribbonRedownloadSelector}`),
        impMeta = await getImport();


      td.when(
        impMeta.moduleExporter.generateImage(imagineColor, imagineSprites, imagineSelector)
      ).thenResolve(imagineUrl);

      swearBhvRslts.push(impMeta.freshModule.isBusy);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.dyeInput}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.clearBtn}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.copyBtn}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.mingleBtn}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.downloadBtn}:disabled`).length);

      outcomes.push(await impMeta.freshModule.prepareImg(imagineColor, imagineSprites, imagineSelector));

      swearBhvRslts.push(impMeta.freshModule.isBusy);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.dyeInput}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.clearBtn}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.copyBtn}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.mingleBtn}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.downloadBtn}:disabled`).length);
      await fx.waaitt(2001);
      swearBhvRslts.push(impMeta.freshModule.isBusy);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.dyeInput}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.clearBtn}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.copyBtn}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.mingleBtn}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.downloadBtn}:disabled`).length);
      outcomes.push($dropZone.getAttribute('href'));
      await fx.waaitt(2000);
      outcomes.push($dropZone.getAttribute('href'));
      swearExplntns.push(td.explain(impMeta.moduleExporter.generateImage));

      td.reset();
      impMeta.freshModule = null;
      impMeta.moduleExporter = null;


      z.ok(outcomes[0], "result is truthy");
      z.same(outcomes[1], imagineUrl, "updated download link");
      z.same(outcomes[2], null, "cleared download link");
      z.same(swearExplntns[0].callCount, 1, "attempted image generation");
      z.same(swearUIRslts.toString(), "0,0,0,0,0,1,1,1,1,1,0,0,0,0,0", "disabled inputs as expected");
      z.same(swearBhvRslts.toString(), 'false,true,false', "busy as expected");
    });
  } catch (t7E) {
    console.error(t7E);
  }


  try {
    await zaTest("Should handle reset", async (z) => {
      let swearBhvRslts = [], swearUIRslts = [], swearExplntns = [];
      const
        impMeta = await getImport();


      swearBhvRslts.push(impMeta.freshModule.isBusy);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.dyeInput}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.clearBtn}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.copyBtn}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.mingleBtn}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.downloadBtn}:disabled`).length);

      impMeta.freshModule.resetCtrls();

      swearBhvRslts.push(impMeta.freshModule.isBusy);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.dyeInput}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.clearBtn}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.copyBtn}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.mingleBtn}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.downloadBtn}:disabled`).length);
      await fx.waaitt(1501);
      swearBhvRslts.push(impMeta.freshModule.isBusy);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.dyeInput}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.clearBtn}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.copyBtn}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.mingleBtn}:disabled`).length);
      swearUIRslts.push(document.querySelectorAll(`${impMeta.freshModule.downloadBtn}:disabled`).length);
      swearExplntns.push(td.explain(impMeta.moduleExporter.generateImage));

      td.reset();
      impMeta.freshModule = null;
      impMeta.moduleExporter = null;


      z.same(swearUIRslts.toString(), "0,0,0,0,0,1,1,1,1,1,0,0,0,0,0", "disabled inputs as expected");
      z.same(swearBhvRslts.toString(), 'false,true,false', "busy as expected");
    });
  } catch (t7E) {
    console.error(t7E);
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
  } catch (tstErr) {
    console.warn("Issue during test routine");
    console.error(tstErr);
  }
};


zaHold();

export default {
  go: test_routine
};
