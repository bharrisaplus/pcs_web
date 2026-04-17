/**
 * @import { PCSEvent, CardIntri, CSSelector, Part } from 'pcs:types'
 * @import { ITestFunction } from 'zora';
 */

/* This files imports should be specified as part of the importmap in desk.page.pug */
import { hold as zaHold, createHarness, createTAPReporter } from 'zora';
import { default as td } from 'testdouble';

import { default as _tg } from './clones/_glods.clone.mjs';
import { default as fx } from 'storey:fixtures';


const
  /** @type {CSSelector} */
  tableauID = '#tableau',
  /** @type {CSSelector} */
  tableauItemSelector = '.playing-card',

  modulePaths = { // see importmap in desk.page.pug
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
    await zaTest('Should load correctly', async (z) => {
      let swearBhvRslts = [], swearUIRslts = [];
      const impMeta = await getImport();


      swearBhvRslts.push(impMeta.freshModule.currentOrder.length);
      swearUIRslts.push(document.querySelectorAll(`${tableauID} ${tableauItemSelector}`).length);

      td.reset();
      impMeta.freshModule = null;


      z.same(swearBhvRslts[0], swearUIRslts[0], "correct number of $elements and list items");
    }); // May need to set timeout in ms specificaly like { timeout: 6000 }
  } catch (t1E) {
    console.error(t1E);
  }


  try {
    await zaTest('Should handle click', async (z) => {
      let
        swearUIRslts = [],
        swearBhvRslts = {
          /** @type {Array<number[]>} */
          orderChks: [],
          /** @type {string[]} */
          eventChks: [],
          /** @type {string[]} */
          dispatcherChks: []
        };
      const
        pickIdx = Math.floor(Math.random() * _tg.c_Max),
        abCntrllr = new AbortController(),
        imagineOrder = Array.from({ length: _tg.c_Max }, (_, _idx) => { return _idx }),
        impMeta = await getImport(),
        /** @type {HTMLBodyElement} */
        $testshell = document.querySelector(`#${_tg.appID}`),
        /** @type {HTMLLIElement[]} */
        $items = Array.from(document.querySelectorAll(`${tableauID} ${tableauItemSelector}`));


      $testshell.addEventListener(_tg.notices.needle, (/** @type {PCSEvent} */ _pcsevt) => {
        swearBhvRslts.eventChks.push(_tg.notices.needle);
        swearBhvRslts.dispatcherChks.push(_pcsevt.detail?.$dispatcher?.dataset.oid);
      }, { signal: abCntrllr.signal });

      swearBhvRslts.orderChks.push(impMeta.freshModule.currentOrder);
      swearUIRslts.push(document.querySelectorAll(`${tableauID} ${tableauItemSelector}`).length);

      $items[pickIdx]?.click();
      await fx.waaitt(100);


      td.reset();
      impMeta.freshModule = null;
      abCntrllr.abort();


      z.same(swearBhvRslts.eventChks.toString(), "needle", "events fired as expected");
      z.same(swearBhvRslts.dispatcherChks.toString(), testInfos[pickIdx].oglo.toString(),
        "events fired expected $elements"
      );
      z.same(swearBhvRslts.orderChks[0].toString(), imagineOrder.toString(), "item order is correct");
      z.same(swearUIRslts[0], _tg.c_Max, "number of $elements is correct");
    }); // May need to set timeout in ms specificaly like { timeout: 6000 }
  } catch (t2E) {
    console.error(t2E);
  }


  await zaTest("Should handle update", async (z) => {
    let
      /** @type {HTMLElement[]} */
      $items,
      /** @type {Array<string[]>} */
      swearUIRslts = [[], []],
      swearBhvRslts = {
        /** @type {Array<number[]>} */
        orderChks: [],
        /** @type {string[]} */
        eventChks: [],
        /** @type {string[]} */
        dispatcherChks: []
      };
    const
      swearPicks = [Math.floor(Math.random() * _tg.c_Max), Math.floor(Math.random() * _tg.c_Max)],
      swearOGOIDs = testInfos.map((_card) => { return _card.oglo }),
      swearOG$Order = testInfos.map((_card) => { return `card-${_card.symbolRef.split("#")[1]}` }),
      swearMixCards = testInfos.filter(
        (_, _idx) => { return _idx % 2 == 0 }
      ).concat(testInfos.filter(
        (_, _idx) => {return _idx % 2 == 1 }
      )),

      swearMixOIDs = swearMixCards.map((_card) => { return _card.oglo }),
      swearMix$Order = swearMixCards.map((_card) => { return `card-${_card.symbolRef.split("#")[1]}` }),

      abCntrllr = new AbortController(),
      impMeta = await getImport(),
      /** @type {HTMLBodyElement} */
      $testshell = document.querySelector(`#${_tg.appID}`);


    $testshell.addEventListener(_tg.notices.needle, (/** @type {PCSEvent} */ _pcsevt) => {
      swearBhvRslts.eventChks.push(_tg.notices.needle);
      swearBhvRslts.dispatcherChks.push(_pcsevt.detail?.$dispatcher?.dataset.oid);
    }, { signal: abCntrllr.signal });

    $items = Array.from(document.querySelectorAll(`${tableauID} ${tableauItemSelector}`));

    swearBhvRslts.orderChks.push(impMeta.freshModule.currentOrder);
    $items.forEach(($item) => { swearUIRslts[0].push($item.getAttribute('id')); });

    $items[swearPicks[0]]?.click();
    await fx.waaitt(100);
    impMeta.freshModule.updateOrder(swearMixCards);
    await fx.waaitt(100);
    $items[swearPicks[1]]?.click();

    $items = Array.from(document.querySelectorAll(`${tableauID} ${tableauItemSelector}`));

    swearBhvRslts.orderChks.push(impMeta.freshModule.currentOrder);
    $items.forEach(($item) => { swearUIRslts[1].push($item.getAttribute('id')); });

    td.reset();
    impMeta.freshModule = null;
    abCntrllr.abort();


    z.same(swearBhvRslts.orderChks[0].toString(), swearOGOIDs.toString(), "item order before is correct");
    z.same(swearUIRslts[0].toString(), swearOG$Order.toString(), "$element order before is correct");
    z.same(swearBhvRslts.eventChks.toString(), "needle,needle", "events fired as expected");
    z.same(
      swearBhvRslts.dispatcherChks.toString(), `${swearOGOIDs[swearPicks[0]]},${swearMixOIDs[swearPicks[1]]}`,
      "events fired expected $elements"
    );
    z.same(swearBhvRslts.orderChks[1].toString(), swearMixOIDs.toString(), "item order after is correct");
    z.same(swearUIRslts[1].toString(), swearMix$Order.toString(), "$element order after is correct");
  });
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
