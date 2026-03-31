/** @globals window, document, console, AbortController */

/**
 * @import {Hand} from '../_meta/_typedefs.mjs'
 */


/**
 * @return {Readonly<Hand.Scribe>} a logger - {@link Hand.Scribe}
 */
const makeScribeHand = () => {
	/** @type {NotificationToast[]} */
	let toasts = [];
	const
		console_free = (
		  window.location?.href?.startsWith('http://localhost:') ||
		  window.location?.href?.startsWith('https://localhost:') ||
		  window.location?.href?.startsWith('file:') // || whatever you like
		),

		/** @type {HTMLElement} */
		$toaster = document.querySelector('#notifications'),
		/** @type {HTMLTemplateElement} */
		$toastRef = document.querySelector('template#toast');


	const log_dev = (devMsg, devThingy) => {
		if (console_free) {
			if (devMsg) { console.debug(devMsg); }
			if (devThingy) { console.debug(devThingy); }
		}
	};

	const log_issue = (issueMsg, issueThingy, issueErr, blocking = true) => {
		if (console_free) {
			if (blocking) {
				if (issueMsg) { console.error(issueMsg); }
				if (issueThingy) { console.debug(issueThingy); }
				if (issueErr) { console.error(issueErr); }
			} else {
				if (issueMsg) { console.warn(issueMsg); }
				if (issueThingy) { console.debug(issueThingy); }
			}
		}
	};

	const _make_toast = (toastMsg) => {
		/** @type {NotificationToast} */
		let maybeNoTo;
		const
			aToastAbort = new AbortController(),
			/** @type {DocumentFragment} */
			$toastContainer = document.importNode($toastRef.content, true),
			/** @type {HTMLElement} */
			$aToast = $toastContainer.querySelector('.toast');

		if (toasts.some((_toast) => _toast.$elm.querySelector('span.toast-msg')?.textContent === toastMsg)) {
			return;
		}

		$aToast.querySelector('span.toast-msg').textContent = toastMsg;
		$aToast.querySelector('button.toast-close').addEventListener('click', (_clickEvt) => {
			let
				cutIdx,
				cutToast;

			if (_clickEvt.target instanceof window.HTMLElement && _clickEvt.target.parentElement !== $aToast) {
				return;
			}

			cutIdx = toasts.map((_toastItm) => _toastItm.$elm ).indexOf($aToast);

			if (toasts.length === 1) {
				$toaster.hidePopover();
			}

			if (cutIdx === -1) {
				$aToast.remove();
				return;
			}

			cutToast = toasts[cutIdx];
			toasts = toasts.toSpliced(cutIdx, 1);

			cutToast.cancel.abort();
			cutToast.$elm.remove();
		}, {signal: aToastAbort.signal});

		$toaster.appendChild($aToast);
		$toaster.showPopover();

		if (toasts.length >= 3) {
			const _gcToast = toasts.shift();

			_gcToast.cancel.abort();
			_gcToast.$elm.remove();
		}

		maybeNoTo = {$elm: $aToast, cancel: aToastAbort}

		toasts.push(maybeNoTo);
	};


	const log_notification = (notificationMsg) => {
		if (console_free) {
			if (notificationMsg) { console.info(notificationMsg); }
		}

		if ($toastRef && $toaster?.matches(`[popover="manual"]`)) {
			_make_toast(notificationMsg);
		}
	};


	window['devToast'] = console_free ? (thisHere) => { log_notification(thisHere) } : undefined;

	return Object.freeze({
		devlog: log_dev,
		issuelog: log_issue,
		notilog: log_notification
	});
};


const singleScribeHand = makeScribeHand();

export default singleScribeHand;
export const debugName = "pcs:hand:scribe";
