/** @globals document, window */

/**
 * @import {CSSelector, VerifynLoad, Lattice} from './_meta/_typedefs.mjs'
 */

import { default as _g } from './_meta/_glods.mjs';
import { default as appLogger } from './hands/scribe.hand.mjs';
import { default as appCustodian } from './hands/misc.hand.mjs';
import { default as cobbleLanding } from './lattices/landing.lattice.mjs';
import { default as appStore } from './banks/deck.bank.mjs';


let
  /** @type {HTMLElement} */
  $repoLink,
  /** @type {HTMLElement} */
  $helpOpn,
  /** @type {HTMLTemplateElement} */
  $helpRef,
  /** @type {Lattice.Landing} */
  landingPage;
const
  /** @type {CSSelector} */
  bootOverlay = '#pageload-curtain',
  /** @type {CSSelector} */
  bootOverlaySpinner = '.loading-spinny',
  /** @type {CSSelector} */
  cardView = '#tableau',
  /** @type {CSSelector} */
  cardOverlay = '#turntable',
  /** @type {CSSelector} */
  cardMenu = '#ribbon',
  /** @type {CSSelector} */
  cardRef = '#card-sheet',
  /** @type {CSSelector} */
  preloadDest = ".inline-svg-assets-here",
  /** @type {CSSelector} */
  helpRef = "#helpdialog",
  /** @type {CSSelector} */
  repoLink = "#repolink",
  /** @type {CSSelector} */
  helpOpn = "#qhelp",
  /** @type {CSSelector} */
  helpDlg = "#icon-help",
  /** @type {VerifynLoad} */
  preloadThings = new Map([["#card-sot", cardRef]]);


document.addEventListener('DOMContentLoaded', async () => {
  $repoLink = document.querySelector(repoLink);
  $helpOpn = document.querySelector(helpOpn);
  $helpRef = document.querySelector(helpRef);
  landingPage = cobbleLanding(cardView, cardOverlay, cardMenu, cardRef, appStore);


  window.addEventListener(_g.notices.kick, () => {
    let hookedUp = landingPage.hookUp();

    if (hookedUp) {
      appLogger.devlog("pcs started");
    } else {
      appLogger.notilog("pcs won't start");
    }
  }, { once: true });

  appCustodian.startRoutine(preloadThings, preloadDest, bootOverlay, bootOverlaySpinner).then(
    (bootOK) => { bootOK ? appLogger.devlog("boot successful") : appLogger.notilog("pcs won't start"); },
    (bootRej) => { appLogger.issuelog("pcs won't start", null, bootRej, true); }
  );

  $repoLink.onclick = (_clickEvt) => {
    let _$anchor;

    if (_clickEvt.target !== $repoLink) { return; }

    _$anchor = document.createElement('a');

    _$anchor.setAttribute('href', "https://github.com/bharrisaplus/pcs_web");
    _$anchor.setAttribute('target', '_blank');
    _$anchor.click();
  }

  $helpOpn.onclick = (_clickEvt) => {
    /** @type {HTMLDialogElement} */
    let $helpDlg;

    if (_clickEvt.target !== $helpOpn) { return; }

    $helpDlg = document.importNode($helpRef.content, true)?.querySelector(helpDlg);

    if (!$helpDlg) { return; }

    $helpDlg.onclose = () => $helpDlg?.remove();

    document.body.appendChild($helpDlg);
    $helpDlg.showModal();
  };
});
