// jsDoc or (fb:meta)flow

/**
 * @typedef {Object} MiscHand
 *
 * Handles various tasks
 *
 * @property {function(string, string, string)} startAfter
 * @property {function(string, string)} afterStart
 * @property {boolean} yapFriendly
 */

/**
 * @typedef {Object} Turntable
 *
 * Component for card turntable/lazy-suzan/carousel
 *
 *    <turntable>
 *      <off /> <- close btn
 *      <pickup /> <- main view
 *      <cueLever> <- controls
 *        <cuePrevious /> <- back one
 *        <cueNext /> <- forward one
 *      </cueLever>
 *    </turntable>
 *
 * @property {boolean} isOpen
 * @property {function(ToggleEvent)} _tidy
 * @property {function(PointerEvent)} loadTurntable
 * @property {function(PointerEvent)} spinTurntable
 */

/**
 * @typedef {Object} Tableau
 *
 * Component for cards
 *
 *    <tableau>
 *      <card />
 *      .
 *      . <- (1-52)
 *      .
 *    </tableau>
 *
 * @property {[number]} currentOrder
 */

/**
 * @typedef {Object} Ribbon
 * 
 * Component for controls
 *    <ribbon>
 *      <claw /> <- grab cards for image or text download
 *      <brush /> <- changing background color
 *    </ribbon>
 * 
 * @property {string} lastPaste
 * @property {string} lastRender 
 */

/**
 * @typedef {Object} PCSLattice
 *
 * Layout for main screen
 *
 *    <lattice>
 *    	<panel /> <- controls
 *      <content /> <- view
 *      <hud /> <- popover
 *    </lattice>
 *
 * @property {Turntable} pcsHUD
 */


export const debugName = "pcs:part:types";
