
/**
 * @import {VerifynLoad} from './_meta/_typedefs.mjs'
 */

import { default as _g } from './_meta/_glods.mjs';
import { default as appLogger } from './hands/scribe.hand.mjs';
import { default as appCustodian } from './hands/misc.hand.mjs';
import { default as cobbleLanding } from './lattices/landing.lattice.mjs';
import { default as appStore } from './banks/deck.bank.mjs';


let $repoLink;
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


document.addEventListener('DOMContentLoaded', async () => {
  let willRun;
  const landingPage = cobbleLanding(cardView, cardOverlay, cardMenu, cardRef, appStore);

  willRun = await appCustodian.startRoutine(preloadThings, preloadDest, bootOverlay, bootOverlaySpinner);

  if (willRun) {
    window.addEventListener(_g.notices.kick, () => {
      if (landingPage.hookUp()) {
        appLogger.devlog("pcs started");
      } else {
        appLogger.notilog("pcs won't start");
      }
    }, { once: true });

    $repoLink = document.querySelector(`#${_g.appID} > i.ilink`);

    $repoLink?.addEventListener('click', (_clickEvt) => {
      let _$anchor;

      if (_clickEvt.target !== $repoLink) { return; }

      _$anchor = document.createElement('a');
      _$anchor.setAttribute('href', "https://github.com/bharrisaplus/pcs_web");
      _$anchor.setAttribute('target', '_blank');
      _$anchor.click();
    })
  } else {
    appLogger.notilog("pcs won't start");
  }
});
