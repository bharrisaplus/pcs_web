/**
 * @import { CardIntri, Part, PCSEvent } from 'pcs:types'
 */

/* This files imports should be specified as part of the importmap in subject.page.pug */
import { default as _tg } from './clones/_glods.clone.mjs';
import { default as getTurntable } from 'turntable_part';

import { default as fx } from './fixture.mjs';
import { default as turntableTests } from './storey.mjs';


let
  /** @type {Number} */
  testCardIdx = fx.sanitize_card_id(),
  /** @type {Part.Turntable} */
  turntableBehavior;
const
  /** @type {HTMLElement} */
  $shell = document.querySelector(`#${_tg.appID}`),
  turntableID = '#turntable',
  /** @type {HTMLElement} */
  $turntable = document.querySelector(turntableID),
  /** @type {SVGElement} */
  $testSheet = document.querySelector('#card-sheet'),
  /** @type {CardIntri[]} */
  testCards = [];


turntableBehavior = getTurntable(turntableID);

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
    if (
      _pcsevt.detail.msg == 'prv' &&
      _pcsevt.detail.$dispatcher === document.querySelector(turntableBehavior.prevBtn)
    ) {
      testCardIdx = fx.sanitize_card_id(turntableBehavior.cursor[0] - 1);
    } else if (
      _pcsevt.detail.msg == 'nxt' &&
      _pcsevt.detail.$dispatcher === document.querySelector(turntableBehavior.nextBtn)
    ) {
      testCardIdx = fx.sanitize_card_id(turntableBehavior.cursor[0] + 1);
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
        testCardIdx = fx.sanitize_card_id();
      } else if (_msgEvt.data.type == 'subject:load') {
        testCardIdx = fx.sanitize_card_id();

        if (turntableBehavior.isOpen) { $turntable.hidePopover(); }

        turntableBehavior.loadTurntable(testCards[testCardIdx]);
      } else if (_msgEvt.data.type == 'subject:hide') {
       if (turntableBehavior.isOpen) { $turntable.hidePopover(); }

        testCardIdx = fx.sanitize_card_id();
      } else if (_msgEvt.data.type == 'subject:test') {
        testCardIdx = fx.sanitize_card_id();
        
        if (turntableBehavior.isOpen) { $turntable.hidePopover(); }

        turntableTests.go(testCards).then(() => {
          turntableBehavior = getTurntable(turntableID);
          console.log("Test(s) finished");
        }, (rejRsn) => {
          turntableBehavior = getTurntable(turntableID);
          console.warn("Issue with running test(s)");
          console.error(rejRsn);
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
