
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
      cardOneLabels = latticeDealer.posRelLabels(firstCardID, itemVault),
      cardTwoLabels = latticeDealer.posRelLabels(lastCardID, itemVault);

    $dingus.querySelectorAll(`li.playing-card`)[firstCardID]?.addEventListener('click', () => {
      console.debug(cardOneLabels);
      hud.loadTurntable({
        specialPos: "beg",
        title: cardOneLabels.title,
        description: cardOneLabels.desc
      });
    });

    $dingus.querySelectorAll(`li.playing-card`)[lastCardID]?.addEventListener('click', () => {
      console.debug(cardTwoLabels);
      hud.loadTurntable({
        specialPos: "",
        title: cardTwoLabels.title,
        description: cardTwoLabels.desc
      })
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
