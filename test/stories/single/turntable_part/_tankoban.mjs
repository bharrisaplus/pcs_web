
let loadedSubject = false;

const
  /** @type {HTMLButtonElement} */
  $subjShow = document.createElement('button'),
  /** @type {HTMLButtonElement} */
  $subjHide = document.createElement('button');


$subjShow.setAttribute('id', 'show');
$subjHide.setAttribute('id', 'hide');

window.addEventListener('message', (_msgEvt) => {
  if (_msgEvt.data.type != 'loaded') { return; }
  if (loadedSubject) { return; }

  loadedSubject = true;
  $subjShow.textContent = "Show"
  $subjHide.textContent = "Hide"
  document.querySelector('#ctrl-band')?.appendChild($subjShow);
  document.querySelector('#ctrl-band')?.appendChild($subjHide);
  document.querySelector('#ctrl-band')?.classList.remove('load-curtain');
}, { once: true });


document.addEventListener('DOMContentLoaded', () => {
  $subjHide.addEventListener('click', (_clickEvt) => {
    if (_clickEvt.target != $subjHide) { return; }
    if (!loadedSubject) { return; }

    $subjHide.disabled = true;

    window.frames[0].focus();
    window.frames[0].postMessage({ type: 'subject:hide' }, '*');
    window.setTimeout(() => {
      $subjHide.disabled = false;
    }, 1000);
  });

  $subjShow.addEventListener('click', (_clickEvt) => {
    if (_clickEvt.target != $subjShow) { return; }
    if (!loadedSubject) { return; }

    $subjShow.disabled = true;

    window.frames[0].focus();
    window.frames[0].postMessage({ type: 'subject:show' }, '*');
    window.setTimeout(() => {
      $subjShow.disabled = false;
    }, 1000);
  });
});
