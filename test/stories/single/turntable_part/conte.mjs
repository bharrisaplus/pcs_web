/** @type {HTMLElement} */
const turntableSubject = document.querySelector('#turntable');

document.addEventListener('DOMContentLoaded', () => {
  window.addEventListener('message', (_msgEvt) => {
    if (_msgEvt.data.type == 'subject:show') {
      turntableSubject.showPopover();
    } else if (_msgEvt.data.type == 'subject:hide') {
      turntableSubject.hidePopover();
    } else {
      return;
    }
  });

  window.parent.postMessage({type: 'loaded'}, '*');
});
