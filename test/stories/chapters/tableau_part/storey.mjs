/**
 * @import { CardIntri, CSSelector, Part } from 'pcs:types'
 * @import { ITestFunction } from 'zora';
 */

/* This files imports should be specified as part of the importmap in subject.page.pug */
import { hold as zaHold, createHarness, createTAPReporter } from 'zora';
import { default as td } from 'testdouble';

import { default as _tg } from './clones/_glods.clone.mjs';
import { default as fx } from 'storey:fixtures';


const
  /** @type {CSSelector} */
  tableauID = '#tableau',

  modulePaths = { // see importmap in subject.page.pug
    parts: {
      tableau: 'tableau_part'
    }
  },

  getImport = async () => {

    return {
      /** @type {Part.Tableau} */
      freshModule: (await import(modulePaths.parts.tableau)).default(tableauID)
    };
  };


/**
 * @param  {CardIntri[]} testInfos
 * @param  {ITestFunction} zaTest
 */
const tableau_part_tests = async (testInfos, zaTest) => {
  /** @type {HTMLElement} */
  const $tableau = document.querySelector(tableauID);


  if (!testInfos || !Array.isArray(testInfos || testInfos.length == 0)) {
    console.warn("Missing required info to run test(s)");
    return;
  }

  if (!$tableau) {
    console.warn("Missing required $element(s) to run test(s)");
    return;
  }


  try {
    await zaTest('Should handle normal conditions', async (z) => {
      let swearBhvRslts = [];
      const impMeta = await getImport();


      swearBhvRslts.push(impMeta.freshModule.currentOrder.length == _tg.c_Max);
      await fx.waaitt(100);

      td.reset();


      z.ok(swearBhvRslts[0], "stub assertion");
    }); // May need to set timeout in ms specificaly like { timeout: 6000 }
  } catch (t1E) {
    console.error(t1E);
  }
};


const test_routine = async (/** @type {CardIntri[]} */ routineInfos) => {
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

    await tableau_part_tests(routineInfos, zaHarness.test);
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
