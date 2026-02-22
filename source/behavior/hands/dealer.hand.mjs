
/**
 * @import {DealerHand, DeckBank} from '../_meta/_typedefs.mjs'
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
   * @param  {number} card_id usually the 'oid' data attribute - {@link HTMLElement.dataset}
   * @param  {DeckBank} deckVault [description]
   *
   * @return {Map.<string, string>}
   */
  const generate_card_title_and_desc = (card_id, deckVault) => {
    const
      result = {"title": "", "desc": ""},
      uiPos = deckVault.cards.indexOf(card_id) + 1,
      ndoPos = deckVault.ndoCards.indexOf(card_id);

    if ((uiPos > 0 && uiPos < _glob.cardMax) && (ndoPos > -1 && ndoPos < _glob.cardMax)) {
      let _name = "";

      switch(true) {
        case (ndoPos < 13): _name = `${_glob.cnames[ndoPos]} of ${_glob.suites[0]}`; break;
        case (ndoPos < 26): _name = `${_glob.cnames[ndoPos % 13]} of ${_glob.suites[1]}`; break;
        case (ndoPos < 39): _name = `${_glob.cnames[ndoPos % 13]} of ${_glob.suites[2]}`; break;
        case (ndoPos < 52): _name = `${_glob.cnames[ndoPos % 13]} of ${_glob.suites[3]}`; break;
        default: _name = "A Card";
      }

      result.title = `${_glob.ctitlePrefix} ${uiPos}: ${_name}`;
      result.desc = `${_glob.cdescPrefix} ${uiPos}`;
    }

    return result;
  }

  return Object.freeze({
    posRelLabels: generate_card_title_and_desc
  });
};


export default makeDealerHand;
export const debugName = 'pcs:hand:dealer';
