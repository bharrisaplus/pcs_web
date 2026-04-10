/**
 * @import { CardIntri, Part } from '../../../../source/behavior/_meta/_typedefs.mjs'
 */

/* This files imports should be specified as part of the importmap in subject.page.pug */
import { default as td } from 'testdouble';

import { default as _tg } from './clones/_glods.clone.mjs';
import { default as getTurntable } from 'turntable_part';

import { default as helper } from './fixture.mjs';

/** @type {Number} */
let testCardIdx;
const
  turntableID = '#turntable',
  /** @type {HTMLElement} */
  $turntable = document.querySelector(turntableID),
  /** @type {Part.Turntable} */
  turntableBehavior = getTurntable(turntableID),
  /** @type {CardIntri[]} */
  testCards = [];


const subjectTests = () => {
  helper.chk('Should be ok', (z) => {
    let testResult, testExplntn;
    const mockObj = td.object(['hello']);

    td.when(mockObj.hello()).thenReturn('world');

    testResult = mockObj.hello();
    testExplntn = td.explain(mockObj.hello);

    z.same(testResult, 'world', "Should return world from hello");
    z.same(testExplntn.callCount, 1, "Should call hello once");
  });
};


testCardIdx = helper.sanitize_card_id();

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
        console.debug(_tg);
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
        helper.run_tests(subjectTests);
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
