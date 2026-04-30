/** @globals document, window */

/**
 * @import {VerifynLoad, Lattice} from './_meta/_typedefs.mjs'
 */

import { default as _g } from './_meta/_glods.mjs';
import { default as appLogger } from './hands/scribe.hand.mjs';
import { default as appCustodian } from './hands/misc.hand.mjs';
import { default as cobbleLanding } from './lattices/landing.lattice.mjs';
import { default as appStore } from './banks/deck.bank.mjs';


let
  /** @type {HTMLElement} */
  $repoLink,
  /** @type {HTMLButtonElement} */
  $helpBtn,
  /** @type {HTMLTemplateElement} */
  $helpRef,
  /** @type {Lattice.Landing} */
  landingPage;
const
  bootOverlay = '#pageload-curtain',
  bootOverlaySpinner = '.loading-spinny',
  cardView = '#tableau',
  cardOverlay = '#turntable',
  cardMenu = '#ribbon',
  cardRef = '#card-sheet',
  preloadDest = ".inline-svg-assets-here",
  helpSelector = "#helpdialog",
  /** @type {VerifynLoad} */
  preloadThings = new Map([["#card-sot", cardRef]]);


document.addEventListener('DOMContentLoaded', async () => {
  $repoLink = document.querySelector(`#repolink`);
  $helpBtn = document.querySelector(`#qhelp`);
  $helpRef = document.querySelector(helpSelector);
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

  $helpBtn.onclick = (_clickEvt) => {
    /** @type {HTMLDialogElement} */
    let $hlpDlg;

    if (_clickEvt.target !== $helpBtn) { return; }

    $hlpDlg = document.importNode($helpRef.content, true)?.querySelector('#icon-help');

    if (!$hlpDlg) { return; }

    $hlpDlg.onclose = () => {
      $hlpDlg?.remove();
      $helpBtn.disabled = true;

      window.setTimeout(() => {
        $helpBtn.disabled = true;
      }, 1500);
    }

    document.body.appendChild($hlpDlg);
    $hlpDlg.showModal();
  };
});
