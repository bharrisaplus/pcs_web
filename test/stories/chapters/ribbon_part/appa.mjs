/**
 * @import { Part, PCSEvent } from 'pcs:types'
 */

/* This files imports should be specified as part of the importmap in desk.page.pug */
import { default as _tg } from './clones/_glods.clone.mjs';
import { default as getRibbon } from 'ribbon_part';
import { default as ribbonTests } from './genga.mjs';


let
  /** @type {Part.Ribbon} */
  ribbonBehavior,
  listenController = new AbortController();
const
  /** @type {HTMLElement} */
  $shell = document.querySelector(`#${_tg.appID}`),
  ribbonID = '#ribbon',
  /** @type {HTMLElement} */
  $ribbon = document.querySelector(ribbonID),

  setupListens = (/** @type {AbortSignal} */ listenSignal) => {
    $shell.addEventListener(_tg.notices.blend, (/** @type {PCSEvent} */ _pcsevt) => {
      if (_pcsevt.detail.$dispatcher !== $ribbon.querySelector(ribbonBehavior.mingleBtn)) { return; }

      console.debug("doing blend");
    }, { signal: listenSignal });


    $shell.addEventListener(_tg.notices.chop, (/** @type {PCSEvent} */ _pcsevt) => {
      if (_pcsevt.detail.$dispatcher !== $ribbon.querySelector(ribbonBehavior.copyBtn)) { return; }

      console.debug("doing chop");
    }, { signal: listenSignal });


    $shell.addEventListener(_tg.notices.trace, (/** @type {PCSEvent} */ _pcsevt) => {
      if (_pcsevt.detail.$dispatcher !== $ribbon.querySelector(ribbonBehavior.downloadBtn)) { return; }

      console.debug("doing trace");
    }, { signal: listenSignal });


    $shell.addEventListener(_tg.notices.splash, (/** @type {PCSEvent} */ _pcsevt) => {
      if (_pcsevt.detail.$dispatcher !== $ribbon.querySelector(ribbonBehavior.dyeInput)) { return; }

      console.debug("doing splash");
    }, { signal: listenSignal });


    $shell.addEventListener(_tg.notices.fresh, (/** @type {PCSEvent} */ _pcsevt) => {
      if (_pcsevt.detail.$dispatcher !== $ribbon.querySelector(ribbonBehavior.clearBtn)) { return; }

      console.debug("doing refresh");
    }, { signal: listenSignal });
  };


ribbonBehavior = getRibbon(ribbonID);

document.addEventListener('DOMContentLoaded', () => {
  if (
    window.frameElement &&
    window.parent.document.body.querySelectorAll(`${ribbonID}-panel`).length == 1
  ) {
    setupListens(listenController.signal);
    window.addEventListener('message', (_msgEvt) => {
      if (_msgEvt.data.type == 'desk:test') {
        listenController.abort();
        ribbonTests.go().then(() => {
          listenController = new AbortController();
          setupListens(listenController.signal);
        }, (rejRsn) => {
          console.warn("Issue with running test(s)");
          console.error(rejRsn);
          listenController = new AbortController();
          setupListens(listenController.signal);
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
  }
});