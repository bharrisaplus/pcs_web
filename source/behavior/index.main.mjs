import appCustodian from './hands/misc.hand.mjs';
import buildAppScreen from './lattices/pcs.lattice.mjs';

const
  bootOverlay = '#pageload-curtain',
  bootOverlaySpinner = '.loading-spinny',
  cardView = '#tableau',
  cardOverlay = '#turntable',
  kickOffEventName = 'pcsStart',
  preloadDest = ".inline-svg-assets-here",
  preloadThings = new Map([["#card-sot", "#card-sheet"]]);

document.addEventListener('DOMContentLoaded', () => {
  const appScreen = buildAppScreen(cardOverlay);

  if (appCustodian.yapFriendly) {
    console.debug('console friendly environment');
    console.debug(appScreen);
  }

  appCustodian.startRoutine(
    preloadThings, preloadDest
    cardView, kickOffEventName,
    bootOverlay, bootOverlaySpinner
  );
});
