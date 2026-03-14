
/**
 * @import {VerifynLoad} from './_meta/_typedefs.mjs'
 */

import { default as _g } from './_meta/_glods.mjs';
import { default as appLogger } from './hands/scribe.hand.mjs';
import { default as appCustodian } from './hands/misc.hand.mjs';
import { default as cobbleLanding } from './lattices/landing.lattice.mjs';
import { default as cardManager } from './banks/deck.bank.mjs';


const
  bootOverlay = '#pageload-curtain',
  bootOverlaySpinner = '.loading-spinny',
  cardView = '#tableau',
  cardOverlay = '#turntable',
  cardMenu = '#ribbon',
  cardRef = '#card-sheet',
  preloadDest = ".inline-svg-assets-here",
  /** @type {VerifynLoad} */
  preloadThings = new Map([["#card-sot", cardRef]]);


document.addEventListener('DOMContentLoaded', () => {
  appLogger.devlog('console friendly environment');

  const landingPage = cobbleLanding(
    cardView, cardOverlay, cardMenu, cardRef, cardManager
  );


  window.addEventListener(_g.notices.kick, () => {
    if (landingPage.hookUp()) {
      appLogger.devlog("pcs started");
    } else {
      appLogger.issuelog("pcs won't start");
    }
  }, { once: true });

  appCustodian.startRoutine(preloadThings, preloadDest, bootOverlay, bootOverlaySpinner);
});
