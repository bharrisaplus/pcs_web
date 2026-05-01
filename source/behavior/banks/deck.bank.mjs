/** @globals localStorage */

/**
 * @import {Bank} from "../_meta/_typedefs.mjs"
 */

import { default as _g } from '../_meta/_glods.mjs';


const default_order = Uint8Array.from({length: _g.c_Max}, (_, card_idx) => card_idx);


/** @type {Bank.deckOffers["storageAvailable"]} */
const can_persist = () => {
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


/** @type {Bank.deckOffers["isExpired"]} */
const too_old = (timestamp) => {
  let tooOldResult;

  try {
    const
      stampDate = new Date(JSON.parse(timestamp)),
      dayAge = Math.ceil(
        (Date.now() - stampDate.getTime()) / (1000 * 60 * 60 * 24)
      );

    tooOldResult = dayAge >= 7
  } catch {
    tooOldResult = true;
  }

  return tooOldResult;
};


/** @returns {Readonly<Bank.Deck>} a packet of cards - {@link Bank.Deck} */
const makeDeckBank = () => {
  let
    topical_order = Uint8Array.from(default_order),
    choosen_card = 0,
    back_splash = 0;


  /** @type {Bank.Deck["resetCards"]} */
  const new_deck_order = () => {
    if (topical_order.toString() === default_order.toString()) { return; }

    topical_order = Uint8Array.from(default_order);

    if (can_persist()) {
      localStorage.setItem(`${_g.appID}:cardOrder`, JSON.stringify(topical_order));
      localStorage.setItem(`${_g.appID}:cardOrder:stamp`, JSON.stringify(Date.now()));
    }
  };


  /** @type {Bank.Deck["updateCards"]} */
  const replace_topical_order_with = (allNewCards) => {
    let validReplacement;

    if (!Array.isArray(allNewCards) && !(allNewCards instanceof Uint8Array)) { return; }
    if (allNewCards.length !== _g.c_Max) { return; }

    validReplacement = allNewCards.values().every((_itm) => {
      return Number.isInteger(_itm) && default_order.indexOf(_itm) !== -1;
    });

    if (!validReplacement) { return; }
    if (allNewCards.toString() === topical_order.toString()) { return; }

    topical_order = Uint8Array.from(allNewCards);

    if (can_persist()) {
      localStorage.setItem(`${_g.appID}:cardOrder`, JSON.stringify(topical_order));
      localStorage.setItem(`${_g.appID}:cardOrder:stamp`, JSON.stringify(Date.now()));
    }
  };


  /** @type {Bank.Deck["updateBackDrop"]} */
  const swap_back_splash_for = (newPaintChoice) => {
    if (!Number.isInteger(newPaintChoice)) { return; }
    if (newPaintChoice < 0 || newPaintChoice >= _g.dyes.length) { return; }
    if (newPaintChoice === back_splash) { return; }

    back_splash = newPaintChoice;

    if (can_persist()) {
      localStorage.setItem(`${_g.appID}:backgroundColor`, JSON.stringify(back_splash));
      localStorage.setItem(`${_g.appID}:backgroundColor:stamp`, JSON.stringify(Date.now()));
    }
  };


  /** @type {Bank.Deck["updateChoice"]} */
  const choose_new_card = (cardID) => {
    if (topical_order.indexOf(cardID) === -1 || default_order.indexOf(cardID) === -1) { return; }

    choosen_card = cardID;
  };


  if (can_persist()) {
    const
      maybeBackSplash = localStorage.getItem(`${_g.appID}:backgroundColor`),
      maybeBackSplashStamp = localStorage.getItem(`${_g.appID}:backgroundColor:stamp`),
      maybeCardOrder = localStorage.getItem(`${_g.appID}:cardOrder`),
      maybeCardOrderStamp = localStorage.getItem(`${_g.appID}:cardOrder:stamp`);

    if (maybeBackSplashStamp && maybeBackSplash) {
      if (too_old(maybeBackSplashStamp)) {
        localStorage.removeItem(`${_g.appID}:backgroundColor`);
        localStorage.removeItem(`${_g.appID}:backgroundColor:stamp`);
      } else {
        swap_back_splash_for(Number.parseInt(JSON.parse(maybeBackSplash)));
      }
    }

    if (maybeCardOrderStamp && maybeCardOrder) {
      if (too_old(maybeCardOrderStamp)) {
        localStorage.removeItem(`${_g.appID}:cardOrder`);
        localStorage.removeItem(`${_g.appID}:cardOrder:stamp`);
      } else {
        replace_topical_order_with(Uint8Array.from(Object.values(JSON.parse(maybeCardOrder))));
      }
    }
  };

  return Object.freeze({
    updateCards: replace_topical_order_with,
    updateChoice: choose_new_card,
    updateBackDrop: swap_back_splash_for,
    resetCards: new_deck_order,
    // Computed-s

    /** @type {[number, number]} */
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

/** @returns {Bank.deckOffers} */
export const getOffers = () => {
  return Object.freeze({
    storageAvailable: can_persist,
    isExpired: too_old
  });
};

export const debugName = "pcs:bank:deck";
