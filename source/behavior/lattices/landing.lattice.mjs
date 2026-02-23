
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
    let
      firstCardID = 0,
      lastCardID = 51,
      cardOne = latticeDealer.getCard(firstCardID, itemVault),
      cardTwo = latticeDealer.getCard(lastCardID, itemVault);

    $dingus.querySelectorAll(`li.playing-card`)[firstCardID]?.addEventListener('click', () => {
      console.debug(cardOne);
      hud.loadTurntable(cardOne);
    });

    $dingus.querySelectorAll(`li.playing-card`)[lastCardID]?.addEventListener('click', () => {
      console.debug(cardTwo);
      hud.loadTurntable(cardTwo)
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
