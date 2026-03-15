
/**
 * @import {CSSelector, PCSEvent, CardIntri, Hand, Lattice, Part, Bank} from "../_meta/_typedefs.mjs"
 */

import { default as _g } from '../_meta/_glods.mjs';
import { default as appLogger } from '../hands/scribe.hand.mjs';
import { default as getTurntable } from '../parts/turntable.part.mjs';
import { default as getDealer } from '../hands/dealer.hand.mjs';
import { default as getTableau } from '../parts/tableau.part.mjs';
import { default as getRibbon } from '../parts/ribbon.part.mjs';


const lattice_name = "pcs:lattice:landing";

/**
 * @param  {CSSelector} tableauID The dingus element - {@link Part.Tableau}
 * @param  {CSSelector} turntableID The hud element - {@link Part.Turntable}
 * @param  {CSSelector} ribbonID the panel element - {@link Part.Ribbon}
 * @param  {CSSelector} exportBaseID the svg "spritesheet"
 *
 * @param  {Bank.Deck} itemVault The card state - {@link Bank.Deck}
 * @return {Readonly<Lattice.Landing>} home screen manager - {@link Lattice.Landing}
 */
const scaffoldLandingLattice = (tableauID, turntableID, ribbonID, exportBaseID, itemVault) => {
  let
    /** @type {Readonly<Part.Ribbon>} */
    panel,
    /** @type {Readonly<Part.Tableau>} */
    dingus,
    /** @type {Readonly<Part.Turntable>} */
    hud,
    /** @type {Readonly<Hand.Dealer>} */
    shark,
    /** @type {Readonly<CardIntri>[]} */
    initList = [],
    tapCount = 0;
  const
    args = { tableauID, turntableID, ribbonID, exportBaseID, itemVault },
    $appShell = document.querySelector(`#${_g.appID}`);


  try {
    panel = getRibbon(ribbonID);
    dingus = getTableau(tableauID);
    hud = getTurntable(turntableID);
    shark = getDealer();

    if (itemVault.cards.toString() !== dingus.currentOrder.toString()) {
      initList = itemVault.cards.map((_itm, _idx) => {
        return shark.getCard(_idx, itemVault.ndoCards.indexOf(_itm));
      });
    }
  } catch (startErr) {
    appLogger.issuelog(`Issue with build for ${lattice_name}`, args, startErr);
    panel = null;
    dingus = null;
    hud = null;
    shark = null;
  }


  /** @param {PCSEvent} _pcsevt */
  const maybe_open_hud = (_pcsevt) => {
    if (panel.isBusy || hud.isOpen) { return; }

    itemVault.updateChoice(Number.parseInt(_pcsevt.detail.$dispatcher?.dataset.oid));

    if (itemVault.choice[0] === -1 || itemVault.choice[1] === -1) { return; }

    hud.loadTurntable(shark.getCard(...itemVault.choice));
  };


  /** @param {PCSEvent} _pcsevt */
  const maybe_update_hud = (_pcsevt) => {
    let maybeChoose = -1;

    if (!_pcsevt.detail.msg || !_pcsevt.detail.$dispatcher) { return; }

    if (_pcsevt.detail.$dispatcher === document.querySelector(hud.prevBtn)) {
      maybeChoose = itemVault.choice[0] - 1;
    } else if (_pcsevt.detail.$dispatcher === document.querySelector(hud.nextBtn)) {
      maybeChoose = itemVault.choice[0] + 1;
    }

    if (maybeChoose <= -1 || maybeChoose >= _g.c_Max) { return; }

    itemVault.updateChoice(itemVault.ucards[maybeChoose]);

    if (itemVault.choice[0] === -1 || itemVault.choice[1] === -1) { return; }

    hud.spinTurntable(shark.getCard(...itemVault.choice));

    appLogger.devlog(`rotated turntable to ${_pcsevt.detail.msg === 'prv' ? "previous" : "next"}`);
  };


  /** @param {PCSEvent} _pcsevt */
  const maybe_change_color = (_pcsevt) => {
    let dyeIndex;

    if (
      panel.isBusy || hud.isOpen ||
      _pcsevt.detail?.$dispatcher !== document.querySelector(panel.dyeInput) ||
      !_pcsevt.detail?.msg
    ) {
      document.querySelector(panel.dyeInput).blur();
      return;
    }

    dyeIndex = _g.dyes.indexOf(_pcsevt.detail.msg);

    if (dyeIndex === itemVault.backDrop || dyeIndex === -1) {
      document.querySelector(panel.dyeInput).blur();
      return;
    }

    itemVault.updateBackDrop(dyeIndex);
    $appShell.querySelector('main').setAttribute('data-dye', _pcsevt.detail.msg);
    appLogger.devlog(`Changed color to ${_g.dyes[itemVault.backDrop]}`);
  };


  /** @param {PCSEvent} _pcsevt */
  const maybe_output_txt = async (_pcsevt) => {
    const itemLabels = itemVault.cards.map((_itm, _idx) => {
      return shark.getCard(
        _idx, itemVault.ndoCards.indexOf(_itm)
      ).title.split(":")[1].trim();
    });

    if (
      panel.isBusy || hud.isOpen ||
      _pcsevt.detail?.$dispatcher !== document.querySelector(panel.copyBtn)
    ) {
      document.querySelector(panel.copyBtn).blur();
      return;
    }

    await panel.composeTxt(itemLabels);
    appLogger.notilog(`Copied text to clipboard`);
  };


  /** @param {PCSEvent} _pcsevt */
  const maybe_download_img = async (_pcsevt) => {
    const
      currentColor = window.getComputedStyle(
        $appShell.querySelector('main')
      ).getPropertyValue('background-color'),

      itemRefs = itemVault.cards.map((_itm, _idx) => {
        return shark.getCard(
          _idx, itemVault.ndoCards.indexOf(_itm)
        ).symbolRef;
      });

    if (
      panel.isBusy || hud.isOpen ||
      _pcsevt.detail?.$dispatcher !== document.querySelector(panel.downloadBtn)
    ) {
      document.querySelector(panel.downloadBtn).blur();
      return;
    }

    await panel.prepareImg(currentColor, itemRefs, exportBaseID);

    appLogger.notilog(`Downloaded image`);
  };


  const maybe_mix_items = (_pcsevt) => {
    /** @type {CardIntri[]} */
    let mixList = [];

    if (
      panel.isBusy || hud.isOpen ||
      _pcsevt.detail?.$dispatcher !== document.querySelector(panel.mingleBtn)
    ) {
      document.querySelector(panel.mingleBtn).blur();
      return;
    }

    itemVault.updateCards(shark.mixUp(itemVault.ucards, itemVault.ndoUCards));

    mixList = itemVault.cards.map((_itm, _idx) => {
      return shark.getCard(_idx, itemVault.ndoCards.indexOf(_itm));
    });

    dingus.updateOrder(mixList);
    panel.resetCtrls();
  };


  const maybe_refresh_items = (_pcsevt) => {
    let freshList = [];

    if (
      panel.isBusy || hud.isOpen ||
      _pcsevt.detail?.$dispatcher !== document.querySelector(panel.clearBtn) ||
      itemVault.ucards.toString() === itemVault.ndoUCards.toString()
    ) {
      document.querySelector(panel.clearBtn).blur();
      return;
    }

    itemVault.resetCards();

    freshList = itemVault.cards.map((_itm, _idx) => {
      return shark.getCard(_idx, itemVault.ndoCards.indexOf(_itm));
    });

    dingus.updateOrder(freshList);
    panel.resetCtrls();
  };


  /** @returns {Boolean} */
  const tap_in = () => {
    /** @type {Boolean} */
    let maybe_success;
    const $tableau = document.querySelector(tableauID);


    if (!$appShell || !$tableau) {
      maybe_success = false;
      appLogger.issuelog(`Entry point not found for ${lattice_name}`, args);
    } else if (!panel || !dingus || !hud || !shark) {
      maybe_success = false;
      appLogger.issuelog(`Required components missing for ${lattice_name}`, args);
    } else if (tapCount > 0) {
      maybe_success = false;
      appLogger.issuelog('Already hooked up');
    } else {
      if (initList.length === 52) {
        dingus.updateOrder(initList);
      }

      if ($appShell.querySelector('main').getAttribute('data-dye') !== _g.dyes[itemVault.backDrop || 0]) {
        $appShell.querySelector('main').setAttribute('data-dye', _g.dyes[itemVault.backDrop || 0]);
      }

      $tableau.setAttribute('style', '');
      $tableau.classList.remove('hide-before-load');

      $appShell.addEventListener(_g.notices.needle, maybe_open_hud);
      $appShell.addEventListener(_g.notices.scratch, maybe_update_hud);
      $appShell.addEventListener(_g.notices.splash, maybe_change_color);
      $appShell.addEventListener(_g.notices.chop, maybe_output_txt);
      $appShell.addEventListener(_g.notices.trace, maybe_download_img);
      $appShell.addEventListener(_g.notices.blend, maybe_mix_items);
      $appShell.addEventListener(_g.notices.fresh, maybe_refresh_items);

      maybe_success = true;
      initList = [];
      tapCount++;
      appLogger.devlog(`Hooked up ${lattice_name}`);
    }

    return maybe_success;
  };


  appLogger.devlog(`Built ${lattice_name}`);

  return Object.freeze({
    hookUp: tap_in
  });
};


export default scaffoldLandingLattice;
export const debugName = lattice_name;
