/**
 * @import {CSSelector, PCSEvent, CardIntri, Part} from 'pcs:types'
 */

/* This files imports should be specified as part of the importmap in desk.page.pug */
import { default as _tg } from './clones/_glods.clone.mjs';
import { default as getTableau } from 'tableau_part';
import { default as tableauTests } from './genga.mjs';


let
  listenController = new AbortController(),
  /** @type {Part.Tableau} */
  tableauBehavior,
  /** @type {HTMLBodyElement} */
  $shell,
  /** @type {HTMLElement} */
  $tableau;
const
  tableauID = '#tableau',
  /** @type {CSSelector} */
  tableauItemSelector = '.playing-card';


const handleTableauNeedle = (/** @type {PCSEvent} */ _pcsevt) => {
  const msgString = `
    id: ${_pcsevt.detail.$dispatcher.getAttribute('id')}
    data-oid: ${_pcsevt.detail.$dispatcher.getAttribute('data-oid')}
    aria-description: ${_pcsevt.detail.$dispatcher.getAttribute('aria-description')}
  `;

  console.log("From tableau\n" + msgString);
};


/** @returns {CardIntri[]} */
const getTestCards = (/** @type {number[]} */ cardIDs) => {
  return cardIDs.map((_itm, _idx) => {
    const $item = $tableau.querySelectorAll(`${tableauID} ${tableauItemSelector}`)[_idx];

    return {
      oglo: _itm,
      spot: _idx,
      title: `${_tg.c_TitlePrefix} ${_idx + 1}:...`,
      desc: `${_tg.c_DescPrefix} ${_idx + 1}`,
      symbolRef: `#${$item?.getAttribute('id').split("card-")[1] || ''}`
    };
  });
};


document.addEventListener('DOMContentLoaded', () => {
  $shell = document.querySelector(`#${_tg.appID}`);
  $tableau = $shell.querySelector(tableauID);
  tableauBehavior = getTableau(tableauID);

  $shell.addEventListener(_tg.notices.needle, handleTableauNeedle, { signal: listenController.signal });

  $tableau.setAttribute('style', '');
  $tableau.classList.remove('hide-before-load');


  if (
    window.frameElement &&
    window.parent.document.body.querySelectorAll('#e-panel').length == 1
  ) {
    window.addEventListener('message', (_msgEvt) => {
      if (_msgEvt.data.type == 'print:globals') {
        console.debug(_tg);
      } else if (_msgEvt.data.type == 'desk:print') {
        console.debug(tableauBehavior.currentOrder);
      } else if (_msgEvt.data.type == 'desk:test') {
        let testCards = getTestCards(tableauBehavior.currentOrder);


        if (testCards.some( (crd) => !crd.symbolRef )) {
          console.warn("Some items are missing an id")
          return;
        }

        listenController.abort();
        tableauTests.go(Array.from(testCards)).then(() => {
          window.parent.postMessage({type: 'finished'});

          listenController = new AbortController();

          tableauBehavior.updateOrder(testCards);
          $shell.addEventListener(
            _tg.notices.needle, handleTableauNeedle, { signal: listenController.signal }
          );
        }, (rejRsn) => {
          window.parent.postMessage({type: 'finished'});

          listenController = new AbortController();

          $shell.addEventListener(
            _tg.notices.needle, handleTableauNeedle, { signal: listenController.signal }
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
      let result = false;
      const testCards = getTestCards(tableauBehavior.currentOrder);

      if (testCards.some( (crd) => !crd.symbolRef )) {
        console.warn("Some items are missing an id");
        return result;
      }

      try {
        listenController.abort();
        await tableauTests.go(testCards);
        result = true;
      } catch (rErr) {
        console.error(rErr);
        result = false;
      }

      return result;
    };
  }
});