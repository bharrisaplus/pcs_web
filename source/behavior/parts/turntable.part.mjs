
/**
 * @import {Turntable, CardIntri} from "../_meta/_typedefs.mjs"
 */

import _glods from "../_meta/_glods.mjs";


/**
 * @param  {string} containerID - {@link CSSStyleRule.selectorText}
 *
 * @return {Turntable}
 */
const makePart = (containerID) => {
  let _tccount = 0;

  const containerName = containerID.split('#').join('');

  const
    $container = document.querySelector(containerID),
    $pickup = $container.querySelector(`.${containerName}-pickup`),
    $turnOff = $container.querySelector(`.${containerName}-off`),
    /** @type {HTMLButtonElement} */
    $cuePrevious = $container.querySelector(`.${containerName}-cue-lever-regression`),
    /** @type {HTMLButtonElement} */
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
   * @param  {CardIntri} pickupInfo
   */
  const set_pickup = (pickupInfo) => {
    if (!$container.matches(':popover-open')) {
      if (pickupInfo.currentPos == 0) {
        $cuePrevious.disabled = true;
      } else if (pickupInfo.currentPos == _glods.cardMax) {
        $cueNext.disabled = true;
      }

      console.info(`loading turntable for ${pickupInfo.title}`);
    }
  };

  /**
   * Update item in the view
   * @param  {boolean} backDirection
   * @param  {CardIntri} _cueInfo
   */
  const _move_arm = (backDirection, _cueInfo) => {
    if ($container.matches(':popover-open')) {
      if (backDirection) {
        $cueNext.disabled = false;
        console.log("rotating turntable to previous");
      } else {
        $cuePrevious.disabled = false;
        console.log("rotating turntable to next");
      }

      set_pickup(_cueInfo);
    }
  };


  $container.setAttribute('popover', 'manual'); // only close via $turnOff
  $container.addEventListener('beforetoggle', _tidy);
  $turnOff.addEventListener("click", () => $container.hidePopover());

  document.querySelector('#title-marquee')?.addEventListener('click', () => {
    if (_tccount++ >= 7) {
      _tccount = 0;
      $cuePrevious.disabled = true;
      $cueNext.disabled = true;
      $pickup.querySelector('use').setAttribute('href', _glods.pcscardRef);
      $container.showPopover();
    }
  });


  return Object.freeze({
    loadTurntable: set_pickup,
    spinTurntable: _move_arm,
    // Computed-s
    get isOpen() {
      return $container.matches(':popover-open');
    },
    /** @type {string} - {@link CSSStyleRule.selectorText} */
    get nextBtn() {
      return `${containerID} .${$cueNext.getAttribute('class').join('.')}`;
    },
    /** @type {string} - {@link CSSStyleRule.selectorText} */
    get prevBtn() {
      return `${containerID} .${$cuePrevious.getAttribute('class').join('.')}`;
    }
  });
};

/**
 * main Turntable instance
 * @type {Turntable}
 */
let singlePart = null;

/**
 * Ensure single turntable per page
 * @param {string} getTurntableContainerID - {@link CSSStyleRule.selectorText}
 *
 * @returns {Turntable}
 */
const getPart = (getTurntableContainerID) => {
  if (!singlePart) {
    singlePart = makePart(getTurntableContainerID);
  }

  return singlePart;
};

export default getPart;
export const debugName = "pcs:part:turntable";
