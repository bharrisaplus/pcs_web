
let
  loadedSubject = false,
  runningTest = false;
const
  /** @type {HTMLButtonElement} */
  $subjShow = document.createElement('button'),
  /** @type {HTMLButtonElement} */
  $subjHide = document.createElement('button'),
    /** @type {HTMLButtonElement} */
  $subjLoad = document.createElement('button'),
  /** @type {HTMLButtonElement} */
  $subjRun = document.createElement('button'),
  /** @type {HTMLElement} */
  $overlay = document.querySelector('#test-overlay');


$subjShow.setAttribute('id', 'show');
$subjHide.setAttribute('id', 'hide');
$subjLoad.setAttribute('id', 'loadone');
$subjRun.setAttribute('id', 'runtest');

window.addEventListener('message', (_msgEvt) => {
  if (_msgEvt.data.type == 'loaded') {
    if (loadedSubject) { return; }

    loadedSubject = true;
    $subjShow.textContent = "Show";
    $subjHide.textContent = "Hide";
    $subjLoad.textContent = "Load Cards";
    $subjRun.textContent = "Run Test";
    document.querySelector('#ctrl-band')?.appendChild($subjShow);
    document.querySelector('#ctrl-band')?.appendChild($subjHide);
    document.querySelector('#ctrl-band')?.appendChild($subjLoad);
    document.querySelector('#ctrl-band')?.appendChild($subjRun);
    document.querySelector('#ctrl-band')?.classList.remove('load-curtain');
    window.printTestGlobals = function () { window.frames[0].postMessage({ type: 'print:globals'}); };
  } else if (_msgEvt.data.type == 'finished') {
    if (!runningTest) { return; }

    $subjRun.disabled = false;
    $subjHide.disabled = false;
    $subjShow.disabled = false;
    $subjLoad.disabled = false;

    $overlay.classList.remove('lift');
  } else { return; }
});


document.addEventListener('DOMContentLoaded', () => {
  $subjHide.addEventListener('click', (_clickEvt) => {
    if (_clickEvt.target != $subjHide) { return; }
    if (!loadedSubject) { return; }

    $subjHide.disabled = true;

    window.frames[0].focus();
    window.frames[0].postMessage({ type: 'subject:hide' });
    window.setTimeout(() => {
      $subjHide.disabled = false;
    }, 1000);
  });

  $subjShow.addEventListener('click', (_clickEvt) => {
    if (_clickEvt.target != $subjShow) { return; }
    if (!loadedSubject) { return; }

    $subjShow.disabled = true;

    window.frames[0].focus();
    window.frames[0].postMessage({ type: 'subject:show' });
    window.setTimeout(() => {
      $subjShow.disabled = false;
    }, 1000);
  });

  $subjLoad.addEventListener('click', (_clickEvt) => {
    if (_clickEvt.target != $subjLoad) { return; }
    if (!loadedSubject) { return; }

    $subjLoad.disabled = true;

    window.frames[0].focus();
    window.frames[0].postMessage({ type: 'subject:load' });
    window.setTimeout(() => {
      $subjLoad.disabled = false;
    }, 1000);
  });

  $subjRun.addEventListener('click', (_clickEvt) => {
    if (_clickEvt.target != $subjRun) { return; }
    if (!loadedSubject) { return; }

    runningTest = true;
    $subjRun.disabled = true;
    $subjHide.disabled = true;
    $subjShow.disabled = true;
    $subjLoad.disabled = true;

    $overlay.classList.add('lift');
  });
});
