
import { default as fx } from 'storey:fixtures';


let
  loadedDesk = false,
  runningTest = false;
const
  $deskPrnt = document.createElement('button'),
  $deskRun = document.createElement('button'),
  $deska11y = document.createElement('button'),
  /** @type {HTMLElement} */
  $overlay = document.querySelector('#test-curtain');


$deskPrnt.setAttribute('id', 'sprint');
$deskRun.setAttribute('id', 'runtest');
$deska11y.setAttribute('id', 'a11ycheck');

window.addEventListener('message', (_msgEvt) => {
  if (_msgEvt.data.type == 'loaded') {
    if (loadedDesk) { return; }

    loadedDesk = true;
    $deskPrnt.textContent = "Print order";
    $deskRun.textContent = "Run Test";
    $deska11y.textContent = "Check a11y";
    document.querySelector('#ctrl-band')?.appendChild($deskPrnt);
    document.querySelector('#ctrl-band')?.appendChild($deskRun);
    document.querySelector('#ctrl-band')?.appendChild($deska11y);
    document.querySelector('#ctrl-band')?.classList.remove('load-curtain');
    window.printTestGlobals = function () { window.frames[0].postMessage({ type: 'print:globals'}); };
  } else if (_msgEvt.data.type == 'finished') {
    if (!runningTest) { return; }

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
