
/**
 * @import {Turntable} from "../_meta/_typedefs.mjs"
 */


/**
 * @param  {string} containerID - {@link CSSStyleRule.selectorText}
 *
 * @return {Turntable}
 */
const makeTurntable = (containerID) => {
	let _tccount = 0;

  const containerName = containerID.split('#').join('');

	const
		$container = document.querySelector(containerID),
		$pickup = $container.querySelector(`.${containerName}-pickup`),
		$turnOff = $container.querySelector(`.${containerName}-off`),
		$cuePrevious = $container.querySelector(`.${containerName}-cue-lever-regression`),
		$cueNext = $container.querySelector(`.${containerName}-cue-lever-progression`);

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
   */
  const set_pickup = (clickEvt) => {
    if ($container.matches(':popover-open')) {
      const $pickupItem = clickEvt.target;

      if ($pickupItem) {
        console.log(`loading turntable for ${$pickupItem.getAttribute('aria-description')}`);
      }
    }
  };

  /**
   * Update item in the view
   * @param  {PointerEvent} clickEvt
   */
  const _move_arm = (_clickEvt) => {
    if ($container.matches(':popover-open')) {
      const moveBack = _clickEvt.target === $cuePrevious;

      if (moveBack) {
        console.log("updating turntable to previous");
      } else {
        console.log("updating turntable to next");
      }
    }
  };


  $container.setAttribute('popover', 'manual'); // only close via turnOff
  $container.addEventListener('beforetoggle', _tidy);
  $turnOff.addEventListener("click", () => $container.hidePopover());
  $cueNext.addEventListener('click', () => _move_arm);
  $cueNext.addEventListener('click', () => _move_arm);

  document.querySelector('#title-marquee')?.addEventListener('click', () => {
    if (_tccount++ >= 7) {
      _tccount = 0;
      $cuePrevious.disabled = true;
      $cueNext.disabled = true;
      $pickup.querySelector('use').setAttribute('href', '#pcs-card');
      $container.showPopover();
    }
  });


	return Object.freeze({
		loadTurntable: set_pickup,
		// Computed-s
		get isOpen() {
			return $container.matches(':popover-open');
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
 * @param {string} getTurntableContainerID - {@link CSSStyleRule.selectorText}
 *
 * @returns {Turntable}
 */
const getTurntable = (getTurntableContainerID) => {
	if (!singleTurntable) {
		singleTurntable = makeTurntable(getTurntableContainerID);
	}

	return singleTurntable;
};

export default getTurntable;
export const debugName = "pcs:part:turntable";
