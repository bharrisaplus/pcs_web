/**
 * @import {Hand} from 'pcs:types';
 */

import { default as td } from 'testdouble';


const getScribeHandClone = () => {
  /** @type {Hand.Scribe} */
  const cloneScribeHand = {
    devlog: () => {},
    issuelog: () => {},
    notilog: () => {}
  };

  return td.object(cloneScribeHand);
};

const singleClone = getScribeHandClone();

export default singleClone;
