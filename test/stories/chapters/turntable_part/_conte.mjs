import { default as fx } from 'storey:fixtures';

let
  loadedDesk = false,
  runningTest = false;
const
  $deskShow = document.createElement('button'),
  $deskHide = document.createElement('button'),
  $deskLoad = document.createElement('button'),
  $deskRun = document.createElement('button'),
  $deska11y = document.createElement('button'),
  /** @type {HTMLElement} */
  $overlay = document.querySelector('#test-overlay');


$deskShow.setAttribute('id', 'show');
$deskHide.setAttribute('id', 'hide');
$deskLoad.setAttribute('id', 'loadone');
$deskRun.setAttribute('id', 'runtest');
$deska11y.setAttribute('id', 'a11ycheck');

window.addEventListener('message', (_msgEvt) => {
  if (_msgEvt.data.type == 'loaded') {
    if (loadedDesk) { return; }

    loadedDesk = true;
    $deskShow.textContent = "Show";
    $deskHide.textContent = "Hide";
    $deskLoad.textContent = "Load Cards";
    $deskRun.textContent = "Run Test";
    $deska11y.textContent = "Check a11y";
    document.querySelector('#ctrl-band')?.appendChild($deskShow);
    document.querySelector('#ctrl-band')?.appendChild($deskHide);
    document.querySelector('#ctrl-band')?.appendChild($deskLoad);
    document.querySelector('#ctrl-band')?.appendChild($deskRun);
    document.querySelector('#ctrl-band')?.appendChild($deska11y);
    document.querySelector('#ctrl-band')?.classList.remove('load-curtain');
    window.printTestGlobals = function () { window.frames[0].postMessage({ type: 'print:globals'}); };
  } else if (_msgEvt.data.type == 'finished') {
    if (!runningTest) { return; }

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
  $deskHide.addEventListener('click', (_clickEvt) => {
    if (_clickEvt.target != $deskHide) { return; }
    if (!loadedDesk) { return; }

    $deskHide.disabled = true;

    window.frames[0].focus();
    window.frames[0].postMessage({ type: 'desk:hide' });
    window.setTimeout(() => {
      $deskHide.disabled = false;
    }, 1000);
  });

  $deskShow.addEventListener('click', (_clickEvt) => {
    if (_clickEvt.target != $deskShow) { return; }
    if (!loadedDesk) { return; }

    $deskShow.disabled = true;

    window.frames[0].focus();
    window.frames[0].postMessage({ type: 'desk:show' });
    window.setTimeout(() => {
      $deskShow.disabled = false;
    }, 1000);
  });

  $deskLoad.addEventListener('click', (_clickEvt) => {
    if (_clickEvt.target != $deskLoad) { return; }
    if (!loadedDesk) { return; }

    $deskLoad.disabled = true;

    window.frames[0].focus();
    window.frames[0].postMessage({ type: 'desk:load' });
    window.setTimeout(() => {
      $deskLoad.disabled = false;
    }, 1000);
  });

  $deskRun.addEventListener('click', (_clickEvt) => {
    if (_clickEvt.target != $deskRun) { return; }
    if (!loadedDesk) { return; }

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
