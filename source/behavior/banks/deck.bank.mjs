
/**
 * @import {Bank} from "../_meta/_typedefs.mjs"
 */

import { default as _g } from '../_meta/_glods.mjs';


const default_order = Uint8Array.from({length: _g.cardMax}, (_, card_idx) => card_idx);

/**
 *
 * @returns {Readonly<Bank.Deck>} a packet of cards {@link Bank.Deck}
 */
const makeDeckBank = () => {
  let card_id_order = default_order;

  const new_deck_order = () => {
    card_id_order = Uint8Array.from(default_order);
  };


  const replace_card_id_order_with = (allNewCards) => {
    if (allNewCards.length == _g.cardMax) {
      card_id_order = Uint8Array.from(allNewCards);
    }
  };


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


const singleDeck = makeDeckBank();

export default singleDeck;
export const debugName = "pcs:bank:deck";
