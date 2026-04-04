
document.addEventListener('DOMContentLoaded', () => {
  window.parent.postMessage({type: 'loaded'}, '*');
});
