/** @type {HTMLElement} */
const turntableSubject = document.querySelector('#turntable');

document.addEventListener('DOMContentLoaded', () => {
  window.addEventListener('message', (_msgEvt) => {
    if (_msgEvt.data.type != 'subjectToggle') { return; }

    turntableSubject.togglePopover();
  });

  window.parent.postMessage({type: 'loaded'}, '*');
});
