
/**
 * @import {Part, CSSelector} from '../_meta/_typedefs.mjs'
 */

import { default as _g } from '../_meta/_glods.mjs';


/**
 * @param {CSSelector} containerID - {@link CSSStyleRule.selectorText}
 *
 * @returns {Readonly<Part.Ribbon>} the control panel
 */
const makeRibbonPart = (containerID) => {
  let is_grabbing = false;

  const $brushWell = document.querySelector(`${containerID} #brush select[name='brush-wells']`);

  $brushWell.value = '0';

  /** @param {Event} _changeEvt */
  const dip_brush = (_changeEvt) => {
    /** @type {string} */
    let brushColor;

    _changeEvt.preventDefault();

    if (_changeEvt.target != $brushWell) return;

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

    $brushWell.value = 0;
  }


  $brushWell.addEventListener('change', dip_brush);


  return Object.freeze({
    get dyeInput () {
      return `${containerID} #brush select[name='brush-wells']`;
    },
    get isBusy () {
      return is_grabbing;
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
