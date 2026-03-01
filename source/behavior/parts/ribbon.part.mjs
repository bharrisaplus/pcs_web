
/**
 * @import {Part, CSSelector} from '../_meta/_typedefs.mjs'
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
    $clawImgBtn = document.querySelector(`${containerID} #claw button.claw-img`);


  /** @param {'0' | '1' | '2' | '3' | '4'} colorOption */
  const dip_brush = (colorOption) => {
    if (is_grabbing) return;

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


  const write_out = async (txtExport) => {
    let result;

    if (!is_grabbing) {
      is_grabbing = true;
      $brushWell.disabled = true;
      $clawTxtBtn.disabled = true;
      $clawImgBtn.disabled = true;
      result = await outHand.exportText(txtExport);
    }

    is_grabbing = false;
    $brushWell.disabled = false;
    $clawTxtBtn.disabled = false;
    $clawImgBtn.disabled = false;

    return result;
  };


  $brushWell.value = '0';

  $brushWell.addEventListener('change', (_changeEvt) => {
    if (is_grabbing || _changeEvt.target != $brushWell) { return; }

    _changeEvt.preventDefault();
    dip_brush(_changeEvt.target.value);
  });

  $clawTxtBtn.addEventListener('click', (_clickEvt) => {
    if (_clickEvt.target != $clawTxtBtn) { return; }

    /** @type {PCSEvent} */
    const copyOutEvent = new CustomEvent(_g.notices.chop, {
      detail: { $dispatcher: $clawTxtBtn }
    });

    document.querySelector(`#${_g.appID}`)?.dispatchEvent(copyOutEvent);
  });


  return Object.freeze({
    composeTxt: write_out,

    get dyeInput () {
      return `${containerID} #brush select[name='brush-wells']`;
    },

    get isBusy () {
      return is_grabbing;
    },

    get copyBtn () {
      return `${containerID} .${$clawTxtBtn.className.split(" ").join('.')}`;
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
