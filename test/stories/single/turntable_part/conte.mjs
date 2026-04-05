import { default as _tg } from '../_meta/_glods.mjs';


/** @type {HTMLElement} */
const
  turntableSubject = document.querySelector('#turntable'),
  logGlobals = () => { console.debug(_tg); }

document.addEventListener('DOMContentLoaded', () => {
  window.addEventListener('message', (_msgEvt) => {
    if (_msgEvt.data.type == 'print:globals') {
      logGlobals();
    } else if (_msgEvt.data.type == 'subject:show') {
      turntableSubject.showPopover();
    } else if (_msgEvt.data.type == 'subject:hide') {
      turntableSubject.hidePopover();
    } else {
      console.warn(`Received unknown msg type: ${_msgEvt.data.type}`);
    }
  });

  window.parent.postMessage({type: 'loaded'}, '*');
});
