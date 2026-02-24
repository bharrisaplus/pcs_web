
/**
 * @import {CSSelector, CardIntri, Hand} from '../_meta/_typedefs.mjs'
 */

import { default as _g } from '../_meta/_glods.mjs';


/**
 * @return {Readonly<Hand.Dealer>} a helper for cards
 */
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

    if ((_spot > -1 && _spot < _g.cardMax) && (_oglo > -1 && _oglo < _g.cardMax)) {
      switch(true) {
        case (_oglo < 13): { // Spades
          let _suite = _g.suites[Math.floor(_oglo / 13)];

          _name = `${_g.cnames[_oglo]} of ${_suite}`;
          _symbl = `${_suite[0].toLowerCase()}${_oglo < 10 ? "0" : ""}${_oglo}`;
          break;
        }
        case (_oglo < 26): { // Diamonds
          let _suite = _g.suites[Math.floor(_oglo / 13)]

          _name = `${_g.cnames[_oglo % _g.cnames.length]} of ${_suite}`;
          _symbl = `${_suite[0].toLowerCase()}${_oglo}`
          break;
        }
        case (_oglo < 39): { // Clubs
          let rNamePos = (_oglo % _g.cnames.length) * -1;

          let _suite = _g.suites[Math.floor(_oglo / 13)]

          _name = `${_g.cnames.slice(rNamePos - 1, rNamePos)} of ${_suite}`;
          _symbl = `${_suite[0].toLowerCase()}${_oglo}`
          break;
        }
        case (_oglo < 52): { // Hearts
          let rNamePos = (_oglo % _g.cnames.length) * -1;

          let _suite = _g.suites[Math.floor(_oglo / 13)]

          _name = `${_g.cnames.slice(rNamePos - 1, rNamePos)} of ${_suite}`;
          _symbl = `${_suite[0].toLowerCase()}${_oglo}`
          break;
        }
        default: console.warn("Card index outside range");
      }
    }

    return Object.freeze({
      oglo: _oglo,
      spot: _spot,
      title: `${_g.ctitlePrefix} ${_spot + 1}: ${_name}`,
      desc: `${_g.cdescPrefix} ${_spot + 1}`,
      symbolRef: `#${_symbl}`
    });
  };

  return Object.freeze({
    getCard: generate_card_intri
  });
};


export default makeDealerHand;
export const debugName = 'pcs:hand:dealer';
