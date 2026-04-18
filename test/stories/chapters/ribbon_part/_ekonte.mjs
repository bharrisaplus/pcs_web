
import { default as fx } from 'storey:fixtures';


let
  loadedDesk = false,
  runningTest = false,
  /** @type {HTMLElement} */
  $overlay,
  /** @type {HTMLButtonElement} */
  $deskRun,
  /** @type {HTMLButtonElement} */
  $deska11y;

window.addEventListener('message', (_msgEvt) => {
  if (_msgEvt.data.type == 'loaded') {
    if (loadedDesk) { return; }

    document.querySelector('#ctrl-band')?.classList.remove('load-curtain');

    loadedDesk = true;
    window.printTestGlobals = function () { window.frames[0].postMessage({ type: 'print:globals'}); };
  } else if (_msgEvt.data.type == 'finished') {
    if (!runningTest || !loadedDesk) { return; }

    runningTest = false;
    $deskRun.disabled = false;
    $deska11y.disabled = false;

    console.clear();
    console.info(window.frames[0].__tap__);
    $overlay.classList.remove('lift');

    window.__coverage__ = window.frames[0].__coverage__;

    fx.covRoutine();
  } else {
    console.warn(`Unknown message type received: ${_msgEvt.data.type}`);
    return;
  }
});


document.addEventListener('DOMContentLoaded', () => {
  $deskRun = document.querySelector('#runtest');
  $deska11y = document.querySelector('#a11ycheck');
  $overlay = document.querySelector('#test-curtain');

  $deskRun.addEventListener('click', (_clickEvt) => {
    if (!loadedDesk || runningTest) { return; }
    if (_clickEvt.target != $deskRun) { return; }

    runningTest = true;
    $deskRun.disabled = true;
    $deska11y.disabled = true;

    $overlay.classList.add('lift');
    window.frames[0].focus();
    window.frames[0].postMessage({ type: 'desk:test' });
  });

  $deska11y.addEventListener('click', (_clickEvt) => {
    if (!loadedDesk || runningTest) { return; }
    if (_clickEvt.target != $deska11y) { return; }

    $deska11y.disabled = true;

    window.frames[0].focus();
    window.frames[0].postMessage({ type: 'desk:a11y' });
    window.setTimeout(() => {
      $deska11y.disabled = false;
    }, 1250);
  });
});
