
/**
 * @import {PCSLattice, Tableau, Turntable, DeckBank} from "../_meta/_typedefs.mjs"
 */

import getTurntable from '../parts/turntable.part.mjs';
import getDealer from '../hands/dealer.hand.mjs';


const latticeDealer = getDealer();

/**
 * @param  {string} tableauID The dingus element - {@link Tableau}
 * @param  {string} turntableID The hud element - {@link Turntable}
 * @param  {DeckBank} itemVault The card state
 *
 * @return {PCSLattice}
 */
const scaffoldLattice = (tableauID, turntableID, itemVault) => {
  const hud = getTurntable(turntableID);

  let
    _$tableau = document.querySelector(tableauID),
    _$turntable = document.querySelector(turntableID);

  if (tableauID) {
    _$tableau.querySelectorAll(`li.playing-card`).forEach(($elm) => {
      $elm.addEventListener('click', (_clickEvt) => {
        hud.loadTurntable(latticeDealer.getCard(Number.parseInt($elm.dataset.oid), itemVault));
      })
    });

    _$turntable.querySelector(hud.nextBtn).addEventListener('click', () => {
      hud.spinTurntable(latticeDealer.getCard(hud.cursor + 1, itemVault), false);
    });

    _$turntable.querySelector(hud.prevBtn).addEventListener('click', () => {
      hud.spinTurntable(latticeDealer.getCard(hud.cursor - 1, itemVault), true);
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
