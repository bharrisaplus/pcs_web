/** @globals document, AbortController, CustomEvent */

/**
 * @import {PCSEvent, CSSelector, Part, CardIntri} from '../_meta/_typedefs.mjs'
 */

import { default as _g } from '../_meta/_glods.mjs';


/**
 * @param  {CSSelector} containerID - {@link CSSStyleRule.selectorText}
 * @param  {AbortController} eventCancel - {@link AbortController}
 *
 * @return {Part.Tableau} a surface for cards - {@link Part.Tableau}
 */
const makeTableauPart = (containerID, eventCancel) => {
  const itemSelector = `${containerID} .playing-card`;

  /**
   * @param  {HTMLLIElement} $item
   * @param  {number} itemIdx
   */
  const _setupItem = ($item, itemIdx) => {
    $item.addEventListener('click', (_clickEvt) => {
      /** @type {PCSEvent} */
      let needleDown;

      if (
        (
          !(_clickEvt.target instanceof window.HTMLLIElement) &&
          !(_clickEvt.target instanceof window.SVGElement)
        ) ||
        $item !== _clickEvt.target && $item !== _clickEvt.target?.parentElement
      ) { return; }

      needleDown = new CustomEvent(_g.notices.needle, {
        detail: {
          msg: itemIdx.toString(),
          $dispatcher: $item
        }
      });

      document.querySelector(`#${_g.appID}`)?.dispatchEvent(needleDown);
    }, {signal: eventCancel.signal});
  };


  /**
   * @param  {CardIntri[]} newItems
   * @see Part.Tableau#updateOrder
   */
  const set_items_from = (newItems) => {
    /** @type {HTMLLIElement[]} */
    const _$tmpItems = Array.from(document.querySelectorAll(itemSelector));

    if (newItems.length < _g.c_Max) { return; }

    eventCancel.abort();
    eventCancel = new AbortController();

    _$tmpItems.forEach((_$itm, _itmIdx) => {
      _$itm.setAttribute('id', `card-${newItems[_itmIdx].symbolRef.split("#")[1]}`);
      _$itm.setAttribute('data-oid', `${newItems[_itmIdx].oglo}`);
      _$itm.setAttribute('aria-description', newItems[_itmIdx].title);

      if (_$itm.querySelector('title#playing-card-title')) {
        _$itm.querySelector('title#playing-card-title').textContent = newItems[_itmIdx].title;
      }

      if (_$itm.querySelector('desc#playing-card-description')) {
        _$itm.querySelector('desc#playing-card-description').textContent = newItems[_itmIdx].desc;
      }

      _$itm.querySelector('svg[role="img"] use')?.setAttribute('href', newItems[_itmIdx].symbolRef);
      _setupItem(_$itm, _itmIdx);
    });

    document.querySelector(containerID).replaceChildren(..._$tmpItems);
  };


  if (document.querySelectorAll(itemSelector).length > 0 ) {
    /** @type {HTMLLIElement[]} */
    let $items = Array.from(document.querySelectorAll(itemSelector));

    $items.forEach(_setupItem);
  }

  return Object.freeze({
    updateOrder: set_items_from,

    get currentOrder () {
      /** @type {HTMLLIElement[]} */
      const $items = Array.from(document.querySelectorAll(itemSelector));

      return $items.filter(
        ($item) => $item.dataset.oid && $item.dataset.oid.length <= 2
      ).map(
        ($item) => Number.parseInt($item.dataset.oid)
      );
    }
  });
};


let
  /** @type {Part.Tableau} */
  singleTableau,
  /** @type {AbortController} */
  singleCancel;

/**
 * @param {string} getTableauContainerID - {@link CSSStyleRule.selectorText}
 *
 * @returns {Part.Tableau} sole Tableau for the page - {@link Part.Turntable}
 */
const getTableau = (getTableauContainerID) => {
  if (!singleTableau) {
    singleCancel = new AbortController();
    singleTableau = makeTableauPart(getTableauContainerID, singleCancel);
  }

  return singleTableau
};


export default getTableau;

export const debugName = "pcs:part:tableau";
