
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
    let
      firstCardID = 0,
      secondCardID = 13,
      thirdCardID = 38,
      lastCardID = 51,
      cardOne = latticeDealer.getCard(firstCardID, itemVault),
      cardTwo = latticeDealer.getCard(secondCardID, itemVault),
      cardThree = latticeDealer.getCard(thirdCardID, itemVault),
      cardFour = latticeDealer.getCard(lastCardID, itemVault);

    _$tableau.querySelectorAll(`li.playing-card`)[firstCardID]?.addEventListener('click', () => {
      console.debug(cardOne);
      hud.loadTurntable(cardOne);
    });

    _$tableau.querySelectorAll(`li.playing-card`)[secondCardID]?.addEventListener('click', () => {
      console.debug(cardTwo);
      hud.loadTurntable(cardTwo)
    });

    _$tableau.querySelectorAll(`li.playing-card`)[thirdCardID]?.addEventListener('click', () => {
      console.debug(cardThree);
      hud.loadTurntable(cardThree)
    });

    _$tableau.querySelectorAll(`li.playing-card`)[lastCardID]?.addEventListener('click', () => {
      console.debug(cardFour);
      hud.loadTurntable(cardFour)
    });

    _$turntable.querySelector(hud.nextBtn).addEventListener('click', () => {
      let nextCard = latticeDealer.getCard(hud.cursor + 1, itemVault);

      console.debug(nextCard);
      hud.spinTurntable(nextCard, false);
    });

    _$turntable.querySelector(hud.prevBtn).addEventListener('click', () => {
      let prevCard = latticeDealer.getCard(hud.cursor - 1, itemVault);

      console.debug(prevCard);
      hud.spinTurntable(prevCard, true);
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
