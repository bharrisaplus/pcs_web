
/**
 * @import {CSSelector, PCSEvent, Part, CardIntri} from "../_meta/_typedefs.mjs"
 */

import { default as _g } from "../_meta/_glods.mjs";


const
  turntableAbortController = new AbortController(),
  {signal: turntableAbortSignal} = turntableAbortController;


/**
 * @param  {CSSelector} containerID - {@link CSSStyleRule.selectorText}
 *
 * @return {Readonly<Part.Turntable>} a card closeup popover - {@link Part.Turntable}
 */
const makeTurntablePart = (containerID) => {
  let
    _tccount = 0,
    _tidyTimeout;

  const
    containerName = containerID.split('#').join(''),

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


  /** @param  {ToggleEvent} _toggleEvt */
  const _tidy = (_toggleEvt) => {
    if (_toggleEvt.oldState === 'open' && _toggleEvt.newState === 'closed') {
      console.info("closing turntable");
      $pickup.removeAttribute('data-spot');
      $pickup.removeAttribute('data-oglo');
      $pickup.querySelector('title').textContent = _g.pcs_cardTitle;
      $pickup.querySelector('desc').textContent = _g.pcs_cardDesc;

      _tidyTimeout = window.setTimeout(() => {
        $pickup.querySelector('use').removeAttribute('href');
        $cueNext.disabled = true;
        $cuePrevious.disabled = true;
      }, 700);
    } else if (_toggleEvt.oldState === 'closed' && _toggleEvt.newState === 'open') {
      console.info("opening turntable");
    }
  };


  /**
   * @param  {CardIntri} _updateInfo
   *
   * @returns {boolean}
   */
  const _update = (_updateInfo) => {
    let result;

    if (_updateInfo.oglo <= -1 || _updateInfo.oglo >= _g.c_Max) { result = false; }
    if (_updateInfo.spot <= -1 || _updateInfo.spot >= _g.c_Max) { result = false; }

    $pickup.setAttribute('data-spot', _updateInfo.spot);
    $pickup.setAttribute('data-oglo', _updateInfo.oglo);
    $pickup.querySelector('use').setAttribute('href', _updateInfo.symbolRef);
    $pickup.querySelector('title').textContent = _updateInfo.title;
    $pickup.querySelector('desc').textContent = _updateInfo.desc;

    $cuePrevious.disabled = _updateInfo.spot == 0;
    $cueNext.disabled = _updateInfo.spot == _g.c_Max - 1;

    console.info(`loading turntable for ${_updateInfo.title}`);
    result = true

    return result;
  };


  /** @param  {PointerEvent} _clickEvt */
  const _determine_followup = (_clickEvt) => {
    let
      direction,
      $scratcher;

    if (!$container.matches(':popover-open')) { return; }

    if (_clickEvt.target == $cueNext) {
      direction = "nxt";
      $scratcher = $cueNext;
    } else if (_clickEvt.target == $cuePrevious) {
      direction = "prv";
      $scratcher = $cuePrevious;
    }

    if (!direction || !$scratcher) { return; }

    /** @type {PCSEvent} */
    const scrtchEvt = new CustomEvent(_g.notices.scratch, {
      detail: {
        msg: direction,
        $dispatcher: $scratcher
      }
    });

    document.querySelector(`#${_g.appID}`).dispatchEvent(scrtchEvt);
  };


  /** @param {CardIntri} pickupInfo */
  const set_pickup = (pickupInfo) => {
    if ($container.matches(':popover-open')) { return; }

    window.clearTimeout(_tidyTimeout);

    if(_update(pickupInfo)) {
      $container.showPopover();
    }
  };


  /** @param  {CardIntri} _cueInfo */
  const move_arm = (cueInfo) => {
    if (!$container.matches(':popover-open')) { return; }

    _update(cueInfo);
  };


  $container.setAttribute('popover', 'manual'); // only close via $turnOff
  $container.addEventListener('beforetoggle', _tidy, {signal: turntableAbortSignal});
  $cueNext.addEventListener('click', _determine_followup, {signal: turntableAbortSignal});
  $cuePrevious.addEventListener('click', _determine_followup, {signal: turntableAbortSignal});

  $turnOff.addEventListener("click", () => {
    $container.hidePopover();
  }, {signal: turntableAbortSignal});

  document.querySelector('#title-marquee')?.addEventListener('click', () => {
    if (_tccount++ < 7) { return; }

    _tccount = 0;
    $cuePrevious.disabled = true;
    $cueNext.disabled = true;
    $pickup.querySelector('use').setAttribute('href', _g.pcs_cardRef);
    $container.showPopover();
  }, {signal: turntableAbortSignal});


  return Object.freeze({
    loadTurntable: set_pickup,
    spinTurntable: move_arm,
    // Computed-s
    get isOpen () {
      return $container.matches(':popover-open');
    },

    get cursor () {
      return [Number.parseInt($pickup.dataset.spot), Number.parseInt($pickup.dataset.oglo)];
    },

    get nextBtn () {
      return `${containerID} .${$cueNext.className.split(" ").join('.')}`;
    },

    get prevBtn () {
      return `${containerID} .${$cuePrevious.className.split(" ").join('.')}`;
    }
  });
};

/**
 * main Turntable instance
 * @type {Part.Turntable}
 */
let reuseablePart;

/**
 * Ensure single turntable per page but allow reuse
 * @param {string} getTurntableContainerID - {@link CSSStyleRule.selectorText}
 *
 * @returns {Readonly<Part.Turntable>} fresh Turntable for the page - {@link Part.Turntable}
 */
const rinseRepeatTurntable = (getTurntableContainerID) => {
  if (!reuseablePart) {
    reuseablePart = makeTurntablePart(getTurntableContainerID);
  } else {
    turntableAbortController.abort();
    reuseablePart = makeTurntablePart(getTurntableContainerID);
  }

  return reuseablePart;
};


export default rinseRepeatTurntable;
export const debugName = "pcs:part:turntable";
