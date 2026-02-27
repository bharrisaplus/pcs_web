
/**
 * @import {VerifynLoad} from './_meta/_typedefs.mjs'
 */

import { default as _g } from './_meta/_glods.mjs';
import { default as appCustodian } from './hands/misc.hand.mjs';
import { default as cobbleLanding } from './lattices/landing.lattice.mjs';
import { default as cardManager } from './banks/deck.bank.mjs';


const
  bootOverlay = '#pageload-curtain',
  bootOverlaySpinner = '.loading-spinny',
  cardView = '#tableau',
  cardOverlay = '#turntable',
  cardMenu = '#ribbon',
  preloadDest = ".inline-svg-assets-here",
  /** @type {VerifynLoad} */
  preloadThings = new Map([["#card-sot", "#card-sheet"]]);

document.addEventListener('DOMContentLoaded', () => {
  const landingPage = cobbleLanding(cardView, cardOverlay, cardMenu, cardManager);

  if (appCustodian.yapFriendly) {
    console.debug('console friendly environment');
    console.debug(landingPage);
  }

  window.addEventListener(_g.notices.kick, () => {
    const $reveal = document.querySelector(cardView);

    $reveal.setAttribute('style', '');
    $reveal.classList.remove('hide-before-load');

    console.info("pcs started");
  }, { once: true });

  appCustodian.startRoutine(preloadThings, preloadDest, bootOverlay, bootOverlaySpinner);
});
