
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
    /** @type {HTMLElement} */
    $container = document.querySelector(containerID),
    /** @type {HTMLElement} */
    $pickup = $container.querySelector(`.${containerName}-pickup`),
    /** @type {HTMLButtonElement} */
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
      $pickup.setAttribute('data-cid', 54);
      $pickup.querySelector('use').setAttribute('href', _glods.pcscardRef);
      $pickup.querySelector('title').textContent = _glods.pcscardTitle;
      $pickup.querySelector('desc').textContent = _glods.pcsCardDesc;
      $cueNext.disabled = true;
      $cuePrevious.disabled = true;
    } else if (_toggleEvt.oldState === 'closed' && _toggleEvt.newState === 'open') {
      console.log("opening turntable");
      $cueNext.disabled = true;
      $cuePrevious.disabled = true;
    }
  };


  /**
   * Place new item in the view
   * @param  {CardIntri} pickupInfo
   */
  const set_pickup = (pickupInfo) => {
    if (!$container.matches(':popover-open')) {
      $pickup.setAttribute('data-cid', pickupInfo.spot);
      $pickup.querySelector('use').setAttribute('href', pickupInfo.symbolRef);
      $pickup.querySelector('title').textContent = pickupInfo.title;
      $pickup.querySelector('desc').textContent = pickupInfo.desc;

      if (pickupInfo.spot == 0) {
        $cuePrevious.disabled = true;
      } else if (pickupInfo.spot == _glods.cardMax) {
        $cueNext.disabled = true;
      }

      $container.showPopover();
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
    get cursor() {
      return Number.parseInt($pickup.dataset.cid) - 1;
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
