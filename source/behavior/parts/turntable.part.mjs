
/**
 * @import {CSSelector, PCSEventOpts, PCSEvent, Part, CardIntri} from "../_meta/_typedefs.mjs"
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
   * @param  {ToggleEvent} _toggleEvt
   */
  const _tidy = (_toggleEvt) => {
    if (_toggleEvt.oldState === 'open' && _toggleEvt.newState === 'closed') {
      console.log("closing turntable");
      $pickup.setAttribute('data-cid', 54);
      $pickup.querySelector('use').setAttribute('href', _g.pcscardRef);
      $pickup.querySelector('title').textContent = _g.pcscardTitle;
      $pickup.querySelector('desc').textContent = _g.pcsCardDesc;
      $cueNext.disabled = true;
      $cuePrevious.disabled = true;
    } else if (_toggleEvt.oldState === 'closed' && _toggleEvt.newState === 'open') {
      console.log("opening turntable");
    }
  };

  /**
   * @param  {CardIntri} pickupInfo
   * @returns {boolean}
   */
  const _update = (_updateInfo) => {
    let result = false;

    if (
      _updateInfo.oglo > -1 || _updateInfo.oglo < _g.cardMax ||
      _updateInfo.spot > -1 || _updateInfo.spot < _g.cardMax
    ){
      $pickup.setAttribute('data-spot', _updateInfo.spot);
      $pickup.setAttribute('data-oglo', _updateInfo.oglo);
      $pickup.querySelector('use').setAttribute('href', _updateInfo.symbolRef);
      $pickup.querySelector('title').textContent = _updateInfo.title;
      $pickup.querySelector('desc').textContent = _updateInfo.desc;

      $cuePrevious.disabled = _updateInfo.spot <= 0;
      $cueNext.disabled = _updateInfo.spot >= _g.cardMax - 1;

      console.info(`loading turntable for ${_updateInfo.title}`);
      result = true
    }

    return result;
  };


  /**
   * @param {CardIntri} pickupInfo
   */
  const set_pickup = (pickupInfo) => {
    if (!$container.matches(':popover-open')) {
      if(_update(pickupInfo)) {
        $container.showPopover();
      }
    }
  };


  /**
   * @param  {PointerEvent} _clickEvent
   */
  const _itch = (_clickEvt) => {
    let
      itchID, itchSpot,
    /** @type {Element} */
      itch$dsptchr = null;

    if (_clickEvt.target == $cueNext) {
      itchID = Math.min(Number.parseInt($pickup.dataset.oglo), _g.cardMax) + 1;
      itchSpot = Math.min(Number.parseInt($pickup.dataset.spot), _g.cardMax) + 1;
      itch$dsptchr = $cueNext;
    } else if (_clickEvt.target == $cuePrevious) {
      itchID = Math.max(Number.parseInt($pickup.dataset.oglo), -1) - 1;
      itchSpot = Math.max(Number.parseInt($pickup.dataset.spot), -1) - 1;
      itch$dsptchr = $cuePrevious;
    }

    if (
      itchID < 0 || itchID >= _g.cardMax ||
      itchSpot < 0 || itchSpot >= _g.cardMax
      ) { return; }

    if (itch$dsptchr) {
      const
        /** @type {PCSEventOpts} */
        itchEvtOpt = { detail: { msg: `${itchSpot}[::|::]${itchID}`, $dispatcher: itch$dsptchr } },
        /** @type {PCSEvent} */
        itchEvt = new CustomEvent(_g.notices.scratch, itchEvtOpt);

      document.querySelector(`#${_g.appID}`).dispatchEvent(itchEvt);
    }
  };


  /**
   * @param  {CardIntri} _cueInfo
   * @param  {boolean} backDirection
   */
  const move_arm = (cueInfo, backDirection) => {
    if ($container.matches(':popover-open')) {
      if(_update(cueInfo)) {
        backDirection ? $cueNext.disabled = false : $cuePrevious.disabled = false;

        console.log(`rotating turntable to ${backDirection ? "previous" : "next"} for:`);
        console.debug(cueInfo);
      }
    }
  };



  $container.setAttribute('popover', 'manual'); // only close via $turnOff
  $container.addEventListener('beforetoggle', _tidy, {signal: turntableAbortSignal});
  $cueNext.addEventListener('click', _itch, {signal: turntableAbortSignal});
  $cuePrevious.addEventListener('click', _itch, {signal: turntableAbortSignal});

  $turnOff.addEventListener("click", () => {
    $container.hidePopover();
  }, {signal: turntableAbortSignal});

  document.querySelector('#title-marquee')?.addEventListener('click', () => {
    if (_tccount++ >= 7) {
      _tccount = 0;
      $cuePrevious.disabled = true;
      $cueNext.disabled = true;
      $pickup.querySelector('use').setAttribute('href', _g.pcscardRef);
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
      return `${$pickup.dataset.spot || _g.cardMax}[::|::]${$pickup.dataset.oglo || _g.cardMax}`;
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
 * @type {Part.Turntable}
 */
let reuseablePart = null;

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
