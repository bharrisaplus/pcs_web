
/**
 * @import {CardIntri, Hand, Bank} from '../_meta/_typedefs.mjs'
 */

import { default as _g } from '../_meta/_glods.mjs';


/**
 * @return {Readonly<Hand.Dealer>} a helper for cards
 */
const makeDealerHand = () => {
  /**
   * @param  {number} ndoPos usually the 'oid' data attribute - {@link HTMLElement.dataset}
   * @param  {Bank.Deck} deckVault - {@link Bank.Deck}
   *
   * @return {Readonly<CardIntri>} a card - {@link CardIntri}
   */
  const generate_card_intri = (ndoPos, deckVault) => {
    let _name = "", _symbl = "";

    const uiPos = deckVault.cards.indexOf(ndoPos) + 1;

    if ((uiPos > 0 && uiPos <= _g.cardMax) && (ndoPos > -1 && ndoPos < _g.cardMax)) {
      switch(true) {
        case (ndoPos < 13): { // Spades
          let _suite = _g.suites[Math.floor(ndoPos / 13)];

          _name = `${_g.cnames[ndoPos]} of ${_suite}`;
          _symbl = `${_suite[0].toLowerCase()}${ndoPos < 10 ? "0" : ""}${ndoPos}`;
          break;
        }
        case (ndoPos < 26): { // Diamonds
          let _suite = _g.suites[Math.floor(ndoPos / 13)]

          _name = `${_g.cnames[ndoPos % _g.cnames.length]} of ${_suite}`;
          _symbl = `${_suite[0].toLowerCase()}${ndoPos}`
          break;
        }
        case (ndoPos < 39): { // Clubs
          let rNamePos = (ndoPos % _g.cnames.length) * -1;

          let _suite = _g.suites[Math.floor(ndoPos / 13)]

          _name = `${_g.cnames.slice(rNamePos - 1, rNamePos)} of ${_suite}`;
          _symbl = `${_suite[0].toLowerCase()}${ndoPos}`
          break;
        }
        case (ndoPos < 52): { // Hearts
          let rNamePos = (ndoPos % _g.cnames.length) * -1;

          let _suite = _g.suites[Math.floor(ndoPos / 13)]

          _name = `${_g.cnames.slice(rNamePos - 1, rNamePos)} of ${_suite}`;
          _symbl = `${_suite[0].toLowerCase()}${ndoPos}`
          break;
        }
        default: _name = "A Card";
      }
    }

    return Object.freeze({
      spot: uiPos,
      title: `${_g.ctitlePrefix} ${uiPos}: ${_name}`,
      desc: `${_g.cdescPrefix} ${uiPos}`,
      symbolRef: `#${_symbl}`
    });
  };

  return Object.freeze({
    getCard: generate_card_intri
  });
};


export default makeDealerHand;
export const debugName = 'pcs:hand:dealer';
