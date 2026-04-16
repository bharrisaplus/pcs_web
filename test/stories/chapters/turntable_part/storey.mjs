/**
 * @import { CardIntri, CSSelector, Hand, Part } from 'pcs:types'
 * @import { ITestFunction } from 'zora';
 */

/* This files imports should be specified as part of the importmap in subject.page.pug */
import { hold as zaHold, createHarness, createTAPReporter } from 'zora';
import { default as td } from 'testdouble';

import { default as fx } from 'storey:fixtures';


const
  /** @type {CSSelector} */
  turntableID = '#turntable',
  /** @type {CSSelector} */
  turntableCloseSelector = '.turntable-off',

  modulePaths = { // see importmap in subject.page.pug
    hands: {
      scribe: 'scribe_hand_clone',
    },
    parts: {
      turntable: 'turntable_part'
    }
  },

  getImport = async () => {
    const _mockScribe = (await import(modulePaths.hands.scribe)).default;

    return {
      /** @type {Part.Turntable} */
      freshModule: (await import(modulePaths.parts.turntable)).default(turntableID),
      /** @type {Hand.Scribe} */
      moduleLogger: _mockScribe,
    };
  };


/**
 * @param  {CardIntri[]} testInfos
 * @param  {ITestFunction} zaTest
 */
const turntable_part_tests = async (testInfos, zaTest) => {
  const
    /** @type {HTMLElement} */
    $turntable = document.querySelector(turntableID),
    /** @type {HTMLElement} */
    $turntableOff = $turntable.querySelector(turntableCloseSelector);


  if (!testInfos || !Array.isArray(testInfos || testInfos.length == 0)) {
    console.warn("Missing required info to run test(s)");
    return;
  }

  if (!$turntable || !$turntableOff) {
    console.warn("Missing required $elements to run test(s)");
    return;
  }

  $turntable.hidePopover();

  try {
    await zaTest('Should handle normal conditions', async (z) => {
      let swearBhvRslts = [], swearUIRslts = [], swearExplntns = [];
      const
        impMeta = await getImport(),
        /** @type {HTMLButtonElement} */
        $nxtBtn = document.querySelector(impMeta.freshModule.nextBtn),
        /** @type {HTMLButtonElement} */
        $prvBtn = document.querySelector(impMeta.freshModule.prevBtn);


      swearUIRslts.push(document.querySelectorAll(`${turntableID}:popover-open`).length);
      impMeta.freshModule.loadTurntable(testInfos[0]);
      await fx.waaitt(700);
      swearBhvRslts.push(impMeta.freshModule.cursor);
      swearUIRslts.push(
        document.querySelectorAll(`${turntableID}:popover-open [data-spot="0"][data-oglo="15"]`).length
      );
      $nxtBtn.click();
      await fx.waaitt(100);
      swearBhvRslts.push(impMeta.freshModule.cursor);
      swearUIRslts.push(
        document.querySelectorAll(`${turntableID}:popover-open [data-spot="1"][data-oglo="5"]`).length
      );
      $prvBtn.click();
      await fx.wait(100);
      swearBhvRslts.push(impMeta.freshModule.cursor);
      swearUIRslts.push(
        document.querySelectorAll(`${turntableID}:popover-open [data-spot="0"][data-oglo="15"]`).length
      );
      $turntableOff.click();
      await fx.waaitt(700);
      swearUIRslts.push(document.querySelectorAll(`${turntableID}:popover-open`).length);
      swearExplntns.push(td.explain(impMeta.moduleLogger.devlog));

      td.reset();
      impMeta.freshModule = null;
      impMeta.moduleLogger = null;


      z.same(swearExplntns[0].callCount, 5, "log expected number of times");
      z.same(swearBhvRslts.toString(), '0,15,1,5,0,15', "performed expected behavior when loading cards");
      z.same(swearUIRslts.toString(), '0,1,1,1,0', "showed expected content in DOM");
    }); // May need to set timeout in ms specificaly like { timeout: 6000 }
  } catch (t1E) {
    console.error(t1E);
  }


  try {
    await zaTest('Should handle edges', async (z) => {
      let swearBhvRslts = [], swearUIRslts = [], swearExplntns = [];
      const
        impMeta = await getImport(),
        /** @type {HTMLButtonElement} */
        $nxtBtn = document.querySelector(impMeta.freshModule.nextBtn),
        /** @type {HTMLButtonElement} */
        $prvBtn = document.querySelector(impMeta.freshModule.prevBtn);


      swearUIRslts.push(document.querySelectorAll(`${turntableID}:popover-open`).length);
      impMeta.freshModule.loadTurntable(testInfos[0]);
      await fx.waaitt(700);
      swearBhvRslts.push([$prvBtn.disabled, $nxtBtn.disabled]);
      swearUIRslts.push(
        document.querySelectorAll(`${turntableID}:popover-open [data-spot="0"][data-oglo="15"]`).length
      );
      $turntableOff.click();
      await fx.waaitt(700);
      swearUIRslts.push(document.querySelectorAll(`${turntableID}:popover-open`).length);
      impMeta.freshModule.loadTurntable(testInfos[testInfos.length - 1]);
      await fx.waaitt(700);
      swearBhvRslts.push([$prvBtn.disabled, $nxtBtn.disabled]);
      swearUIRslts.push(
        document.querySelectorAll(`${turntableID}:popover-open [data-spot="13"][data-oglo="39"]`).length
      );
      $turntableOff.click();
      await fx.wait(700);
      swearUIRslts.push(document.querySelectorAll(`${turntableID}:popover-open`).length);
      swearExplntns.push(td.explain(impMeta.moduleLogger.devlog));

      td.reset();
      impMeta.freshModule = null;
      impMeta.moduleLogger = null;


      z.same(swearExplntns[0].callCount, 6, "log expected number of times");
      z.same(swearBhvRslts.toString(), 'true,false,false,true', "performed expected behavior at edges");
      z.same(swearUIRslts.toString(), '0,1,0,1,0', "showed expected DOM content");
    }); // May need to set timeout in ms specificaly like { timeout: 6000 }
  } catch (t2E) {
    console.error(t2E);
  }

  if ($turntable.matches(':popover-open')) { $turntable.hidePopover(); }
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

    await turntable_part_tests(routineInfos, zaHarness.test);
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
