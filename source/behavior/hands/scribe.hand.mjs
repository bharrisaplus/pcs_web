/**
 * @import {Hand} from '../_meta/_typedefs.mjs'
 */


/**
 * @return {Readonly<Hand.Scribe>} a logger - {@link Hand.Scribe}
 */
const makeScribeHand = () => {
	const console_free = (
	  window.location?.href?.startsWith('http://localhost:') ||
	  window.location?.href?.startsWith('https://localhost:') ||
	  window.location?.href?.startsWith('file:') // || whatever you like
	);

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
				if (issueThingy) { console.debug(issueMsg); }
			}
		}
	};


	const log_notification = (notificationMsg) => {
		if (console_free) {
			if (notificationMsg) { console.info(notificationMsg); }
		}
	};

	return Object.freeze({
		devlog: log_dev,
		issuelog: log_issue,
		notilog: log_notification
	});
};


const singleScribeHand = makeScribeHand();

export default singleScribeHand;
export const debugName = "pcs:hand:scribe";
