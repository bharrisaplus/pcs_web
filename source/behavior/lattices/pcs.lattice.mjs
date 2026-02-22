import getTurntable from '../parts/turntable.part.mjs';

/**
 * @import {PCSLattice} from "../_meta/_typedefs.mjs"
 */

/**
 * @param  {string} turntableID The popover element - {@link CSSStyleRule.selectorText}
 *
 * @return {PCSLattice}
 */
const makePCSLattice = (turntableID) => {
  const $hud = getTurntable(turntableID);

  return Object.freeze({
    pcsHUD: $hud
  });
};


export default makePCSLattice;
export const debugName = "pcs:lattice:pcs";
