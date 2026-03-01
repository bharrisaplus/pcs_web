
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


  /** @param {Event} _changeEvt */
  const dip_brush = (_changeEvt) => {
    /** @type {string} */
    let brushColor;

    _changeEvt.preventDefault();

    if (is_grabbing || _changeEvt.target != $brushWell) return;

    is_grabbing = true;
    $clawTxtBtn.disabled = true;
    $clawImgBtn.disabled = true;

    switch(_changeEvt.target?.value) {
      case '1': brushColor = `green-dye`; break;
      case '2': brushColor = `red-dye`; break;
      case '3': brushColor = `blue-dye`; break;
      case '4': brushColor = `purple-dye`; break;
      case '0':
      default: break;
    }

    if (brushColor) {
      const
        /** @type {PCSEventOpts} */
        splashEvtOpt = { detail: { msg: brushColor, $dispatcher: $brushWell } },
        /** @type {PCSEvent} */
        splashEvt = new CustomEvent(_g.notices.splash, splashEvtOpt);

      document.querySelector(`#${_g.appID}`)?.dispatchEvent(splashEvt);
    }

    is_grabbing = false;
    $brushWell.value = 0;
    $clawTxtBtn.disabled = false;
    $clawImgBtn.disabled = false;
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
  $brushWell.addEventListener('change', dip_brush);
  $clawTxtBtn.addEventListener('click', (_clickEvt) => {
    if (_clickEvt.target == $clawTxtBtn) {
      /** @type {PCSEvent} */
      const copyOutEvent = new CustomEvent(_g.notices.chop, {
        detail: { $dispatcher: $clawTxtBtn }
      });

      document.querySelector(`#${_g.appID}`).dispatchEvent(copyOutEvent);
    }
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
