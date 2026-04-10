/**
 * @import { CardIntri, Part } from '../../../../source/behavior/_meta/_typedefs.mjs'
 */

/* This files imports should be specified as part of the importmap in subject.page.pug */
import { default as td } from 'testdouble';
import { hold as zaHold, test as zaTest, report as zaReport, createTAPReporter } from 'zora';

import { default as _tg } from './clones/_glods.clone.mjs';
import { default as getTurntable } from 'turntable_part';


let
  /** @type {Number} */
  testCardIdx,
  /** @type {string[]} */
  zaTapLines = [];
const
  turntableID = '#turntable',
  /** @type {HTMLElement} */
  $turntable = document.querySelector('#turntable'),
  /** @type {Part.Turntable} */
  turntableBehavior = getTurntable(turntableID),
  logGlobals = () => { console.debug(_tg); },
  /** @type {CardIntri[]} */
  testCards = [],
  zaTapLogger = (/** @type {string} */ zaTapLogLine) => { zaTapLines.push(zaTapLogLine); },
  zaTapSerializer = (/** @type {any} */ zaTapVal) => { return JSON.stringify(zaTapVal); },
  zaTapReporter = createTAPReporter({ log: zaTapLogger, serialize: zaTapSerializer });


const getIdx = (cur = 0) => {
  let result;

  switch (true) {
    case (cur >= _tg.c_Max): result = _tg.c_Max - 1; break;
    case (cur < 0): result = 0; break;
    default: result = cur;
  }

  return result;
};


const run_tests = () => {
  zaTest('Should be ok', (z) => {
    let testResult, testExplntn;
    const mockObj = td.object(['hello']);

    td.when(mockObj.hello()).thenReturn('world');

    testResult = mockObj.hello();
    testExplntn = td.explain(mockObj.hello);

    z.same(testResult, 'world', "Should return world from hello");
    z.same(testExplntn.callCount, 1, "Should call hello once");
  });
};


testCardIdx = getIdx();
zaHold();
window.axe.configure({
  rules: [ // Just testing a popover so not all rules need apply
    {id: "landmark-one-main",  enabled: false },
    {id: "page-has-heading-one",  enabled: false }
  ]
});

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('#card-sheet defs symbol:not(:has(rect))')?.forEach(($cSymbol, cIdx) => {
    let symbolID = $cSymbol.getAttribute('id');

    testCards.push({
      oglo: Number.parseInt(symbolID.slice(-2), 10),
      spot: cIdx,
      title: `${_tg.c_TitlePrefix} ${cIdx + 1}:...`,
      desc: `${_tg.c_DescPrefix} ${cIdx + 1}`,
      symbolRef: `#${symbolID}`
    });
  });

  if (
    window.frameElement &&
    window.parent.document.body.querySelectorAll(`${turntableID}-panel`).length == 1
  ) {
    window.addEventListener('message', (_msgEvt) => {
      if (_msgEvt.data.type == 'print:globals') {
        logGlobals();
      } else if (_msgEvt.data.type == 'subject:show') {
        $turntable.hidePopover();
        $turntable.showPopover();
      } else if (_msgEvt.data.type == 'subject:load') {
        $turntable.hidePopover();
        turntableBehavior.loadTurntable(testCards[testCardIdx]);
      } else if (_msgEvt.data.type == 'subject:hide') {
        $turntable.hidePopover();
      } else if (_msgEvt.data.type == 'subject:test') {
        $turntable.hidePopover();
        run_tests();
        zaReport({ reporter: zaTapReporter }).then(() => {
          window.__tap__ = zaTapLines.join('\n');
          window.parent.postMessage({type: 'finished'});
          zaTapLines = [];
        }, (rejReason) => {
          console.warn("issue with zora reporter");
          console.debug(rejReason)
        });
      } else if (_msgEvt.data.type == 'subject:a11y') {
        window.axe.run().then((results) => {
          if (results.violations.length) {
            for (const a11yIssue of results.violations) {
              console.debug(a11yIssue);
            }
          }
        });
      } else {
        console.warn(`Received unknown msg type: ${_msgEvt.data.type}`);
      }
    });

    window.parent.postMessage({type: 'loaded'});
  }
});
