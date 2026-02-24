
/**
 * @import {PCSEvent, Lattice, Part, Bank} from "../_meta/_typedefs.mjs"
 */

import _g from '../_meta/_glods.mjs';
import getTurntable from '../parts/turntable.part.mjs';
import getDealer from '../hands/dealer.hand.mjs';


const cardShark = getDealer();

/**
 * @param  {string} tableauID The dingus element - {@link Part.Tableau}
 * @param  {string} turntableID The hud element - {@link Part.Turntable}
 * @param  {Bank.Deck} itemVault The card state
 *
 * @return {Lattice.Landing}
 */
const scaffoldLattice = (tableauID, turntableID, itemVault) => {
  const hud = getTurntable(turntableID);

  let
    _$tableau = document.querySelector(tableauID),
    _$turntable = document.querySelector(turntableID);

  if (_$tableau) {
    _$tableau.addEventListener(_g.notices.needle,
      (/** @type {PCSEvent} */ _evt) => {
        hud.loadTurntable(cardShark.getCard(Number.parseInt(_evt.detail), itemVault));
      }
    );

    _$tableau.querySelectorAll(`li.playing-card`).forEach(($elm) => {
      $elm.addEventListener('click', () => {
        _$tableau.dispatchEvent(new CustomEvent(
          _g.notices.needle, { "detail": $elm.dataset.oid }
        ));
      })
    });

    _$turntable.querySelector(hud.nextBtn).addEventListener('click', () => {
      hud.spinTurntable(cardShark.getCard(hud.cursor + 1, itemVault), false);
    });

    _$turntable.querySelector(hud.prevBtn).addEventListener('click', () => {
      hud.spinTurntable(cardShark.getCard(hud.cursor - 1, itemVault), true);
    });

  } else {
    console.error("Could not find the tableau");
  }

  return Object.freeze({
    landingHUD: hud
  });
};


export default scaffoldLattice;
export const debugName = "pcs:lattice:pcs";
