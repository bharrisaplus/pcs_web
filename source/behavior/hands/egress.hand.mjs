
/**
 * @import {CSSelector, Hand} from '../_meta/_typedefs.mjs'
 */

import { default as _g } from '../_meta/_glods.mjs';


/**
 * @return {Readonly<Hand.Egress>} - {@link Hand.Egress}
 */
const makeEgressHand = () => {
	const egressSerializer = new XMLSerializer();

	/**
	 * @param  {string} cpyTxt
	 *
	 * @return {Promise<Boolean>}
	 */
	const copy_to_clipboard = async (cpyTxt) => {
		let result = false;

		try {
			await navigator.clipboard.writeText(`${_g.pcs_clippre}${cpyTxt}`);
			result = true
		} catch (clipboardError) {
			if (clipboardError instanceof DOMException && clipboardError.name == "NotAllowedError"){
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
	 *
	 * @return {Promise<string>} The data url for the generated image
	 */
	const canvasyze_rasterize = async (backdropColor, spriteOrder, spriteSheet) => {
		let 
			imgDataUrl = "",
			svgObjUrl = "";

		const
			/** @type {SVGElement} */
			$spriteSheet = document.querySelector(spriteSheet)?.cloneNode(true),
			/** @type {SVGRectElement} */
			$backdrop = $spriteSheet.querySelector(`defs symbol rect`),
			/** @type {SVGGElement} */
			$itemGroup = document.createElementNS("http://www.w3.org/2000/svg", "g"),

			$canvas = document.createElement('canvas'),
			canvas_ctx_2d = $canvas.getContext('2d'),
			tmpImage = new Image();

		if (!$spriteSheet || spriteOrder.length < 52) {
			console.error("Missing componenets for image download");
			console.debug(arguments);
			imgDataUrl = "";
		} else {
			$spriteSheet.setAttribute('style', '');
			$itemGroup.setAttribute('id', 'group-items');
			$backdrop?.setAttribute('fill', backdropColor);

			//spriteOrder.forEach((spriteItm) => {
			//	_$useItem = document.createElementNS("http://www.w3.org/2000/svg", "use");
			//	
			//	_$useItem.setAttribute('href', spriteItem) 
			//	$itmGroup.appendChild()
			//});

			$spriteSheet.appendChild($itemGroup);

			svgObjUrl = URL.createObjectURL(new Blob(
				[egressSerializer.serializeToString($spriteSheet)],
				{type: 'image/svg+xml;charset=utf-8'}
			));

			$canvas.width = 1000;
			$canvas.height = 400;

			try {
				tmpImage.src = svgObjUrl;
				await tmpImage.decode();

				canvas_ctx_2d.drawImage(tmpImage, 0, 0, $canvas.width, $canvas.height);
				URL.revokeObjectURL(svgObjUrl);

				imgDataUrl = $canvas.toDataURL();
			} catch(imgError) {
				if (imgError instanceof DOMException) {
					switch (imgError.name) {
						case "EncodingError": console.error("Issue with image decode"); break;
						case "SecurityError": console.error("Issue with canvas"); break;
						default: console.error("Issue during image generation");
					}
				} else {
					console.error("Issue during image generation");
				}

				console.debug(imgError);
				imgDataUrl = "";
			}
		}

		return imgDataUrl;
	};


	return Object.freeze({
		exportText: copy_to_clipboard,
		generateImage: canvasyze_rasterize
	});
};

const singleEgreesHand = makeEgressHand();

export default singleEgreesHand;
export const debugName = "pcs:hand:egress";