
/**
 * @import {CSSelector, Hand} from '../_meta/_typedefs.mjs'
 */

import { default as _g } from '../_meta/_glods.mjs';
import { default as appLogger } from '../hands/scribe.hand.mjs';


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
				appLogger.issuelog("Clipboard permission needed", false, false, false);
			} else {
				appLogger.issuelog("Issue occured copying to clipboard", cpyTxt, clipboardError);
			}
		}

		return result;
	};


	/**
	 * @param  {string} backdropColor an acceptable value for fill
	 * @param  {string[]} spriteList
	 * @param  {CSSelector} spriteSheet
	 *
	 * @return {Promise<string>} The data url for the generated image
	 */
	const canvasyze_rasterize = async (backdropColor, spriteList, spriteSheet) => {
		let
			imgDataUrl = "",
			svgObjUrl = "",
			/** @type {SVGUseElement[]} */
			$useItems = [];

		const
			/** @type {SVGElement} */
			$spriteSheet = document.querySelector(spriteSheet)?.cloneNode(true),
			/** @type {SVGRectElement} */
			$backdrop = $spriteSheet.querySelector(`defs symbol rect`),

			$itemGroup = document.createElementNS("http://www.w3.org/2000/svg", "g"),
			$canvas = document.createElement('canvas'),
			canvas_ctx_2d = $canvas.getContext('2d'),
			tmpImage = new Image();

		if (!$spriteSheet || spriteList.length < 52) {
			appLogger.issuelog("Missing componenets for image download", arguments, false);
			imgDataUrl = "";
		} else {
			$spriteSheet.setAttribute('style', '');
			$itemGroup.setAttribute('id', 'group-items');
			$backdrop?.setAttribute('fill', backdropColor);

			$useItems = spriteList.map((_itm, _idx) => {
				const _sprite = document.createElementNS("http://www.w3.org/2000/svg", "use");

				_sprite.setAttribute('href', _itm);
				_sprite.setAttribute('width','30');
				_sprite.setAttribute('height','40');
				_sprite.setAttribute('x', `${4.32 + (Math.floor(_idx % 13) * 38.46)}`);
				_sprite.setAttribute('y', `${5 + (Math.floor(_idx / 13) * 50)}`);

				return _sprite;
			});

			$itemGroup.replaceChildren(...$useItems);
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
				let imgErrorMsg = "Issue during image generation";

				if (imgError instanceof DOMException) {
					switch (imgError.name) {
						case "EncodingError": imgErrorMsg = "Issue with image decode"; break;
						case "SecurityError": imgErrorMsg = "Issue with canvas"; break;
						default: imgErrorMsg = "Issue with web API";
					}
				}

				appLogger.issuelog(imgErrorMsg, arguments, imgError);
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