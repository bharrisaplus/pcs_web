import { default as fx } from 'storey:fixtures';

let
  loadedDesk = false,
  runningTest = false,
  /** @type {HTMLElement} */
  $overlay,
  /** @type {HTMLButtonElement} */
  $deskShow,
  /** @type {HTMLButtonElement} */
  $deskHide,
  /** @type {HTMLButtonElement} */
  $deskLoad,
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
    $deskHide.disabled = false;
    $deskShow.disabled = false;
    $deskLoad.disabled = false;
    $deska11y.disabled = false;

    $overlay.classList.remove('lift');
    console.clear();
    console.info(window.frames[0].__tap__);

    window.__coverage__ = window.frames[0].__coverage__;

    fx.covRoutine();
  } else { return; }
});


document.addEventListener('DOMContentLoaded', () => {
  $deskShow = document.querySelector('#showit');
  $deskHide = document.querySelector('#hideit');
  $deskLoad = document.querySelector('#loadit');
  $deskRun = document.querySelector('#runtest');
  $deska11y = document.querySelector('#a11ycheck');
  $overlay = document.querySelector('#test-curtain');

  $deskHide.addEventListener('click', (_clickEvt) => {
    if (!loadedDesk || runningTest) { return; }
    if (_clickEvt.target != $deskHide) { return; }

    $deskHide.disabled = true;

    window.frames[0].focus();
    window.frames[0].postMessage({ type: 'desk:hide' });
    window.setTimeout(() => {
      $deskHide.disabled = false;
    }, 1000);
  });

  $deskShow.addEventListener('click', (_clickEvt) => {
    if (!loadedDesk || runningTest) { return; }
    if (_clickEvt.target != $deskShow) { return; }

    $deskShow.disabled = true;

    window.frames[0].focus();
    window.frames[0].postMessage({ type: 'desk:show' });
    window.setTimeout(() => {
      $deskShow.disabled = false;
    }, 1000);
  });

  $deskLoad.addEventListener('click', (_clickEvt) => {
    if (!loadedDesk || runningTest) { return; }
    if (_clickEvt.target != $deskLoad) { return; }

    $deskLoad.disabled = true;

    window.frames[0].focus();
    window.frames[0].postMessage({ type: 'desk:load' });
    window.setTimeout(() => {
      $deskLoad.disabled = false;
    }, 1000);
  });

  $deskRun.addEventListener('click', (_clickEvt) => {
    if (!loadedDesk || runningTest) { return; }
    if (_clickEvt.target != $deskRun) { return; }

    runningTest = true;
    $deskRun.disabled = true;
    $deskHide.disabled = true;
    $deskShow.disabled = true;
    $deskLoad.disabled = true;
    $deska11y.disabled = true;

    $overlay.classList.add('lift');
    window.frames[0].focus();
    window.frames[0].postMessage({ type: 'desk:test' });
  });

  $deska11y.addEventListener('click', (_clickEvt) => {
    if (_clickEvt.target != $deska11y) { return; }
    if (!loadedDesk) { return; }

    $deska11y.disabled = true;

    window.frames[0].focus();
    window.frames[0].postMessage({ type: 'desk:a11y' });
    window.setTimeout(() => {
      $deska11y.disabled = false;
    }, 1250);
  });
});
