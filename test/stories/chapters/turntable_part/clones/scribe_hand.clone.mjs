/**
 * @import {Hand, Part} from 'pcs:types';
 */

import { default as td } from 'testdouble';


const getScribeHandClone = () => {
  /** {@link Hand.Scribe} - {@link Part.Turntable} */
  const cloneScribeHand = {
    devlog: () => {}
  };

  return td.object(cloneScribeHand);
};

const singleClone = getScribeHandClone();

export default singleClone;
export const debugName = "pcs:hand:scribe:clone";