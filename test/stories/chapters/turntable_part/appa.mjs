/**
 * @import { CardIntri, Part, PCSEvent } from 'pcs:types'
 */

/* This files imports should be specified as part of the importmap in desk.page.pug */
import { default as _tg } from './clones/_glods.clone.mjs';
import { default as getTurntable } from 'turntable_part';
import { default as fx } from 'storey:fixtures';
import { default as turntableTests } from './genga.mjs';


let
  listenController = new AbortController(),
  /** @type {Part.Turntable} */
  turntableBehavior,
  /** @type {HTMLBodyElement} */
  $shell,
  /** @type {HTMLElement} */
  $turntable,
  /** @type {SVGElement} */
  $testSheet,
  /** @type {Number} */
  testCardIdx;

const
  turntableID = '#turntable',
  /** @type {CardIntri[]} */
  testCards = [];

const handleTurntableScratch = (/** @type {PCSEvent} */ _pcsevt) => {
  if (
    _pcsevt.detail.msg == 'prv' &&
    _pcsevt.detail.$dispatcher === document.querySelector(turntableBehavior.prevBtn)
  ) {
    testCardIdx = fx.i_capp(turntableBehavior.cursor[0] - 1, _tg.c_Max);
  } else if (
    _pcsevt.detail.msg == 'nxt' &&
    _pcsevt.detail.$dispatcher === document.querySelector(turntableBehavior.nextBtn)
  ) {
    testCardIdx = fx.i_capp(turntableBehavior.cursor[0] + 1, _tg.c_Max);
  }

  turntableBehavior.spinTurntable(testCards[testCardIdx || 0]);
};


document.addEventListener('DOMContentLoaded', () => {
  $shell = document.querySelector(`#${_tg.appID}`),
  $turntable = document.querySelector(turntableID),
  $testSheet = document.querySelector('#card-sheet')
  turntableBehavior = getTurntable(turntableID);

  $testSheet.querySelectorAll('defs symbol:not(:has(rect))')?.forEach(($cSymbol, cIdx) => {
    let symbolID = $cSymbol.getAttribute('id');

    testCards.push({
      oglo: cIdx,
      spot: cIdx,
      title: `${_tg.c_TitlePrefix} ${cIdx + 1}:...`,
      desc: `${_tg.c_DescPrefix} ${cIdx + 1}`,
      symbolRef: `#${symbolID}`
    });
  });

  $shell.addEventListener(_tg.notices.scratch, handleTurntableScratch, { signal: listenController.signal });


  if (
    window.frameElement &&
    window.parent.document.body.querySelectorAll('#e-panel').length == 1
  ) {
    window.addEventListener('message', (_msgEvt) => {
      if (_msgEvt.data.type == 'print:globals') {
        console.debug(_tg);
      } else if (_msgEvt.data.type == 'desk:show') {
        if (turntableBehavior.isOpen) { $turntable.hidePopover(); }

        testCardIdx = null;

        document.querySelector(`${turntableID} .turntable-pickup use`)?.setAttribute('href', _tg.pcs_cardRef);
        $turntable.showPopover();
      } else if (_msgEvt.data.type == 'desk:load') {
        if (turntableBehavior.isOpen) { $turntable.hidePopover(); }

        testCardIdx = Math.floor(Math.random() * (_tg.c_Max - 1));

        turntableBehavior.loadTurntable(testCards[testCardIdx]);
      } else if (_msgEvt.data.type == 'desk:hide') {
        if (turntableBehavior.isOpen) { $turntable.hidePopover(); }

        testCardIdx = null;
      } else if (_msgEvt.data.type == 'desk:test') {
        if (turntableBehavior.isOpen) { $turntable.hidePopover(); }
        listenController.abort();

        testCardIdx = null;

        turntableTests.go(testCards).then(() => {
          window.parent.postMessage({type: 'finished'});

          turntableBehavior = getTurntable(turntableID);
          listenController = new AbortController();

          document.querySelector(
            `${turntableID} .turntable-pickup use`
          )?.setAttribute('href', _tg.pcs_cardRef);
          $shell.addEventListener(
            _tg.notices.scratch, handleTurntableScratch, { signal: listenController.signal }
          );
        }, (rejRsn) => {
          window.parent.postMessage({type: 'finished'});

          turntableBehavior = getTurntable(turntableID);
          listenController = new AbortController();

          document.querySelector(
            `${turntableID} .turntable-pickup use`
          )?.setAttribute('href', _tg.pcs_cardRef);
          $shell.addEventListener(
            _tg.notices.scratch, handleTurntableScratch, { signal: listenController.signal }
          );

          console.warn("Issue with running test(s)");
          console.error(rejRsn);
        });
      } else if (_msgEvt.data.type == 'desk:a11y') {
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
  } else {
    globalThis.runTests = async () => {
      let result;

      try {
        listenController.abort();
        await turntableTests.go(testCards);
        result = true;
      } catch (rErr) {
        console.error(rErr);
        result = false;
      }

      return result;
    };
  }
});
