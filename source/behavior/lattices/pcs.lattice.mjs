import getTurntable from '../parts/turntable.part.mjs';

/**
 * @import {Turntable} from "../parts/turntable.part.mjs"
 */

/**
 * Layout for app
 *
 *    <lattice>
 *    	<panel /> <- controls
 *      <content /> <- view
 *      <hud /> <- popover
 *    </lattice>
 *
 * @typedef {Object} PCSLattice
 * @property {Turntable} pcsHUD
 */

/**
 * @param  {string} hudID - {@link CSSStyleRule.selectorText}
 *
 * @return {PCSLattice}
 */
const makePCSLattice = (hudID) => {
	const $hud = getTurntable(hudID);

	return Object.freeze({
		pcsHUD: $hud
	});
};


export default makePCSLattice;
export const debugName = "pcs:lattice:pcs";
