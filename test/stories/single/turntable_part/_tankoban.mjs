
window.addEventListener('message', (_msgEvt) => {
  if (_msgEvt.data.type == 'loaded') {
    console.log("Loaded subject");
  }
});
