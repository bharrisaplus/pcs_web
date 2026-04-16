/**
 * @import {CSSelector, PCSEvent, CardIntri} from 'pcs:types'
 */

/* This files imports should be specified as part of the importmap in desk.page.pug */
import { default as _tg } from './clones/_glods.clone.mjs';
import { default as getTableau } from 'tableau_part';
import { default as tableauTests } from './genga.mjs';


let listenController = new AbortController();
const
  tableauID = '#tableau',
  /** @type {CSSelector} */
  tableauItemSelector = '.playing-card',
  /** @type {HTMLElement} */
  $shell = document.querySelector(`#${_tg.appID}`),
  /** @type {HTMLElement} */
  $tableau = $shell.querySelector(tableauID),
  tableauBehavior = getTableau(tableauID);


const handleTableauNeedle = (/** @type {PCSEvent} */ _pcsevt) => {
  const msgString = `
    id: ${_pcsevt.detail.$dispatcher.getAttribute('id')}
    data-oid: ${_pcsevt.detail.$dispatcher.getAttribute('data-oid')}
    aria-description: ${_pcsevt.detail.$dispatcher.getAttribute('aria-description')}
  `;

  console.log("From tableau\n" + msgString);
};


document.addEventListener('DOMContentLoaded', () => {
  $shell.addEventListener(_tg.notices.needle, handleTableauNeedle, { signal: listenController.signal });

  $tableau.setAttribute('style', '');
  $tableau.classList.remove('hide-before-load');


  if (
    window.frameElement &&
    window.parent.document.body.querySelectorAll(`${tableauID}-panel`).length == 1
  ) {
    window.addEventListener('message', (_msgEvt) => {
      if (_msgEvt.data.type == 'desk:print') {
        console.debug(tableauBehavior.currentOrder);
      } else if (_msgEvt.data.type == 'desk:test') {
        /** @type {CardIntri[]} */
        let testCards = tableauBehavior.currentOrder.map((_itm, _idx) => {
          const
            $item = $tableau.querySelectorAll(`${tableauID} ${tableauItemSelector}`)[_idx],
            itemID = $item?.querySelector(`svg use`)?.getAttribute('href') || '';

          return {
            oglo: _itm,
            spot: _idx,
            title: `${_tg.c_TitlePrefix} ${_idx + 1}:...`,
            desc: `${_tg.c_DescPrefix} ${_idx + 1}`,
            symbolRef: itemID
          };
        });


        if (testCards.some( (crd) => !crd.symbolRef )) {
          console.warn("Some items are missing an id")
          return;
        }

        tableauTests.go(testCards).then(() => {
          listenController.abort();

          listenController = new AbortController();

          $shell.addEventListener(
            _tg.notices.needle, handleTableauNeedle, { signal: listenController.signal }
          );
        }, () => {
          listenController.abort();

          listenController = new AbortController();

          $shell.addEventListener(
            _tg.notices.needle, handleTableauNeedle, { signal: listenController.signal }
          );
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