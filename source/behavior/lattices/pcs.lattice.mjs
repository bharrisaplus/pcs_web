import getTurntable from '../parts/turntable.part.mjs';
import getDealer from '../hands/dealer.hand.mjs';

/**
 * @import {PCSLattice} from "../_meta/_typedefs.mjs"
 */


const latticeDealer = getDealer();

/**
 * @param  {string} tableauID The primary element - {@link CSSStyleRule.selectorText}
 * @param  {string} turntableID The popover element - {@link CSSStyleRule.selectorText}
 * @param  {DeckBank} itemVault The card state
 *
 * @return {PCSLattice}
 */
const makePCSLattice = (tableauID, turntableID, itemVault) => {
  const
    $dingus = document.querySelector(tableauID),
    $hud = getTurntable(turntableID);

  if ($dingus) {
    $dingus.querySelectorAll(`li.playing-card`)[0]?.addEventListener('click', $hud.loadTurntable);
    $dingus.querySelectorAll(`li.playing-card`)[51]?.addEventListener('click', $hud.loadTurntable);

    console.debug(latticeDealer.posRelLabels(0, itemVault))
    console.debug(latticeDealer.posRelLabels(1, itemVault))

  } else {
    console.error("Could not find the tableau");
  }

  return Object.freeze({
    pcsHUD: $hud
  });
};


export default makePCSLattice;
export const debugName = "pcs:lattice:pcs";
