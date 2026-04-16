
import { default as fx } from 'storey:fixtures';


let
  loadedSubject = false,
  runningTest = false;
const
  $subjPrnt = document.createElement('button'),
  $subjRun = document.createElement('button'),
  $subja11y = document.createElement('button'),
  /** @type {HTMLElement} */
  $overlay = document.querySelector('#test-overlay');


$subjPrnt.setAttribute('id', 'sprint');
$subjRun.setAttribute('id', 'runtest');
$subja11y.setAttribute('id', 'a11ycheck');

window.addEventListener('message', (_msgEvt) => {
  if (_msgEvt.data.type == 'loaded') {
    if (loadedSubject) { return; }

    loadedSubject = true;
    $subjPrnt.textContent = "Print order";
    $subjRun.textContent = "Run Test";
    $subja11y.textContent = "Check a11y";
    document.querySelector('#ctrl-band')?.appendChild($subjPrnt);
    document.querySelector('#ctrl-band')?.appendChild($subjRun);
    document.querySelector('#ctrl-band')?.appendChild($subja11y);
    document.querySelector('#ctrl-band')?.classList.remove('load-curtain');
    window.printTestGlobals = function () { window.frames[0].postMessage({ type: 'print:globals'}); };
  } else if (_msgEvt.data.type == 'finished') {
    if (!runningTest) { return; }

    runningTest = false;
    $subjPrnt.disabled = false;
    $subjRun.disabled = false;
    $subja11y.disabled = false;

    $overlay.classList.remove('lower');
    console.clear();
    console.info(window.frames[0].__tap__);
    window.__coverage__ = window.frames[0].__coverage__;
    fx.covRoutine();
  } else { return; }
});


document.addEventListener('DOMContentLoaded', () => {
  $subjPrnt.addEventListener('click', (_clickEvt) => {
    if (!loadedSubject || _clickEvt.target != $subjPrnt) { return; }

    $subjPrnt.disabled = true;

    window.frames[0].focus();
    window.frames[0].postMessage({ type: 'subject:print' });
    window.setTimeout(() => {
      $subjPrnt.disabled = false;
    }, 1250);
  });

  $subjRun.addEventListener('click', (_clickEvt) => {
    if (!loadedSubject || _clickEvt.target != $subjRun) { return; }

    runningTest = true;
    $subjPrnt.disabled = true;
    $subjRun.disabled = true;
    $subja11y.disabled = true;

    $overlay.classList.add('lower');
    window.frames[0].focus();
    window.frames[0].postMessage({ type: 'subject:test' });
  });

  $subja11y.addEventListener('click', (_clickEvt) => {
    if (!loadedSubject || _clickEvt.target != $subja11y) { return; }

    $subja11y.disabled = true;

    window.frames[0].focus();
    window.frames[0].postMessage({ type: 'subject:a11y' });
    window.setTimeout(() => {
      $subja11y.disabled = false;
    }, 1250);
  });
});
