
/**
 * @import {CardIntri, Hand} from '../_meta/_typedefs.mjs'
 */

import { default as _g } from '../_meta/_glods.mjs';
import { default as appLogger } from './scribe.hand.mjs';


/** @type {dealerFingers["jitter_bugs"]} */
const jitter_bugs = (max = _g.c_Max, uBound = 13) => {
  let
    /** @type {Uint8ClampedArray<ArrayBuffer>} */
    bunchaNums,
    /** @type {Uint8ClampedArray<ArrayBuffer>} */
    someNums,
    /** @type {Uint8ClampedArray<ArrayBuffer>} */
    moreNums,
    /** @type {Uint8ClampedArray<ArrayBuffer>} */
    otherNums,
    /** @type {number[]} */
    result;


  if (!Number.isInteger(max)|| !Number.isInteger(uBound)) {
    result = [Math.random() * _g.c_Max];
    return result;
  }

  result = Array(uBound).fill(0);
  bunchaNums = new Uint8ClampedArray(Math.ceil(uBound / 4)),
  someNums = new Uint8ClampedArray(Math.ceil(uBound / 4)),
  moreNums = new Uint8ClampedArray(Math.ceil(uBound / 4)),
  otherNums = new Uint8ClampedArray(Math.ceil(uBound / 4));

  globalThis.crypto.getRandomValues(bunchaNums);
  globalThis.crypto.getRandomValues(someNums);
  globalThis.crypto.getRandomValues(moreNums);
  globalThis.crypto.getRandomValues(otherNums);

  result = Array.from([bunchaNums, someNums, moreNums, otherNums], (_nums) => _nums.values().toArray() )
    .flat()
    .filter((_num) => { return _num <= max || Math.floor(_num / 10) <= max })
    .map((_num) => { return _num <= max ? _num : Math.floor(_num / max) });

  result = (new Set(result)).values().toArray();

  return result.slice(0, uBound);
};

/** @type {dealerFingers["ndpf"]} */
const ndpf = (/** @type {number[]} */ cardList, /** @type {number[]} */ lucky_nums ) => {
  /** @type {number[]} */
  let result;

  if (!Array.isArray(lucky_nums) || !Array.isArray(cardList)) {
    result = [];
    return result;
  }

  // TODO: swap positions of cards at lucky_nums
  result = Array.from(cardList);
  result.push(result.shift());

  return result;
};


/** @return {Hand.Dealer} a helper for cards - {@link Hand.Dealer} */
const makeDealerHand = () => {
  /**
   * @param  {number} curPos from the list as it stands
   * @param  {number} ndoPos usually the 'oid' data attribute - {@link HTMLElement.dataset}
   *
   * @return {Readonly<CardIntri>} a card - {@link CardIntri}
   * @see Hand.Dealer#getCard
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
        default: appLogger.issuelog("Can't create card for position", {curPos, ndoPos}, null, false);
      }

      result = Object.freeze({
        oglo: ndoPos,
        spot: curPos,
        title: `${_g.c_TitlePrefix} ${curPos + 1}: ${_name}`,
        desc: `${_g.c_DescPrefix} ${curPos + 1}`,
        symbolRef: `#${_symbl}`
      });
    } else {
      appLogger.issuelog("Can't create card for position", {curPos, ndoPos}, null, false);
      result = Object.freeze(result);
    }

    return result;
  };


  /**
   * @param  {number[]} cardList
   * @param  {number[]} positionList
   *
   * @return {number[]}
   * @see Hand.Dealer#mixUp
   */
  const pcs_shuffle = (cardList, positionList) => {
    let
      card_sample,
      position_sample,
      result;

    if (cardList.length > 0 && cardList.length <= _g.c_Max && cardList.length === positionList.length) {
      result = Array(cardList.length).fill(0);
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
      appLogger.issuelog("Can't shuffle mismatched array size", {cardList, positionList}, null, false);
      result = [];
    }

    return result;
  };


  return Object.freeze({
    getCard: generate_card_intri,
    mixUp: pcs_shuffle
  });
};


export default makeDealerHand;
/** @return {dealerFingers} */
export const getFingers = () => Object.freeze({ jitter_bugs, ndpf });
export const debugName = 'pcs:hand:dealer';

/**
 * @typedef {Object} dealerFingers
 * @property {function(number=, number=) :number[]} jitter_bugs
 * @property {function(number[], number[]) :number[]} ndpf
 */
