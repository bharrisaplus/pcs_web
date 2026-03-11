
/**
 * @import {CSSelector, PCSEvent, CardIntri, Lattice, Part, Bank} from "../_meta/_typedefs.mjs"
 */

import { default as _g } from '../_meta/_glods.mjs';
import { default as getTurntable } from '../parts/turntable.part.mjs';
import { default as getDealer } from '../hands/dealer.hand.mjs';
import { default as getTableau } from '../parts/tableau.part.mjs';
import { default as getRibbon } from '../parts/ribbon.part.mjs';


const cardShark = getDealer();

/**
 * @param  {CSSelector} tableauID The dingus element - {@link Part.Tableau}
 * @param  {CSSelector} turntableID The hud element - {@link Part.Turntable}
 * @param  {CSSelector} ribbonID the panel element - {@link Part.Ribbon}
 * @param  {CSSelector} exportBaseID the svg "spritesheet"
 * @param  {Bank.Deck} itemVault The card state
 *
 * @return {Readonly<Lattice.Landing>} home screen manager - {@link Lattice.Landing}
 */
const scaffoldLandingLattice = (tableauID, turntableID, ribbonID, exportBaseID, itemVault) => {
  const
    panel = getRibbon(ribbonID),
    dingus = getTableau(tableauID),
    hud = getTurntable(turntableID);


  /** @param {PCSEvent} _pcsevt */
  const maybe_open_hud = (_pcsevt) => {
    if (panel.isBusy || hud.isOpen) { return; }

    itemVault.updateChoice(Number.parseInt(_pcsevt.detail.$dispatcher?.dataset.oid));

    if (itemVault.choice[0] == -1 || itemVault.choice[1] == -1) { return; }

    hud.loadTurntable(cardShark.getCard(...itemVault.choice));
  };


  /** @param {PCSEvent} _pcsevt */
  const maybe_update_hud = (_pcsevt) => {
    let maybeChoose = -1;

    if (!_pcsevt.detail.msg || !_pcsevt.detail.$dispatcher) { return; }

    if (_pcsevt.detail.$dispatcher == document.querySelector(hud.prevBtn)) {
      maybeChoose = itemVault.choice[0] - 1;
    } else if (_pcsevt.detail.$dispatcher == document.querySelector(hud.nextBtn)) {
      maybeChoose = itemVault.choice[0] + 1;
    }

    if (maybeChoose <= -1 || maybeChoose >= _g.c_Max) { return; }

    itemVault.updateChoice(itemVault.ucards[maybeChoose]);

    if (itemVault.choice[0] == -1 || itemVault.choice[1] == -1) { return; }

    hud.spinTurntable(cardShark.getCard(...itemVault.choice));
    console.info(`rotated turntable to ${_pcsevt.detail.msg == 'prv' ? "previous" : "next"}`);
  };


  /** @param {PCSEvent} _pcsevt */
  const maybe_change_color = (_pcsevt) => {
    if (panel.isBusy || hud.isOpen) { return; }
    if (_pcsevt.detail?.$dispatcher != document.querySelector(panel.dyeInput) ||
      !_pcsevt.detail?.msg
    ) { return; }

    document.querySelector(`#${_g.appID} main`)?.setAttribute('data-dye', _pcsevt.detail.msg);
    console.info(`Changed color to ${_pcsevt.detail?.msg}`);
  };


  /** @param {PCSEvent} _pcsevt */
  const maybe_output_txt = async (_pcsevt) => {
    const itemLabels = itemVault.cards.map((_itm, _idx) => {
      return cardShark.getCard(
        _idx, itemVault.ndoCards.indexOf(_itm)
      ).title.split(":")[1].trim();
    });

    if (panel.isBusy || hud.isOpen) { return; }
    if (_pcsevt.detail?.$dispatcher != document.querySelector(panel.copyBtn)) { return; }

    await panel.composeTxt(itemLabels);
    console.info(`Copied text to clipboard`);
  };


  /** @param {PCSEvent} _pcsevt */
  const maybe_download_img = async (_pcsevt) => {
    const
      currentColor = window.getComputedStyle(
        document.querySelector(`#${_g.appID} main`)
      ).getPropertyValue('background-color'),

      itemRefs = itemVault.cards.map((_itm, _idx) => {
        return cardShark.getCard(
          _idx, itemVault.ndoCards.indexOf(_itm)
        ).symbolRef;
      });

    if (panel.isBusy || hud.isOpen) { return; }
    if (_pcsevt.detail?.$dispatcher != document.querySelector(panel.downloadBtn)) { return; }

    await panel.prepareImg(currentColor, itemRefs, exportBaseID);
    console.info(`Downloaded image`);
  };


  const maybe_mix_items = (_pcsevt) => {
    /** @type {CardIntri[]} */
    let mixList = [];

    if (panel.isBusy || hud.isOpen) { return; }
    if (_pcsevt.detail?.$dispatcher != document.querySelector(panel.mingleBtn)) { return; }

    itemVault.updateCards(cardShark.mixUp(itemVault.ucards, itemVault.ndoUCards));

    mixList = itemVault.cards.map((_itm, _idx) => {
      return cardShark.getCard(_idx, itemVault.ndoCards.indexOf(_itm));
    });

    dingus.updateOrder(mixList);
    panel.resetCtrls();
  };


  /** @returns {Boolean} */
  const tap_in = () => {
    /** @type {Boolean} */
    let maybe_success;
    const
      $appShell = document.querySelector(`#${_g.appID}`),
      $tableau = document.querySelector(tableauID);

    $tableau.setAttribute('style', '');
    $tableau.classList.remove('hide-before-load');

    if (!$appShell) {
      maybe_success = false;
      console.log("Startup issue");
    } else {
      $appShell.addEventListener(_g.notices.needle, maybe_open_hud);
      $appShell.addEventListener(_g.notices.scratch, maybe_update_hud);
      $appShell.addEventListener(_g.notices.splash, maybe_change_color);
      $appShell.addEventListener(_g.notices.chop, maybe_output_txt);
      $appShell.addEventListener(_g.notices.trace, maybe_download_img);
      $appShell.addEventListener(_g.notices.blend, maybe_mix_items);

      maybe_success = true;
      console.log("Ready!");
    }

    return maybe_success;
  };


  return Object.freeze({
    hookUp: tap_in
  });
};


export default scaffoldLandingLattice;
export const debugName = "pcs:lattice:pcs";
