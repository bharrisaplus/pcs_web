/** @globals document, AbortController, CustomEvent, window */

/** @import {CSSelector, PCSEvent, Part, CardIntri} from "../_meta/_typedefs.mjs" */

import { default as _g } from "../_meta/_glods.mjs";
import { default as logger } from "../hands/scribe.hand.mjs";


/**
 * @param  {CSSelector} containerID
 * @param  {AbortController} eventCancel
 *
 * @return {Part.Turntable} a popover for card closeup - {@link Part.Turntable}
 */
const makeTurntablePart = (containerID, eventCancel) => {
  let
    _tccount = 0,
    /** @type {Number} id for timer {@link window.setTimeout}  */
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
      logger.devlog("closing turntable");
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
      logger.devlog("opening turntable");
    }
  };


  /**
   * @param  {CardIntri} _updateInfo
   *
   * @returns {boolean}
   */
  const _update = (_updateInfo) => {
    let result = false;

    if (_updateInfo.oglo <= -1 || _updateInfo.oglo >= _g.c_Max) { return result; }
    if (_updateInfo.spot <= -1 || _updateInfo.spot >= _g.c_Max) { return result; }

    $pickup.setAttribute('data-spot', _updateInfo.spot.toString());
    $pickup.setAttribute('data-oglo', _updateInfo.oglo.toString());
    $pickup.querySelector('use').setAttribute('href', _updateInfo.symbolRef);
    $pickup.querySelector('title').textContent = _updateInfo.title;
    $pickup.querySelector('desc').textContent = _updateInfo.desc;

    $cuePrevious.disabled = _updateInfo.spot == 0;
    $cueNext.disabled = _updateInfo.spot == _g.c_Max - 1;

    logger.devlog(`loading turntable for ${_updateInfo.title}`);
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


  /** @type {Part.Turntable["loadTurntable"]} */
  const set_pickup = (pickupInfo) => {
    if ($container.matches(':popover-open')) { return; }

    window.clearTimeout(_tidyTimeout);

    if(_update(pickupInfo)) {
      $container.showPopover();
    }
  };


  /** @type {Part.Turntable["spinTurntable"]} */
  const move_arm = (cueInfo) => {
    if (!$container.matches(':popover-open')) { return; }

    _update(cueInfo);
  };


  $container.setAttribute('popover', 'manual'); // only close via $turnOff
  $container.addEventListener('beforetoggle', _tidy, {signal: eventCancel.signal});
  $cueNext.addEventListener('click', _determine_followup, {signal: eventCancel.signal});
  $cuePrevious.addEventListener('click', _determine_followup, {signal: eventCancel.signal});

  $turnOff.addEventListener("click", () => {
    $container.hidePopover();
  }, {signal: eventCancel.signal});

  document.querySelector('#title-marquee')?.addEventListener('click', () => {
    if (_tccount++ < 7) { return; }

    _tccount = 0;
    $cuePrevious.disabled = true;
    $cueNext.disabled = true;
    $pickup.querySelector('use').setAttribute('href', _g.pcs_cardRef);
    $container.showPopover();
  }, {signal: eventCancel.signal});


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

let
  /** @type {Part.Turntable} */
  reuseablePart,
  /** @type {AbortController} */
  reuseableCancel;

/**
 * Ensure single turntable per page but allow recycling
 *
 * @param {CSSelector} getTurntableContainerID
 *
 * @returns {Part.Turntable} fresh Turntable for the page - {@link Part.Turntable}
 */
const rinseRepeatTurntable = (getTurntableContainerID) => {
  if (!reuseablePart) {
    reuseableCancel = new AbortController();
    reuseablePart = makeTurntablePart(getTurntableContainerID, reuseableCancel);
  } else {
    if (reuseableCancel) {
      reuseableCancel.abort();
    }

    reuseableCancel = new AbortController();
    reuseablePart = makeTurntablePart(getTurntableContainerID, reuseableCancel);
  }

  return reuseablePart;
};


export default rinseRepeatTurntable;
export const debugName = "pcs:part:turntable";
