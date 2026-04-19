
import { default as fx } from 'storey:fixtures';


let
  loadedDesk = false,
  runningTest = false,
  /** @type {HTMLElement} */
  $overlay,
  /** @type {HTMLButtonElement} */
  $deskPrnt,
  /** @type {HTMLButtonElement} */
  $deskRun,
  /** @type {HTMLButtonElement} */
  $deska11y;


window.addEventListener('message', (_msgEvt) => {
  if (_msgEvt.data.type == 'loaded') {
    if (loadedDesk) { return; }

    loadedDesk = true;

    document.querySelector('#ctrl-band')?.classList.remove('load-curtain');

    globalThis.printTestGlobals = function () { window.frames[0].postMessage({ type: 'print:globals'}); };
  } else if (_msgEvt.data.type == 'finished') {
    if (!runningTest || !loadedDesk) { return; }

    runningTest = false;
    $deskPrnt.disabled = false;
    $deskRun.disabled = false;
    $deska11y.disabled = false;

    $overlay.classList.remove('lift');
    console.clear();
    console.info(window.frames[0].__tap__);

    window.__coverage__ = window.frames[0].__coverage__;

    fx.covRoutine();
  } else { return; }
});


document.addEventListener('DOMContentLoaded', () => {
  $deskPrnt = document.querySelector('#sprint');
  $deskRun = document.querySelector('#runtest');
  $deska11y = document.querySelector('#a11ycheck');
  $overlay = document.querySelector('#test-curtain');

  $deskPrnt.addEventListener('click', (_clickEvt) => {
    if (!loadedDesk || runningTest || _clickEvt.target != $deskPrnt) { return; }

    $deskPrnt.disabled = true;

    window.frames[0].focus();
    window.frames[0].postMessage({ type: 'desk:print' });
    window.setTimeout(() => {
      $deskPrnt.disabled = false;
    }, 1250);
  });

  $deskRun.addEventListener('click', (_clickEvt) => {
    if (!loadedDesk || runningTest || _clickEvt.target != $deskRun) { return; }

    runningTest = true;
    $deskPrnt.disabled = true;
    $deskRun.disabled = true;
    $deska11y.disabled = true;

    $overlay.classList.add('lift');
    window.frames[0].focus();
    window.frames[0].postMessage({ type: 'desk:test' });
  });

  $deska11y.addEventListener('click', (_clickEvt) => {
    if (!loadedDesk || runningTest || _clickEvt.target != $deska11y) { return; }

    $deska11y.disabled = true;

    window.frames[0].focus();
    window.frames[0].postMessage({ type: 'desk:a11y' });
    window.setTimeout(() => {
      $deska11y.disabled = false;
    }, 1250);
  });
});
