import appCustodian from './hands/misc.hand.mjs';
import cobbleLanding from './lattices/landing.lattice.mjs';
import cardManager from './banks/deck.bank.mjs';


const
  bootOverlay = '#pageload-curtain',
  bootOverlaySpinner = '.loading-spinny',
  cardView = '#tableau',
  cardOverlay = '#turntable',
  kickOffEventName = 'pcsStart',
  preloadDest = ".inline-svg-assets-here",
  preloadThings = new Map([["#card-sot", "#card-sheet"]]);

document.addEventListener('DOMContentLoaded', () => {
  const landingPage = cobbleLanding(cardView, cardOverlay, cardManager);

  if (appCustodian.yapFriendly) {
    console.debug('console friendly environment');
    console.debug(landingPage);
  }

  appCustodian.startRoutine(
    preloadThings, preloadDest,
    cardView, kickOffEventName,
    bootOverlay, bootOverlaySpinner
  );
});
