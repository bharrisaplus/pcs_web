/**
 * @import {Tableau} from "./tableau.part.mjs"
 */


/**
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
 * @typedef {Object} Turntable
 * @property {boolean} isOpen
 * @property {function(ToggleEvent)} _tidy
 * @property {function(PointerEvent, Tableau)} loadTurntable
 * @property {function(PointerEvent, Tableau)} spinTurntable
 */

/**
 * @param  {string} primarySelector - {@link CSSStyleRule.selectorText}
 *
 * @return {Turntable}
 */
const makeTurntable = (primarySelector) => {
	let isOpen = false;

	const
		$turntable = document.querySelector(primarySelector),
		$pickup = $turntable.querySelector(`${primarySelector}-pickup`),
		$turnOff = $turntable.querySelector(`${primarySelector}-off`),
		cueLeverPrefix = `${primarySelector}-cue-lever`,
		$cuePrevious = $turntable.querySelector(`${cueLeverPrefix}-regression`),
		$cueNext = $turntable.querySelector(`${cueLeverPrefix}-progression`);


  /**
   * Clean up between state changes
   * @param  {ToggleEvent} _toggleEvt
   */
  const _tidy = (_toggleEvt) => {
    if (_toggleEvt.oldState === 'open' && _toggleEvt.newState === 'closed') {
      console.log("closing turntable");
    } else if (_toggleEvt.oldState === 'closed' && _toggleEvt.newState === 'open') {
      console.log("opening turntable");
    }
  };

  /**
   * Place new item in the view
   * @param  {PointerEvent} clickEvt
   * @param  {Tableau} cardList
   */
  const set_pickup = (clickEvt, cardList) => {
    if ($turntable.matches(':popover-open')) {
      console.log("turntable open");
    }
  };

  /**
   * Update item in the view
   * @param  {PointerEvent} clickEvt
   * @param  {Tableau} cardList
   */
  const move_arm = (clickEvt, cardList) => {
    if ($turntable.matches(':popover-open')) {
      console.log("turntable updating");
    }
  };

	return Object.freeze({
		loadTurntable: set_pickup,
		spinTurntable: move_arm,
		// Computed-s
		get isOpen() {
			return $turntable.matches(':popover-open');
		}
	});
};

/**
 * main Turntable instance
 * @type {Turntable}
 */
let singleTurntable = null;

/**
 * Ensure single turntable per page
 * @param {string} turntableSelector - {@link CSSStyleRule.selectorText}
 *
 * @returns {Turntable}
 */
const getTurntable = (turntableSelector) => {
	if (!singleTurntable) {
		singleTurntable = makeTurntable(turntableSelector);
	}

	return singleTurntable;
};

export default getTurntable;
export const debugName = "pcs:part:turntable";
