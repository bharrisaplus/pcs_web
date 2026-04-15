/**
 * @import { CSSelector, Hand, Part } from 'pcs:types'
 */

/* This files imports should be specified as part of the importmap in subject.page.pug */
import { hold as zaHold, test as zaTest, report as zaReport, createTAPReporter } from 'zora';
import { default as td } from 'testdouble';


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


const turntable_part_tests = async () => {
  const
    /** @type {HTMLElement} */
    $ribbon = document.querySelector(ribbonID);


  if (!$ribbon) {
    console.warn("Missing required $elements to run test(s)");
    return;
  }


  try {
    await zaTest('Should copy to clipboard', async (z) => {
      let swearBhvRslts = [], swearUIRslts = [], swearExplnts = [];
      const
        swearTxt = "Totheclipboard\nAndanother",
        impMeta = await getImport();


      td.when(impMeta.moduleExporter.exportText(swearTxt)).thenResolve(true);

      swearBhvRslts.push(impMeta.freshModule.isBusy);
      swearUIRslts.push(document.querySelectorAll(impMeta.freshModule.dyeInput).length);
      swearUIRslts.push(document.querySelectorAll(impMeta.freshModule.clearBtn).length);
      swearUIRslts.push(document.querySelectorAll(impMeta.freshModule.copyBtn).length);
      swearUIRslts.push(document.querySelectorAll(impMeta.freshModule.mingleBtn).length);
      swearUIRslts.push(document.querySelectorAll(impMeta.freshModule.downloadBtn).length);
      swearExplnts.push(td.explain(impMeta.moduleExporter.exportText));

      td.reset();
      impMeta.freshModule = null;
      impMeta.moduleExporter = null;


      z.same(swearExplnts[0].callCount, 0, "Make expected calls");
      z.notOk(swearBhvRslts[0]);
      z.same(swearUIRslts.toString(), "1,1,1,1,1", "All elements present");
    }); // May need to set timeout in ms specificaly like { timeout: 6000 }
  } catch (t2E) {
    console.error(t2E);
  }
};


const test_routine = async () => {
  /** @type {string[]} */
  let zaTapLines = [];
  const
    zaTapReporter = createTAPReporter({
      log: (/** @type {string} */ zaTapLogLine) => { zaTapLines.push(zaTapLogLine); },
      serialize: (/** @type {any} */ zaTapVal) => { return JSON.stringify(zaTapVal); },
    });


  try {
    window.__stampt__ = Date.now();

    await turntable_part_tests();
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
