/**
 * @import { CardIntri, Part } from '../../../../source/behavior/_meta/_typedefs.mjs'
 */

/* This files imports should be specified as part of the importmap in subject.page.pug */
import { default as _tg } from './clones/_glods.clone.mjs';
import { default as getTurntable } from 'turntable_part';


const
  turntableID = '#turntable',
  /** @type {HTMLElement} */
  $turntable = document.querySelector('#turntable'),
  /** @type {Part.Turntable} */
  turntableBehavior = getTurntable(turntableID),
  logGlobals = () => { console.debug(_tg); },
  /** @type {CardIntri[]} */
  testCards = [];


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

  window.addEventListener('message', (_msgEvt) => {
    if (_msgEvt.data.type == 'print:globals') {
      logGlobals();
    } else if (_msgEvt.data.type == 'subject:show') {
      $turntable.showPopover();
    } else if (_msgEvt.data.type == 'subject:load') {
      $turntable.hidePopover();
      turntableBehavior.loadTurntable(testCards[0]);
    } else if (_msgEvt.data.type == 'subject:hide') {
      $turntable.hidePopover();
    } else {
      console.warn(`Received unknown msg type: ${_msgEvt.data.type}`);
    }
  });

  window.parent.postMessage({type: 'loaded'}, '*');
});
