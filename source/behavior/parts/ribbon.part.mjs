/** @globals document, CustomEvent */

/**
 * @import {Part, PCSEvent, CSSelector} from '../_meta/_typedefs.mjs'
 */

import { default as _g } from '../_meta/_glods.mjs';
import { default as outHand } from '../hands/egress.hand.mjs';


/**
 * @param {CSSelector} containerID
 *
 * @returns {Part.Ribbon} the control panel - {@link Part.Ribbon}
 */
const makeRibbonPart = (containerID) => {
  let is_grabbing = false;

  const
    /** @type {HTMLSelectElement} */
    $brushWell = document.querySelector(`${containerID} #brush select[name='brush-wells']`),
    /** @type {HTMLButtonElement} */
    $shuffleBtn = document.querySelector(`${containerID} button#shuffle`),
    /** @type {HTMLButtonElement} */
    $resetBtn = document.querySelector(`${containerID} #reset button`),
    /** @type {HTMLButtonElement} */
    $clawTxtBtn = document.querySelector(`${containerID} #claw button.claw-txt`),
    /** @type {HTMLButtonElement} */
    $clawImgBtn = document.querySelector(`${containerID} #claw button.claw-img`),
    /** @type {HTMLAnchorElement} */
    $clawDrop = document.querySelector(`${containerID} #claw a.claw-drop`);


  /** @param {string} dipOption */
  const _dip_brush = (dipOption) => {
    /** @type {string} */
    let dipColor;

    if (is_grabbing) { return; }

    switch(dipOption) {
      case '1': dipColor = _g.dyes[0]; break;
      case '2': dipColor = _g.dyes[1]; break;
      case '3': dipColor = _g.dyes[2]; break;
      case '4': dipColor = _g.dyes[3]; break;
      default: break;
    }

    if (!dipColor) { return; }

    /** @type {PCSEvent} */
    const splashEvt = new CustomEvent(_g.notices.splash, {
      detail: { msg: dipColor, $dispatcher: $brushWell }
    });

    document.querySelector(`#${_g.appID}`).dispatchEvent(splashEvt);

    $brushWell.value = '0';
  };


  /**
   * @param  {string[]} txtExports
   *
   * @return {Promise<Boolean>}
   * @see Part.Ribbon#composeTxt
   */
  const write_out = async (txtExports) => {
    let result = false;

    if (!is_grabbing) {
      is_grabbing = true;
      $brushWell.disabled = true;
      $clawTxtBtn.disabled = true;
      $clawImgBtn.disabled = true;
      $shuffleBtn.disabled = true;
      $resetBtn.disabled = true;

      $brushWell.blur();
      $clawTxtBtn.blur();
      $clawImgBtn.blur();
      $shuffleBtn.blur();
      $resetBtn.blur();

      result = await outHand.exportText(txtExports.join("\n"));

      window.setTimeout(() => {
        is_grabbing = false;
        $brushWell.disabled = false;
        $clawTxtBtn.disabled = false;
        $clawImgBtn.disabled = false;
        $shuffleBtn.disabled = false;
        $resetBtn.disabled = false;

        $brushWell.blur();
        $clawTxtBtn.blur();
        $clawImgBtn.blur();
        $shuffleBtn.blur();
        $resetBtn.blur();
      }, 1500);
    }

    return result;
  };


  /**
   * @param {string} renderColor
   * @param  {string[]} renderExports
   * @param  {CSSelector} renderBase
   *
   * @return {Promise<Boolean>}
   * @see Part.Ribbon#prepareImg
   */
  const render_out = async (renderColor, renderExports, renderBase) => {
    let
      result = false,
      _imgUrl = "";

    if (!is_grabbing) {
      is_grabbing = true;
      $brushWell.disabled = true;
      $clawTxtBtn.disabled = true;
      $clawImgBtn.disabled = true;
      $shuffleBtn.disabled = true;
      $resetBtn.disabled = true;

      $brushWell.blur();
      $clawTxtBtn.blur();
      $clawImgBtn.blur();
      $shuffleBtn.blur();
      $resetBtn.blur();

      _imgUrl = await outHand.generateImage(renderColor, renderExports, renderBase);

      result = true;
      $clawDrop.download = 'pcs_cards.png';
      $clawDrop.href = _imgUrl;
      $clawDrop.click();
      $clawDrop.textContent = "redownload here";

      window.setTimeout(() => {
        is_grabbing = false;
        $brushWell.disabled = false;
        $clawTxtBtn.disabled = false;
        $clawImgBtn.disabled = false;
        $shuffleBtn.disabled = false;
        $resetBtn.disabled = false;

        $brushWell.blur();
        $clawTxtBtn.blur();
        $clawImgBtn.blur();
        $shuffleBtn.blur();
        $resetBtn.blur();
      }, 2000);

      window.setTimeout(() => {
        $clawDrop.download = null;
        $clawDrop.removeAttribute("href");
        $clawDrop.textContent = "";

        $clawDrop.blur();
      }, 4000);
    }

    return result;
  };


  /** @see Part.Ribbon#resetCtrls */
  const generic_cool_down = () => {
    if (is_grabbing) { return; }

    is_grabbing = true;
    $brushWell.disabled = true;
    $clawTxtBtn.disabled = true;
    $clawImgBtn.disabled = true;
    $shuffleBtn.disabled = true;
    $resetBtn.disabled = true;
    $clawDrop.removeAttribute("href");
    $clawDrop.textContent = "";

    $brushWell.blur();
    $clawTxtBtn.blur();
    $clawImgBtn.blur();
    $shuffleBtn.blur();
    $clawDrop.blur();
    $resetBtn.blur();

    window.setTimeout(() => {
      is_grabbing = false;
      $brushWell.disabled = false;
      $clawTxtBtn.disabled = false;
      $clawImgBtn.disabled = false;
      $shuffleBtn.disabled = false;
      $resetBtn.disabled = false;

      $brushWell.blur();
      $clawTxtBtn.blur();
      $clawImgBtn.blur();
      $shuffleBtn.blur();
      $resetBtn.blur();
    }, 1500);
  };


  $brushWell.addEventListener('change', (_changeEvt) => {
    if (
      is_grabbing ||
      !(_changeEvt.target instanceof window.HTMLSelectElement) || _changeEvt.target !== $brushWell
    ) { return; }

    _changeEvt.preventDefault();
    _dip_brush(_changeEvt.target.value);
  });


  $clawTxtBtn.addEventListener('click', (_clickEvt) => {
    if (is_grabbing || _clickEvt.target !== $clawTxtBtn) { return; }

    /** @type {PCSEvent} */
    const copyOutEvent = new CustomEvent(_g.notices.chop, {
      detail: { $dispatcher: $clawTxtBtn }
    });

    document.querySelector(`#${_g.appID}`).dispatchEvent(copyOutEvent);
  });


  $clawImgBtn.addEventListener('click', (_clickEvt) => {
    if (is_grabbing || _clickEvt.target !== $clawImgBtn) { return; }

    /** @type {PCSEvent} */
    const genGraphicEvent = new CustomEvent(_g.notices.trace, {
      detail: { $dispatcher: $clawImgBtn }
    });

    document.querySelector(`#${_g.appID}`).dispatchEvent(genGraphicEvent);
  });


  $shuffleBtn.addEventListener('click', (_clickEvt) => {
    if (is_grabbing || _clickEvt.target !== $shuffleBtn) { return; }

    /** @type {PCSEvent} */
    const stirAroundEvent = new CustomEvent(_g.notices.blend, {
      detail: { $dispatcher: $shuffleBtn }
    });

    document.querySelector(`#${_g.appID}`).dispatchEvent(stirAroundEvent);
  });

  $resetBtn.addEventListener('click', (_clickEvt) => {
    if (is_grabbing || _clickEvt.target !== $resetBtn) { return; }

    /** @type {PCSEvent} */
    const newAgainEvent = new CustomEvent(_g.notices.fresh, {
      detail: { $dispatcher: $resetBtn }
    });

    document.querySelector(`#${_g.appID}`).dispatchEvent(newAgainEvent);
  });


  return Object.freeze({
    composeTxt: write_out,
    prepareImg: render_out,
    resetCtrls: generic_cool_down,

    /** @type {CSSelector} */
    get dyeInput () {
      return `${containerID} #brush select[name='brush-wells']`;
    },

    get isBusy () {
      return is_grabbing;
    },

    /** @type {CSSelector} */
    get copyBtn () {
      return `${containerID} .${$clawTxtBtn.className.split(" ").join('.')}`;
    },

    /** @type {CSSelector} */
    get downloadBtn () {
      return `${containerID} .${$clawImgBtn.className.split(' ').join('.')}`;
    },

    /** @type {CSSelector} */
    get mingleBtn () {
      return `${containerID} #${$shuffleBtn.id}`;
    },

    /** @type {CSSelector} */
    get clearBtn () {
      return `${containerID} [aria-label="${$resetBtn.getAttribute('aria-label')}"]`;
    }
  });
}

/** @type {Part.Ribbon} */
let singleRibbon;

/**
 * @param {CSSelector} getRibbonContainerID
 *
 * @return {Part.Ribbon}
 */
const getRibbon = (getRibbonContainerID) => {
  if (!singleRibbon) {
    singleRibbon = makeRibbonPart(getRibbonContainerID);
  }

  return singleRibbon;
};


export default getRibbon;

export const debugName = "pcs:part:ribbon";
