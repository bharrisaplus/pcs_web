
/**
 * @import {CSSelector, PCSEvent, Lattice, Part, Bank} from "../_meta/_typedefs.mjs"
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
 * @param  {Bank.Deck} itemVault The card state
 *
 * @return {Readonly<Lattice.Landing>} home screen manager - {@link Lattice.Landing}
 */
const scaffoldLandingLattice = (tableauID, turntableID, ribbonID, itemVault) => {
  /** @type {number[]} */
  let _landingCards = [];

  const
    panel = getRibbon(ribbonID),
    dingus = getTableau(tableauID),
    hud = getTurntable(turntableID);


  /** @param {PCSEvent} _pcsevt */
  const maybe_open_hud = (_pcsevt) => {
    hud.loadTurntable(cardShark.getCard(
      _pcsevt.detail.msg, _pcsevt.detail.$dispatcher?.dataset.oid
    ));

    _landingCards = dingus.currentOrder;
  };


  /** @param {PCSEvent} _pcsevt */
  const maybe_update_hud = (_pcsevt) => {
    let
      goBack = false,
      hudBits = [],
      msgBits = [];

    if (_pcsevt.detail.$dispatcher == document.querySelector(hud.prevBtn)) {
      goBack = true;
      hudBits = hud.cursor.split("[::|::]").map((hudBit) => {
        return Math.max(Number.parseInt(hudBit), -1) - 1;
      });

      msgBits = _pcsevt.detail.msg.split("[::|::]").map((msgBit) => {
        return Math.max(Number.parseInt(msgBit), -1) - 1;
      })
    } else if (_pcsevt.detail.$dispatcher == document.querySelector(hud.nextBtn)) {
      hudBits = hud.cursor.split("[::|::]").map((hudBit) => {
        return Math.min(Number.parseInt(hudBit), _g.c_Max) + 1;
      });

      msgBits = _pcsevt.detail.msg.split("[::|::]").map((msgBit) => {
        return Math.min(Number.parseInt(msgBit), _g.c_Max) + 1;
      });
    }

    if (hudBits.length > 0 && msgBits[0] == hudBits[0] && msgBits[1] == hudBits[1]) {
      hud.spinTurntable(cardShark.getCard(msgBits[0], msgBits[1]));
      itemVault.updateCards(_landingCards);
      console.log(`rotating turntable to ${goBack ? "previous" : "next"}`);
    }
  };


  /** @param {PCSEvent} _pcsevt */
  const maybe_change_color = (_pcsevt) => {
    if (_pcsevt.detail?.$dispatcher != document.querySelector(panel.dyeInput) ||
      !_pcsevt.detail?.msg
    ) { return; }

    document.querySelector(`#${_g.appID} main`)?.setAttribute('data-dye', _pcsevt.detail.msg);
    console.debug(`Changing color to ${_pcsevt.detail?.msg}`);
  };

  /** @param {PCSEvent} _pcsevt */
  const maybe_output_txt = async (_pcsevt) => {
    if (_pcsevt.detail?.$dispatcher != document.querySelector(panel.copyBtn)) { return; }
    if (panel.isBusy || hud.isOpen) { return; }

    await panel.composeTxt("[::|::]");
    console.debug(`Copying to clipboard`);
  };


  /** @returns {boolean} */
  const tap_in = () => {
    /** @type {boolean} */
    let maybe_success;
    const
      $appShell = document.querySelector(`#${_g.appID}`),
      $tableau = document.querySelector(tableauID);

    $tableau.setAttribute('style', '');
    $tableau.classList.remove('hide-before-load');

    if (!$appShell) { maybe_success = false; }

    $appShell.addEventListener(_g.notices.needle, maybe_open_hud);
    $appShell.addEventListener(_g.notices.scratch, maybe_update_hud);
    $appShell.addEventListener(_g.notices.splash, maybe_change_color);
    $appShell.addEventListener(_g.notices.chop, maybe_output_txt);
    maybe_success = true;

    return maybe_success;
  };


  _landingCards = dingus.currentOrder;

  if (_landingCards.length < _g.c_Max) {
    console.error("Issue with Tableau. Cancelling setup");
  } else {
    itemVault.updateCards(_landingCards);
  }

  return Object.freeze({
    hookUp: tap_in
  });
};


export default scaffoldLandingLattice;
export const debugName = "pcs:lattice:pcs";
