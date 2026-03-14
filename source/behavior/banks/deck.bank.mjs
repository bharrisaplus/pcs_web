
/**
 * @import {Bank} from "../_meta/_typedefs.mjs"
 */

import { default as _g } from '../_meta/_glods.mjs';


const default_order = Uint8Array.from({length: _g.c_Max}, (_, card_idx) => card_idx);

/** @returns {Readonly<Bank.Deck>} a packet of cards {@link Bank.Deck} */
const makeDeckBank = () => {
  let
    topical_order = Uint8Array.from(default_order),
    choosen_card,
    back_splash = 1;


  const new_deck_order = () => {
    topical_order = Uint8Array.from(default_order);
  };


  const replace_topical_order_with = (allNewCards) => {
    if (allNewCards.length == _g.c_Max) {
      topical_order = Uint8Array.from(allNewCards);
    }
  };


  const swap_back_splash_for = (newPaintChoice) => {
    if (newPaintChoice > -1 && newPaintChoice < _g.dyes.length) {
      back_splash = newPaintChoice;
    }
  }


  const choose_new_card = (cardID) => {
    if (topical_order.indexOf(cardID) > -1 && default_order.indexOf(cardID) > -1) {
      choosen_card = cardID;
    }
  };


  return Object.freeze({
    updateCards: replace_topical_order_with,
    updateChoice: choose_new_card,
    updateBackDrop: swap_back_splash_for,
    resetCards: new_deck_order,
    // Computed-s
    get choice () {
      return [topical_order.indexOf(choosen_card), default_order.indexOf(choosen_card)];
    },

    get backDrop () {
      return back_splash;
    },

    get cards () {
      return [...topical_order];
    },

    get ucards () {
      return topical_order.slice(0);
    },

    get ndoCards () {
      return [...default_order];
    },

    get ndoUCards () {
      return default_order.slice(0);
    }
  });
};


const singleDeckHand = makeDeckBank();

export default singleDeckHand;
export const debugName = "pcs:bank:deck";
