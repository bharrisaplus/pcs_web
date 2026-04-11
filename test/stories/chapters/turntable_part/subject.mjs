/**
 * @import { CardIntri, Part, PCSEvent } from '../../../../source/behavior/_meta/_typedefs.mjs'
 */

/* This files imports should be specified as part of the importmap in subject.page.pug */
import { default as td } from 'testdouble';

import { default as _tg } from './clones/_glods.clone.mjs';
import { default as getTurntable } from 'turntable_part';

import { default as helper } from './fixture.mjs';


/** @type {Number} */
let testCardIdx = helper.sanitize_card_id();
const
  /** @type {HTMLElement} */
  $shell = document.querySelector(`#${_tg.appID}`),
  turntableID = '#turntable',
  /** @type {HTMLElement} */
  $turntable = document.querySelector(turntableID),
  /** @type {Part.Turntable} */
  turntableBehavior = getTurntable(turntableID),
  /** @type {HTMLButtonElement} */
  $turntablePrv = document.querySelector(turntableBehavior.prevBtn),
  /** @type {HTMLButtonElement} */
  $turntableNxt = document.querySelector(turntableBehavior.nextBtn),
  /** @type {SVGElement} */
  $testSheet = document.querySelector('#card-sheet'),
  /** @type {CardIntri[]} */
  testCards = [];


const subjectTests = async () => {
  helper.zaTest('Should be ok', (z) => {
    let swearResult, swearExplntn;
    const mockObj = td.object(['hello']);

    td.when(mockObj.hello()).thenReturn('world');

    swearResult = mockObj.hello();
    swearExplntn = td.explain(mockObj.hello);

    z.same(swearResult, 'world', "Should return world from hello");
    z.same(swearExplntn.callCount, 1, "Should call hello once");
  });
};


document.addEventListener('DOMContentLoaded', () => {
  $testSheet.querySelectorAll('defs symbol:not(:has(rect))')?.forEach(($cSymbol, cIdx) => {
    let symbolID = $cSymbol.getAttribute('id');

    testCards.push({
      oglo: Number.parseInt(symbolID.slice(-2), 10),
      spot: cIdx,
      title: `${_tg.c_TitlePrefix} ${cIdx + 1}:...`,
      desc: `${_tg.c_DescPrefix} ${cIdx + 1}`,
      symbolRef: `#${symbolID}`
    });
  });

  $shell.addEventListener(_tg.notices.scratch, (/** @type {PCSEvent} */ _pcsevt) => {
    console.log("Spinning");

    if (_pcsevt.detail.msg == 'prv' && _pcsevt.detail.$dispatcher === $turntablePrv) {
      testCardIdx = helper.sanitize_card_id(turntableBehavior.cursor[0] - 1);
    } else if (_pcsevt.detail.msg == 'nxt' && _pcsevt.detail.$dispatcher == $turntableNxt) {
      testCardIdx = helper.sanitize_card_id(turntableBehavior.cursor[0] + 1);
    }

    turntableBehavior.spinTurntable(testCards[testCardIdx]);
  });


  if (
    window.frameElement &&
    window.parent.document.body.querySelectorAll(`${turntableID}-panel`).length == 1
  ) {
    window.addEventListener('message', (_msgEvt) => {
      if (_msgEvt.data.type == 'print:globals') {
        console.debug(_tg);
      } else if (_msgEvt.data.type == 'subject:show') {
        if (turntableBehavior.isOpen) { $turntable.hidePopover(); }

        $turntable.showPopover();
        testCardIdx = helper.sanitize_card_id();
      } else if (_msgEvt.data.type == 'subject:load') {
        testCardIdx = helper.sanitize_card_id();

        if (turntableBehavior.isOpen) { $turntable.hidePopover(); }

        turntableBehavior.loadTurntable(testCards[testCardIdx]);
      } else if (_msgEvt.data.type == 'subject:hide') {
       if (turntableBehavior.isOpen) { $turntable.hidePopover(); }

        testCardIdx = helper.sanitize_card_id();
      } else if (_msgEvt.data.type == 'subject:test') {
        testCardIdx = helper.sanitize_card_id();
        
        if (turntableBehavior.isOpen) { $turntable.hidePopover(); }
        
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
