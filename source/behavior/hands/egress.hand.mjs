
/**
 * @import {CSSelector, Hand} from '../_meta/_typedefs.mjs'
 */

import { default as _g } from '../_meta/_glods.mjs';


const egressSerializer = new XMLSerializer();


/**
 * @return {Readonly<Hand.Egress>} - {@link Hand.Egress}
 */
const makeEgressHand = () => {
	/**
	 * @param  {string} cpyTxt
	 *
	 * @return {Boolean}
	 */
	const copy_to_clipboard = async (cpyTxt) => {
		let result;

		try {
			await navigator.clipboard.writeText(`${_g.pcs_clippre}${cpyTxt}`);
			result = true
		} catch (clipboardError) {
			result = false;

			if (clipboardError instanceof DOMException &&
				clipboardError.name == "NotAllowedError"
			){
				console.warn("Clipboard permission needed");
			} else {
				console.error("Issue occured copying to clipboard");
				console.debug(clipboardError);
			}
		}

		return result;
	};


	/**
	 * @param  {string} backdropColor an acceptable value for fill
	 * @param  {string[]} spriteOrder
	 * @param  {CSSelector} spriteSheet
	 * @param  {CSSelector} dropZone
	 *
	 * @return {Boolean}
	 */
	const canvasyze_rasterize = (backdropColor, spriteOrder, spriteSheet, dropZone) => {
		let result, svgDataUrl;
		const
			/** @type {Node} also see {@link SVGElement} */
			$spriteSheet = document.querySelector(spriteSheet)?.cloneNode(true),
			/** @type {SVGRectElement} */
			$backdrop = $spriteSheet.querySelector(`defs rect`),
			/** @type {HTMLAnchorElement} */
			$dropZone = document.querySelector(dropZone),
			$canvas = document.createElement('canvas'),
			/** @type {SVGGElement} */
			$itemGroup = document.createElementNS("http://www.w3.org/2000/svg", "g"),
			canvas_ctx_2d = $canvas.getContext('2d'),
			tmpImage = new Image();

		if (!$spriteSheet || !$dropZone) {
			console.log("Missing componenets for image download")
			console.debug(spriteOrder);
			result = false;
		} else {
			$spriteSheet?.setAttribute('style', '');
			$itemGroup.setAttribute('id', `${dropZone}-items`);
			$backdrop?.setAttribute('fill', backdropColor);

			//spriteOrder.forEach((spriteItm) => {
			//	_$useItem = document.createElementNS("http://www.w3.org/2000/svg", "use");
			//	
			//	_$useItem.setAttribute('href', spriteItem) 
			//	$itmGroup.appendChild()
			//});

			$spriteSheet.appendChild($itemGroup);

			svgDataUrl = URL.createObjectURL(new Blob(
				[egressSerializer.serializeToString($spriteSheet)],
				{type: 'image/svg+xml;charset=utf-8'}
			));

			$canvas.width = 1000;
			$canvas.height = 400;

			tmpImage.onload = () => {
				canvas_ctx_2d.drawImage(tmpImage, 0, 0, $canvas.width, $canvas.height);

				URL.revokeObjectURL(svgDataUrl);

				$dropZone.download = 'pcs_cards.svg';
				$dropZone.href = $canvas.toDataURL();
				$dropZone.click();
				$dropZone.textContent = ">redownload here<";
			};

			tmpImage.src = svgDataUrl;
			result = true;
		}

		return result;
	};


	return Object.freeze({
		exportText: copy_to_clipboard,
		generateImage: canvasyze_rasterize
	});
};

const singleEgreesHand = makeEgressHand();

export default singleEgreesHand;
export const debugName = "pcs:hand:egress";