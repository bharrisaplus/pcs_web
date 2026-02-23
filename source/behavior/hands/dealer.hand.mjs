
/**
 * @import {CardIntri, DealerHand, DeckBank} from '../_meta/_typedefs.mjs'
 */

import _glob from '../_meta/_glods.mjs';


/**
 * @return {DealerHand}
 */
const makeDealerHand = () => {
  /**
   * Looks like:
   *   title: "Number {CURRENT_DECK_POSITION}: {VALUE} of {SUITE}"
   *   description: "Card in position {CURRENT_DECK_POSITION}"
   *
   * @param  {number} ndoPos usually the 'oid' data attribute - {@link HTMLElement.dataset}
   * @param  {DeckBank} deckVault
   *
   * @return {CardIntri}
   */
  const generate_card_intri = (ndoPos, deckVault) => {
    let _name = "", _symbl = "";

    const uiPos = deckVault.cards.indexOf(ndoPos) + 1;

    if ((uiPos > 0 && uiPos <= _glob.cardMax) && (ndoPos > -1 && ndoPos < _glob.cardMax)) {
      switch(true) {
        case (ndoPos < 13): { // Spades
          let _suite = _glob.suites[Math.floor(ndoPos / 13)];

          _name = `${_glob.cnames[ndoPos]} of ${_suite}`;
          _symbl = `${_suite[0].toLowerCase()}${ndoPos < 10 ? "0" : ""}${ndoPos}`;
          break;
        }
        case (ndoPos < 26): { // Diamonds
          let _suite = _glob.suites[Math.floor(ndoPos / 13)]

          _name = `${_glob.cnames[ndoPos % _glob.cnames.length]} of ${_suite}`;
          _symbl = `${_suite[0].toLowerCase()}${ndoPos}`
          break;
        }
        case (ndoPos < 39): { // Clubs
          let rNamePos = (ndoPos % _glob.cnames.length) * -1;

          let _suite = _glob.suites[Math.floor(ndoPos / 13)]

          _name = `${_glob.cnames.slice(rNamePos - 1, rNamePos)} of ${_suite}`;
          _symbl = `${_suite[0].toLowerCase()}${ndoPos}`
          break;
        }
        case (ndoPos < 52): { // Hearts
          let rNamePos = (ndoPos % _glob.cnames.length) * -1;

          let _suite = _glob.suites[Math.floor(ndoPos / 13)]

          _name = `${_glob.cnames.slice(rNamePos - 1, rNamePos)} of ${_suite}`;
          _symbl = `${_suite[0].toLowerCase()}${ndoPos}`
          break;
        }
        default: _name = "A Card";
      }
    }

    return Object.freeze({
      spot: uiPos,
      title: `${_glob.ctitlePrefix} ${uiPos}: ${_name}`,
      desc: `${_glob.cdescPrefix} ${uiPos}`,
      symbolRef: `#${_symbl}`
    });
  };

  return Object.freeze({
    getCard: generate_card_intri
  });
};


export default makeDealerHand;
export const debugName = 'pcs:hand:dealer';
