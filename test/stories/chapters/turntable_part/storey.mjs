/**
 * @import { CardIntri, CSSelector } from 'pcs:types'
 */

/* This files imports should be specified as part of the importmap in subject.page.pug */
import { hold as zaHold, test as zaTest, report as zaReport, createTAPReporter } from 'zora';
import { default as td } from 'testdouble';

import { default as _tg } from './clones/_glods.clone.mjs';
import { default as fx } from './fixture.mjs';


const turntable_part_tests = async (/** @type {CardIntri[]} */ testInfos) => {
  const
    /** @type {CSSelector} */
    turntableID = '#turntable',
    /** @type {HTMLElement} */
    $turntable = document.querySelector(turntableID),
    /** @type {HTMLElement} */
    $turntableOff = $turntable.querySelector('.turntable-off'),

    getImport = async () => {
      const
        mockCWrn = td.replace(console, 'warn', td.func('console_log')),
        mockCDbg = td.replace(console, 'debug', td.func('console_log')),
        mockCErr = td.replace(console, 'error', td.func()),
        mockCInf = td.replace(console, 'info', td.func()),

        moduleImport = await import(`turntable_part`);

      return Object.freeze({
        freshModule: moduleImport.default(turntableID),
        module_console_warn: mockCWrn,
        module_console_debug: mockCDbg,
        module_console_error: mockCErr,
        module_console_info: mockCInf
      });
    };


  if (!testInfos || !Array.isArray(testInfos || testInfos.length == 0)) {
    console.warn("Missing required info to run test(s)");
    return;
  }


  await zaTest('Should handle normal conditions', async (z) => {
    let swearResults = [], swearExplntns = [];
    const
      impMeta = await getImport(),
      /** @type {HTMLButtonElement} */
      $nxtBtn = document.querySelector(impMeta.freshModule.nextBtn),
      /** @type {HTMLButtonElement} */
      $prvBtn = document.querySelector(impMeta.freshModule.prevBtn);

    impMeta.freshModule.loadTurntable(testInfos[0]);
    await fx.waaitt(700);
    swearResults.push(impMeta.freshModule.cursor);
    $nxtBtn.click();
    await fx.waaitt(400);
    swearResults.push(impMeta.freshModule.cursor);
    $prvBtn.click();
    await fx.wait(400);
    swearResults.push(impMeta.freshModule.cursor);
    $turntableOff.click();
    await fx.waaitt(700);
    swearExplntns.push(td.explain(impMeta.module_console_debug));

    td.reset();


    z.same(swearExplntns[0].callCount, 5, "call devlog expected number of times");
    z.same(swearResults[0].toString(), '0,15', "loaded expected card");
    z.same(swearResults[1].toString(), '1,5', "loaded expected card");
    z.same(swearResults[2].toString(), swearResults[0].toString(), "loaded expected card");
  }, { timeout: 6000 });


  await zaTest('Should handle edges', async (z) => {
    let swearResults = [], swearExplntns = [];
    const
      impMeta = await getImport(),
      /** @type {HTMLButtonElement} */
      $nxtBtn = document.querySelector(impMeta.freshModule.nextBtn),
      /** @type {HTMLButtonElement} */
      $prvBtn = document.querySelector(impMeta.freshModule.prevBtn);

    impMeta.freshModule.loadTurntable(testInfos[0]);
    await fx.waaitt(700);
    swearResults.push([$prvBtn.disabled, $nxtBtn.disabled]);
    $turntableOff.click();
    await fx.waaitt(700);
    impMeta.freshModule.loadTurntable(testInfos[testInfos.length - 1]);
    await fx.waaitt(700);
    swearResults.push([$prvBtn.disabled, $nxtBtn.disabled]);
    $turntableOff.click();
    await fx.wait(700);
    swearExplntns.push(td.explain(impMeta.module_console_debug));

    td.reset();


    z.same(swearExplntns[0].callCount, 6, "call devlog expected number of times");
    z.same(swearResults[0].toString(), 'true,false', "prevent back at start edge");
    z.same(swearResults[1].toString(), 'false,true', "prevent forward at end edge");
  }, { timeout: 7000 });


  if ($turntable.matches(':popover-open')) { $turntable.hidePopover(); }
};


const test_routine = async (/** @type {CardIntri[]} */ routineInfos) => {
  /** @type {string[]} */
  let zaTapLines = [];
  const
    zaTapReporter = createTAPReporter({
      log: (/** @type {string} */ zaTapLogLine) => { zaTapLines.push(zaTapLogLine); },
      serialize: (/** @type {any} */ zaTapVal) => { return JSON.stringify(zaTapVal); },
    });


  try {
    window.__stampt__ = Date.now();

    await turntable_part_tests(routineInfos);
    await zaReport({ reporter: zaTapReporter });

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
