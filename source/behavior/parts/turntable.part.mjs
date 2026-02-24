
/**
 * @import {Part, CardIntri} from "../_meta/_typedefs.mjs"
 */

import _glods from "../_meta/_glods.mjs";


const
  turntableAbortController = new AbortController(),
  {signal: turntableAbortSignal} = turntableAbortController;


/**
 * @param  {string} containerID - {@link CSSStyleRule.selectorText}
 *
 * @return {Part.Turntable} a card closeup popover
 */
const makeTurntablePart = (containerID) => {
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
    }
  };

  /**
   * Place new item in the view
   * @param  {CardIntri} pickupInfo
   */
  const _update_inner = (_updateInfo) => {
    if (_updateInfo.spot > 0 && _updateInfo.spot <= _glods.cardMax) {
      $pickup.setAttribute('data-cid', _updateInfo.spot);
      $pickup.querySelector('use').setAttribute('href', _updateInfo.symbolRef);
      $pickup.querySelector('title').textContent = _updateInfo.title;
      $pickup.querySelector('desc').textContent = _updateInfo.desc;

      $cuePrevious.disabled = _updateInfo.spot == 1;
      $cueNext.disabled = _updateInfo.spot == _glods.cardMax;

      console.info(`loading turntable for ${_updateInfo.title}`);
    }
  };


  /**
   * Called when opening
   * @param {CardIntri} pickupInfo
   */
  const set_pickup = (pickupInfo) => {
    if (!$container.matches(':popover-open')) {
      _update_inner(pickupInfo);
      $container.showPopover();
    }
  };


  /**
   * Called when moving between items
   * @param  {CardIntri} _cueInfo
   * @param  {boolean} backDirection
   */
  const move_arm = (cueInfo, backDirection) => {
    if ($container.matches(':popover-open')) {
      _update_inner(cueInfo);

      backDirection ? $cueNext.disabled = false : $cuePrevious.disabled = false;

      console.log(`rotating turntable to ${backDirection ? "previous" : "next"}`);
    }
  };


  $container.setAttribute('popover', 'manual'); // only close via $turnOff
  $container.addEventListener('beforetoggle', _tidy, {signal: turntableAbortSignal});
  $turnOff.addEventListener("click", () => {
    $container.hidePopover();
  }, {signal: turntableAbortSignal});

  document.querySelector('#title-marquee')?.addEventListener('click', () => {
    if (_tccount++ >= 7) {
      _tccount = 0;
      $cuePrevious.disabled = true;
      $cueNext.disabled = true;
      $pickup.querySelector('use').setAttribute('href', _glods.pcscardRef);
      $container.showPopover();
    }
  }, {signal: turntableAbortSignal});


  return Object.freeze({
    loadTurntable: set_pickup,
    spinTurntable: move_arm,
    // Computed-s
    get isOpen() {
      return $container.matches(':popover-open');
    },
    get cursor() {
      return $pickup.dataset.cid ? Number.parseInt($pickup.dataset.cid) - 1 : 53;
    },
    /** @type {string} - {@link CSSStyleRule.selectorText} */
    get nextBtn() {
      return `${containerID} .${$cueNext.className.split(" ").join('.')}`;
    },
    /** @type {string} - {@link CSSStyleRule.selectorText} */
    get prevBtn() {
      return `${containerID} .${$cuePrevious.className.split(" ").join('.')}`;
    }
  });
};

/**
 * main Turntable instance
 * @type {Hand.Turntable}
 */
let singlePart = null;

/**
 * Ensure single turntable per page
 * @param {string} getTurntableContainerID - {@link CSSStyleRule.selectorText}
 *
 * @returns {Hand.Turntable} fresh Turntable for the page
 */
const rinseRepeat = (getTurntableContainerID) => {
  if (!singlePart) {
    singlePart = makeTurntablePart(getTurntableContainerID);
  } else {
    turntableAbortController.abort();
    singlePart = makeTurntablePart(getTurntableContainerID);
  }

  return singlePart;
};

export default rinseRepeat;
export const debugName = "pcs:part:turntable";
