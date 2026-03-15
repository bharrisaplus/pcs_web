/**
 * @import {Shuttle} from '../_meta/_typedefs.mjs';
 */


/** @return {Readonly<Shuttle.Host>} {@link Shuttle.Host} */
const makeHostShuttle = () => {

	/**
	 * @param  {string} resourceLink {@link URL}
	 *
	 * @return {Blob}
	 */
	const blob_from_url = async (resourceLink) => {
		let
			/** @type {Response} */
			blobResponse,
			/** @type {Blob} */
			blobResult;

		try {
			blobResponse = await fetch(resourceLink);
			// Check response code
		} catch (fetchErr) {
			// DOMException: AbortError
			// DOMException: NotAllowedError
			// TypeError
			console.error(fetchErr);
		}

		if (blobResponse) {
			try {
				blobResult = await blobResponse.blob();
			} catch (shuttleErr) {
				// TypeError
				console.error(shuttleErr);
			}
		}

		return blobResult;
	}

	/** @type {Readonly<Shuttle.Host>} */
	const HostShuttle = Object.freeze({
		grabFile: blob_from_url
	});

	return HostShuttle;
};

export default makeHostShuttle;
export const debugName = "pcs:shuttle:host";
