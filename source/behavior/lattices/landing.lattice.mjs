
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
    let hudBits = [];

    const msgBits = _pcsevt.detail.msg.split("[::|::]").map((itm) => Number.parseInt(itm));

    if (_pcsevt.detail.$dispatcher == document.querySelector(hud.prevBtn)) {
      goBack = true;
      hudBits = hud.cursor.split("[::|::]").map((itm) => {
        return Math.max(Number.parseInt(itm), -1) - 1;
      });
    } else if (_pcsevt.detail.$dispatcher == document.querySelector(hud.nextBtn)) {
      hudBits = hud.cursor.split("[::|::]").map((itm) => {
        return Math.min(Number.parseInt(itm), _g.cardMax) + 1;
      });
    }

    if (hudBits.length > 0 && msgBits[0] == hudBits[0] && msgBits[1] == hudBits[1]) {
      hud.spinTurntable(cardShark.getCard(msgBits[0], msgBits[1]));
      console.log(`rotating turntable to ${goBack ? "previous" : "next"}`);
    }

    itemVault.updateCards(_landingCards);
  };

  /** @param {PCSEvent} _pcsevt */
  const maybe_change_color = (_pcsevt) => {
    if (
      _pcsevt.detail?.$dispatcher == document.querySelector(panel.dyeInput) &&
      _pcsevt.detail?.msg
    ) {
      document.querySelector(tableauID).className = `${_pcsevt.detail.msg}-dye`;
      console.debug(`Changing color to ${_pcsevt.detail?.msg}`);
    }
  };


  _landingCards = dingus.currentOrder;

  if (_landingCards.length < _g.cardMax) {
    console.error("Issue with Tableau. Cancelling setup");
    console.debug(_landingCards);
    console.debug(dingus);
    console.debug(hud);
  } else {
    document.querySelector(`#${_g.appID}`)?.addEventListener(_g.notices.needle, maybe_open_hud);
    document.querySelector(`#${_g.appID}`)?.addEventListener(_g.notices.scratch, maybe_update_hud);
    document.querySelector(`#${_g.appID}`)?.addEventListener(_g.notices.splash, maybe_change_color);

    dingus.prepareTableau();
    itemVault.updateCards(_landingCards);
  }

  return Object.freeze({
    landingDingus: dingus,
    landingHUD: hud
  });
};


export default scaffoldLandingLattice;
export const debugName = "pcs:lattice:pcs";
