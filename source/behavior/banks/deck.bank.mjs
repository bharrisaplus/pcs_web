
/**
 * @import {Bank, GlobalDeclarations} from "../_meta/_typedefs.mjs"
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
    back_splash = 0;


  const new_deck_order = () => {
    topical_order = Uint8Array.from(default_order);
  };

  /** @param  {number[] | Uint8Array} allNewCards */
  const replace_topical_order_with = (allNewCards) => {
    if (allNewCards.length !== _g.c_Max) { return; }

    topical_order = Uint8Array.from(allNewCards);
  };

  /** @param  {number} newPaintChoice {@link GlobalDeclarations.dyes}  */
  const swap_back_splash_for = (newPaintChoice) => {
    if (!Number.isInteger(newPaintChoice)) { return; }
    if (newPaintChoice < 0 || newPaintChoice >= _g.dyes.length) { return; }
    if (newPaintChoice === back_splash) { return; }

    back_splash = newPaintChoice;

    if (canPersist()) {
      localStorage.setItem(`${_g.appID}:backgroundColor`, JSON.stringify(back_splash));
      localStorage.setItem(`${_g.appID}:backgroundColor:stamp`, JSON.stringify(Date.now()));
    }
  };


  /** @param  {number} cardID */
  const choose_new_card = (cardID) => {
    if (topical_order.indexOf(cardID) === -1 || default_order.indexOf(cardID) === -1) { return; }

    choosen_card = cardID;
  };


  if (canPersist()) {
    const
      maybeBackSplash = localStorage.getItem(`${_g.appID}:backgroundColor`),
      maybeBackSplashStamp = localStorage.getItem(`${_g.appID}:backgroundColor:stamp`);

    if (maybeBackSplashStamp && maybeBackSplash) {
      let backSplashTooOld;

      try {
        const
          backSplashTime = new Date(JSON.parse(maybeBackSplashStamp)),
          backSplashDayAge = Math.ceil(
            (Date.now() - backSplashTime.getTime()) / (1000 * 60 * 60 * 24)
          );

        backSplashTooOld = backSplashDayAge >= 7
      } catch {
        backSplashTooOld = true;
      }

      if (backSplashTooOld) {
        localStorage.removeItem(`${_g.appID}:backgroundColor`);
        localStorage.removeItem(`${_g.appID}:backgroundColor:stamp`);
      } else {
        swap_back_splash_for(JSON.parse(maybeBackSplash));
      }
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
