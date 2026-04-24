/** @globals fetch */

/**
 * @import {Shuttle} from '../_meta/_typedefs.mjs';
 */

import { default as appLogger } from '../hands/scribe.hand.mjs';


/** @return {Readonly<Shuttle.Host>} {@link Shuttle.Host} */
const makeHostShuttle = () => {

  /**
   * @param  {string} resourceLink {@link URL}
   *
   * @return {Promise<Blob>}
   */
  const blob_from_url = async (resourceLink) => {
    let
      /** @type {Response} */
      blobResponse,
      /** @type {Blob} */
      blobResult;

    try {
      blobResponse = await fetch(resourceLink);

      if (!blobResponse.ok) {
        if (blobResponse.status > 399) {
          appLogger.issuelog("Network issue with file grab", {resourceLink, blobResponse}, null);
        }

        blobResponse = null;
      }
    } catch (fetchErr) {
      let fetchErrMsg = "Some problem grabbing file";

      if (fetchErr instanceof DOMException && fetchErr.name === "AbortError") {
        fetchErrMsg = "Aborted file grab";
      } else if (fetchErr instanceof DOMException && fetchErr.name === "NotAllowedError") {
        fetchErrMsg = "Permission issue with file grab";
      } else if (fetchErr instanceof TypeError) {
        fetchErrMsg = "Type mismatch with file grab";
      }

      appLogger.issuelog(fetchErrMsg, {resourceLink, blobResponse, fetchErr}, null);
      blobResponse = null;
    }

    if (blobResponse) {
      try {
        blobResult = await blobResponse.blob();
      } catch (readErr) {
        let readErrMsg = "Some problem reading file"

        if (readErr instanceof DOMException && readErr.name === "AbortError") {
          readErrMsg = "Aborted file read";
        } else if (readErr instanceof TypeError) {
          readErrMsg = "Could not read file";
        }

        appLogger.issuelog(readErrMsg, {resourceLink, blobResponse, readErr}, null);
        blobResult = null;
      }
    }

    return blobResult;
  }

  /** @type {Shuttle.Host} */
  const HostShuttle = Object.freeze({
    grabFile: blob_from_url
  });

  return HostShuttle;
};

export default makeHostShuttle;
export const debugName = "pcs:shuttle:host";
