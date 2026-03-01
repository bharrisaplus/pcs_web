
/**
 * @import {Hand} from '../_meta/_typedefs.mjs'
 */

import { default as _g } from '../_meta/_glods.mjs';


/**
 * @return {Readonly<Hand.Egress>} - {@link Hand.Egress}
 */
const makeEgressHand = () => {
	/**
	 * @param  {string} cpyTxt
	 *
	 * @return {boolean}
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


	return Object.freeze({
		exportText: copy_to_clipboard
	});
};

const singleEgreesHand = makeEgressHand();

export default singleEgreesHand;
export const debugName = "pcs:hand:egress";