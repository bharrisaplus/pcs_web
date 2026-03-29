
/**
 * @import {CSSelector, CardIntri, Hand} from '../_meta/_typedefs.mjs'
 */

import { default as _g } from '../_meta/_glods.mjs';
import { default as appLogger } from './scribe.hand.mjs';


/** @return {Readonly<Hand.Dealer>} a helper for cards */
const makeDealerHand = () => {
  /**
   * @param  {number} curPos from the list as it stands
   * @param  {number} ndoPos usually the 'oid' data attribute - {@link HTMLElement.dataset}
   *
   * @return {Readonly<CardIntri>} a card - {@link CardIntri}
   */
  const generate_card_intri = (curPos, ndoPos) => {
    let
      _name = "A Card",
      _symbl = "",
      /** @type {CardIntri} */
      result = { oglo: ndoPos, spot: curPos, title: '', desc: '', symbolRef: '' };

    if ((curPos > -1 && curPos < _g.c_Max) && (ndoPos > -1 && ndoPos < _g.c_Max)) {
      let _suite = _g.c_SuiteList[Math.floor(ndoPos / 13)];

      switch(true) {
        case (ndoPos < 13): { // Spades
          _name = `${_g.c_NameList[ndoPos]} of ${_suite}`;
          _symbl = `${_suite[0].toLowerCase()}${ndoPos < 10 ? "0" : ""}${ndoPos}`;
          break;
        }
        case (ndoPos < 26): { // Diamonds
          _name = `${_g.c_NameList[ndoPos % _g.c_NameList.length]} of ${_suite}`;
          _symbl = `${_suite[0].toLowerCase()}${ndoPos}`;
          break;
        }
        case (ndoPos < 39): { // Clubs
          let
            _rStartIdx = (ndoPos % _g.c_NameList.length) * -1,
            _rEndIdx = Object.is(_rStartIdx, -0) ? _g.c_NameList.length : _rStartIdx;

          _name = `${_g.c_NameList.slice(_rStartIdx - 1, _rEndIdx)[0]} of ${_suite}`;
          _symbl = `${_suite[0].toLowerCase()}${ndoPos}`;
          break;
        }
        case (ndoPos < 52): { // Hearts
          let
            _rStartIdx = (ndoPos % _g.c_NameList.length) * -1,
            _rEndIdx = Object.is(_rStartIdx, -0) ? _g.c_NameList.length : _rStartIdx;

          _name = `${_g.c_NameList.slice(_rStartIdx - 1, _rEndIdx)[0]} of ${_suite}`;
          _symbl = `${_suite[0].toLowerCase()}${ndoPos}`;
          break;
        }
        default: appLogger.issuelog("Can't create card for position", {curPos, ndoPos}, false, false);
      }

      result = Object.freeze({
        oglo: ndoPos,
        spot: curPos,
        title: `${_g.c_TitlePrefix} ${curPos + 1}: ${_name}`,
        desc: `${_g.c_DescPrefix} ${curPos + 1}`,
        symbolRef: `#${_symbl}`
      });
    } else {
      appLogger.issuelog("Can't create card for position", {curPos, ndoPos}, false, false);
      result = Object.freeze(result);
    }

    return result;
  };


  /**
   * @param  {Uint8Array} cardList
   * @param  {Uint8Array} positionList
   *
   * @return {Uint8Array}
   */
  const pcs_shuffle = (cardList, positionList) => {
    let
      card_sample,
      position_sample;

    const result = Uint8Array.from({length: cardList.length});

    if (result.length > 0 && result.length <= _g.c_Max && result.length === positionList.length) {
      card_sample = chance.pickset(cardList, cardList.length);
      position_sample = chance.pickset(positionList, positionList.length);

      for (let _ = 0; _ < positionList.length; _++) {
        const
          _card_idx = Math.floor(Math.random() * card_sample.length),
          _pos_idx = Math.floor(Math.random() * position_sample.length);

        result[position_sample[_pos_idx]] = card_sample[_card_idx];

        card_sample.splice(_card_idx, 1);
        position_sample.splice(_pos_idx, 1);
      }
    } else {
      appLogger.issuelog("Can't shuffle mismatched array size", {cardList, positionList}, false, false);
    }

    return result;
  };


  return Object.freeze({
    getCard: generate_card_intri,
    mixUp: pcs_shuffle
  });
};


export default makeDealerHand;
export const debugName = 'pcs:hand:dealer';
