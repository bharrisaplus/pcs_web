
let loadedSubject = false;
/** @type {HTMLButtonElement} */
const $subjToggleBtn = document.createElement('button');


$subjToggleBtn.setAttribute('id', 'showhide');

window.addEventListener('message', (_msgEvt) => {
  if (_msgEvt.data.type != 'loaded') { return; }
  if (loadedSubject) { return; }

  loadedSubject = true;
  $subjToggleBtn.textContent = "Show/Hide Subject"
  document.querySelector('#turntable-panel')?.appendChild($subjToggleBtn);
}, { once: true });


document.addEventListener('DOMContentLoaded', () => {
  $subjToggleBtn.addEventListener('click', (_clickEvt) => {
    if (_clickEvt.target != $subjToggleBtn) { return; }
    if (!loadedSubject) { return; }

    $subjToggleBtn.disabled = true;

    window.frames[0].focus();
    window.frames[0].postMessage({ type: 'subjectToggle' }, '*');
    window.setTimeout(() => {
      $subjToggleBtn.disabled = false;
    }, 1000);
  });
});
