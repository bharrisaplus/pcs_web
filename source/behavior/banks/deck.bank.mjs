
/**
 * @import {Bank} from "../_meta/_typedefs.mjs"
 */

import { default as _g } from '../_meta/_glods.mjs';


const default_order = Uint8Array.from({length: _g.c_Max}, (_, card_idx) => card_idx);


/**
 * Check if local storage is avilable
 *
 * @return {boolean}
 */
const canPersist = () => {
  let ok = false;

  try {
    const testKey = "__storage_test__";
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);

    ok = true;
  } catch (storageErr) {
    if (storageErr instanceof DOMException && storageErr.name === "QuotaExceededError") {
      localStorage.clear();
    }
  }

  return ok;
};


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
    if (allNewCards.length !== _g.c_Max) { return; }

    topical_order = Uint8Array.from(allNewCards);
  };


  const swap_back_splash_for = (newPaintChoice) => {
    if (!newPaintChoice) { return; }
    if (newPaintChoice < 0 || newPaintChoice >= _g.dyes.length) { return; }
    if (newPaintChoice === back_splash) { return; }

    back_splash = newPaintChoice;

    if (canPersist()) {
      localStorage.setItem(`${_g.appID}:backgroundColor`, back_splash.toString());
    }
  };


  const choose_new_card = (cardID) => {
    if (topical_order.indexOf(cardID) === -1 || default_order.indexOf(cardID) === -1) { return; }

    choosen_card = cardID;
  };


  if (canPersist()) {
    let maybeBackSplash = localStorage.getItem(`${_g.appID}:backgroundColor`);

    if (maybeBackSplash) {
      swap_back_splash_for(Number.parseInt(maybeBackSplash));
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
