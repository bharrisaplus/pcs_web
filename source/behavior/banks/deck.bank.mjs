
/**
 * @import {DeckBank} from "../_meta/_typedefs.mjs"
 */

import _globals from '../_meta/_glods.mjs';


/**
 *  @type {Uint8Array}
 */
let card_id_order = null;


/**
 *
 * @returns {DeckBank}
 */
const getDeckBank = () => {
  const default_order = Uint8Array.from({length: _globals.cardMax}, (_, card_idx) => card_idx);

  const new_deck_order = () => {
    card_id_order = Uint8Array.from(default_order);
  }


  const replace_card_id_order_with = (allNewCards) => {
    if (allNewCards.length == _globals.cardMax) {
      card_id_order = Uint8Array.from(allNewCards);
    }
  };


  if (card_id_order == null) {
    new_deck_order();
  }

  return Object.freeze({
    updateCards: replace_card_id_order_with,
    resetCards: new_deck_order,
    // Computed-s
    get cards () {
      return [...card_id_order];
    },

    get ucards () {
      return card_id_order.slice(0);
    },

    get ndoCards () {
      return [...default_order];
    },

    get ndoUCards () {
      return default_order.slice(0);
    }
  });
};


const singleDeckBank = getDeckBank();

export default singleDeckBank;
export const debugName = "pcs:bank:deck";
