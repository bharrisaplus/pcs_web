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
        module_console_info: mockCInf,
      });
    };


  if (!testInfos || !Array.isArray(testInfos || testInfos.length == 0)) {
    console.warn("Missing required info to run test(s)");
    return;
  }


  zaTest('Should be ok', (z) => {
    let swearResult, swearExplntn;
    const mockObj = td.object(['hello']);

    td.when(mockObj.hello()).thenReturn('world');

    swearResult = mockObj.hello();
    swearExplntn = td.explain(mockObj.hello);

    z.same(swearResult, 'world', "Should return world from hello");
    z.same(swearExplntn.callCount, 1, "Should call hello once");
  });


  zaTest('Should import', async (z) => {
    let swearResult, swearExplntn
    const
      impMeta = await getImport();

    impMeta.freshModule.loadTurntable(testInfos[0]);

    swearResult = impMeta.freshModule.cursor;

    await fx.waaitt();
    $turntable.hidePopover();

    swearExplntn = td.explain(impMeta.module_console_debug);

    td.reset();


    z.same(swearExplntn.callCount, 3, "call devlog expected number of times");
    z.deepEqual(swearResult, [0, 15], "loaded expected card");
  }, { timeout: 12000 });
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
