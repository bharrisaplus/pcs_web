/**
 * @import { Part, PCSEvent } from 'pcs:types'
 */

/* This files imports should be specified as part of the importmap in subject.page.pug */
import { default as _tg } from './clones/_glods.clone.mjs';
import { default as getRibbon } from 'ribbon_part';


let ribbonBehavior;
const
  /** @type {HTMLElement} */
  $shell = document.querySelector(`#${_tg.appID}`),
  ribbonID = '#ribbon',
  /** @type {HTMLElement} */
  $ribbon = document.querySelector(ribbonID);


ribbonBehavior = getRibbon(ribbonID);

document.addEventListener('DOMContentLoaded', () => {
  $shell.addEventListener(_tg.notices.blend, (/** @type {PCSEvent} */ _pcsevt) => {
    if (_pcsevt.detail.$dispatcher !== $ribbon.querySelector(ribbonBehavior.mingleBtn)) { return; }

    console.debug("doing blend");
  });


  $shell.addEventListener(_tg.notices.chop, (/** @type {PCSEvent} */ _pcsevt) => {
    if (_pcsevt.detail.$dispatcher !== $ribbon.querySelector(ribbonBehavior.copyBtn)) { return; }

    console.debug("doing chop");
  });


  $shell.addEventListener(_tg.notices.trace, (/** @type {PCSEvent} */ _pcsevt) => {
    if (_pcsevt.detail.$dispatcher !== $ribbon.querySelector(ribbonBehavior.downloadBtn)) { return; }

    console.debug("doing trace");
  });


  $shell.addEventListener(_tg.notices.splash, (/** @type {PCSEvent} */ _pcsevt) => {
    if (_pcsevt.detail.$dispatcher !== $ribbon.querySelector(ribbonBehavior.dyeInput)) { return; }

    console.debug("doing splash");
  });


  $shell.addEventListener(_tg.notices.fresh, (/** @type {PCSEvent} */ _pcsevt) => {
    if (_pcsevt.detail.$dispatcher !== $ribbon.querySelector(ribbonBehavior.clearBtn)) { return; }

    console.debug("doing refresh");
  });


  if (
    window.frameElement &&
    window.parent.document.body.querySelectorAll(`${ribbonID}-panel`).length == 1
  ) {
    window.addEventListener('message', (_msgEvt) => {
      if (_msgEvt.data.type == 'subject:test') {
        console.debug("run test");
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