
/**
 * @import {CSSelector, CardIntri, Hand} from '../_meta/_typedefs.mjs'
 */

import { default as _g } from '../_meta/_glods.mjs';


/** @return {Readonly<Hand.Dealer>} a helper for cards */
const makeDealerHand = () => {
  /**
   * @param  {number | string} curPos from the list as it stands
   * @param  {number | string} ndoPos usually the 'oid' data attribute - {@link HTMLElement.dataset}
   *
   * @return {Readonly<CardIntri>} a card - {@link CardIntri}
   */
  const generate_card_intri = (curPos, ndoPos) => {
    let _name = "A Card";
    /** @type {CSSelector} */
    let _symbl = "";

    const
      _spot = Number.parseInt(curPos),
      _oglo = Number.parseInt(ndoPos);

    if ((_spot > -1 && _spot < _g.c_Max) && (_oglo > -1 && _oglo < _g.c_Max)) {
      switch(true) {
        case (_oglo < 13): { // Spades
          let _suite = _g.c_SuiteList[Math.floor(_oglo / 13)];

          _name = `${_g.c_NameList[_oglo]} of ${_suite}`;
          _symbl = `${_suite[0].toLowerCase()}${_oglo < 10 ? "0" : ""}${_oglo}`;
          break;
        }
        case (_oglo < 26): { // Diamonds
          let _suite = _g.c_SuiteList[Math.floor(_oglo / 13)]

          _name = `${_g.c_NameList[_oglo % _g.c_NameList.length]} of ${_suite}`;
          _symbl = `${_suite[0].toLowerCase()}${_oglo}`
          break;
        }
        case (_oglo < 39): { // Clubs
          let rNamePos = (_oglo % _g.c_NameList.length) * -1;

          let _suite = _g.c_SuiteList[Math.floor(_oglo / 13)]

          _name = `${_g.c_NameList.slice(rNamePos - 1, rNamePos)} of ${_suite}`;
          _symbl = `${_suite[0].toLowerCase()}${_oglo}`
          break;
        }
        case (_oglo < 52): { // Hearts
          let rNamePos = (_oglo % _g.c_NameList.length) * -1;

          let _suite = _g.c_SuiteList[Math.floor(_oglo / 13)]

          _name = `${_g.c_NameList.slice(rNamePos - 1, rNamePos)} of ${_suite}`;
          _symbl = `${_suite[0].toLowerCase()}${_oglo}`
          break;
        }
        default: console.warn("Card index outside range");
      }
    }

    return Object.freeze({
      oglo: _oglo,
      spot: _spot,
      title: `${_g.c_TitlePrefix} ${_spot + 1}: ${_name}`,
      desc: `${_g.c_DescPrefix} ${_spot + 1}`,
      symbolRef: `#${_symbl}`
    });
  };


  /**
   * @param  {Uint8Array} cardList
   * @param  {Uint8Array} positionList
   *
   * @return {Uint8Array}
   */
  const pcs_shuffle = (cardList, positionList) => {
    const
      card_sample = chance.pickset(cardList, cardList.length),
      position_sample = chance.pickset(positionList, positionList.length);

    const result = Uint8Array.from({length: cardList.length});

    for (let _ = 0; _ < positionList.length; _++) {
      const
        _card_idx = Math.floor(Math.random() * card_sample.length),
        _pos_idx = Math.floor(Math.random() * position_sample.length);

      result[position_sample[_pos_idx]] = card_sample[_card_idx];

      card_sample.splice(_card_idx, 1);
      position_sample.splice(_pos_idx, 1);
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
