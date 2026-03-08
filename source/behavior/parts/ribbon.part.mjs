
/**
 * @import {Part, PCSEvent, CSSelector} from '../_meta/_typedefs.mjs'
 */

import { default as _g } from '../_meta/_glods.mjs';
import { default as outHand } from '../hands/egress.hand.mjs';


/**
 * @param {CSSelector} containerID - {@link CSSStyleRule.selectorText}
 *
 * @returns {Readonly<Part.Ribbon>} the control panel
 */
const makeRibbonPart = (containerID) => {
  let is_grabbing = false;

  const
    /** @type {HTMLSelectElement} */
    $brushWell = document.querySelector(`${containerID} #brush select[name='brush-wells']`),
    /** @type {HTMLButtonElement} */
    $clawTxtBtn = document.querySelector(`${containerID} #claw button.claw-txt`),
    /** @type {HTMLButtonElement} */
    $clawImgBtn = document.querySelector(`${containerID} #claw button.claw-img`),
    /** @type {HTMLAnchorElement} */
    $clawDrop = document.querySelector(`${containerID} #claw a.claw-drop`);


  /** @param {'0' | '1' | '2' | '3' | '4'} colorOption */
  const dip_brush = (colorOption) => {
    if (is_grabbing) { return; }

    /** @type {string} */
    let dipColor;

    switch(colorOption) {
      case '1': dipColor = `green-dye`; break;
      case '2': dipColor = `red-dye`; break;
      case '3': dipColor = `blue-dye`; break;
      case '4': dipColor = `purple-dye`; break;
      case '0':
      default: break;
    }

    if (dipColor) {
      /** @type {PCSEvent} */
      const splashEvt = new CustomEvent(_g.notices.splash, {
        detail: { msg: dipColor, $dispatcher: $brushWell }
      });

      document.querySelector(`#${_g.appID}`)?.dispatchEvent(splashEvt);
    }

    $brushWell.value = 0;
  };


  /**
   * @param  {string[]} txtExports
   *
   * @return {Promise<Boolean>}
   */
  const write_out = async (txtExports) => {
    let result = false;

    if (!is_grabbing) {
      is_grabbing = true;
      $brushWell.disabled = true;
      $clawTxtBtn.disabled = true;
      $clawImgBtn.disabled = true;

      result = await outHand.exportText(txtExports.join("\n"));

      window.setTimeout(() => {
        is_grabbing = false;
        $brushWell.disabled = false;
        $clawTxtBtn.disabled = false;
        $clawImgBtn.disabled = false;
      }, 2000);
    }

    return result;
  };


  /**
   * @param {string} renderColor
   * @param  {string[]} renderExports
   * @param  {CSSelector} renderBase
   *
   * @return {Promise<Boolean>}
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

      _imgUrl = await outHand.generateImage(renderColor, renderExports, renderBase);

      result = true;
      $clawDrop.download = 'pcs_cards.svg';
      $clawDrop.href = _imgUrl;
      $clawDrop.click();
      $clawDrop.textContent = ">redownload here<";

      window.setTimeout(() => {
        is_grabbing = false;
        $brushWell.disabled = false;
        $clawTxtBtn.disabled = false;
        $clawImgBtn.disabled = false;
      }, 4000);

      window.setTimeout(() => {
        $clawDrop.removeAttribute("href");
        $clawDrop.textContent = "";
      }, 8000);
    }

    return result;
  };


  $brushWell.value = '0';
  dip_brush(1);

  $brushWell.addEventListener('change', (_changeEvt) => {
    if (is_grabbing || _changeEvt.target != $brushWell) { return; }

    _changeEvt.preventDefault();
    dip_brush(_changeEvt.target.value);
  });


  $clawTxtBtn.addEventListener('click', (_clickEvt) => {
    if (is_grabbing || _clickEvt.target != $clawTxtBtn) { return; }

    /** @type {PCSEvent} */
    const copyOutEvent = new CustomEvent(_g.notices.chop, {
      detail: { $dispatcher: $clawTxtBtn }
    });

    document.querySelector(`#${_g.appID}`)?.dispatchEvent(copyOutEvent);
  });


  $clawImgBtn.addEventListener('click', (_clickEvt) => {
    if (is_grabbing || _clickEvt.target != $clawImgBtn) { return; }

    /** @type {PCSEvent} */
    const genGraphicEvent = new CustomEvent(_g.notices.trace, {
      detail: { $dispatcher: $clawImgBtn }
    });

    document.querySelector(`#${_g.appID}`)?.dispatchEvent(genGraphicEvent);
  });


  return Object.freeze({
    composeTxt: write_out,
    prepareImg: render_out,

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
    }
  });
}

/** @type {Part.Ribbon} */
let singleRibbon;

/**
 * @param {CSSelector} getRibbonContainerID - {@link CSSStyleRule.selectorText}
 *
 * @return {Readonly<Part.Ribbon>}
 */
const getRibbon = (getRibbonContainerID) => {
  if (!singleRibbon) {
    singleRibbon = makeRibbonPart(getRibbonContainerID);
  }

  return singleRibbon;
};


export default getRibbon;

export const debugName = "pcs:part:ribbon";
