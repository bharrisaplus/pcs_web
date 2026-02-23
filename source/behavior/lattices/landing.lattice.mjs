
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
  const
    $dingus = document.querySelector(tableauID),
    hud = getTurntable(turntableID);

  if ($dingus) {
    $dingus.querySelectorAll(`li.playing-card`)[0]?.addEventListener('click', hud.loadTurntable);
    $dingus.querySelectorAll(`li.playing-card`)[51]?.addEventListener('click', hud.loadTurntable);

    console.debug(latticeDealer.posRelLabels(0, itemVault));
    console.debug(latticeDealer.posRelLabels(1, itemVault));

  } else {
    console.error("Could not find the tableau");
  }

  return Object.freeze({
    landingHUD: hud
  });
};


export default scaffoldLattice;
export const debugName = "pcs:lattice:pcs";
