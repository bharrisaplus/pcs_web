
/* This files imports should be specified as part of the importmap in subject.page.pug */
import { default as _tg } from './clones/_glods.clone.mjs';


const tableauID = '#tableau';

document.addEventListener('DOMContentLoaded', () => {
  console.debug(_tg);

  if (
    window.frameElement &&
    window.parent.document.body.querySelectorAll(`${tableauID}-panel`).length == 1
  ) {
    window.addEventListener('message', (_msgEvt) => {
      if (_msgEvt.data.type == 'subject:test') {
        console.debug("run tests");
      } else if (_msgEvt.data.type == 'subject:a11y') {
        window.axe.run().then((results) => {
          if (results.violations.length) {
            for (const a11yIssue of results.violations) {
              console.debug(a11yIssue);
            }
          }
        });
      } else {
        console.warn(`Received unknown msg type: ${_msgEvt.data.type}`);
      }
    });


    window.parent.postMessage({type: 'loaded'});
  }
});