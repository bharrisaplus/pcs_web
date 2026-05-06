/**
 * @import {Hand, Part} from 'pcs:types';
 */

import { default as td } from 'testdouble';


const getEgressHandClone = () => {
  /** {@link Hand.Egress} - {@link Part.Ribbon} */
  const cloneEgressHand = {
    exportText: () => {},
    generateImage: () => {}
  };

  return td.object(cloneEgressHand);
};

const singleClone = getEgressHandClone();

export default singleClone;
export const debugName = "pcs:hand:egress:clone";
