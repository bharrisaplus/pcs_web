/**
 * @import {Bank} from '../../source/behavior/_meta/_typedefs.mjs';
 */

import { default as NodeCrypto } from 'node:crypto';
import { default as test } from 'tape';
import {
  replace as tdSwap,
  object as tdObj,
  explain as tdExpl,
  reset as tdClr,
  when as tdStub
} from 'testdouble';


const
  modulePaths = {
    banks: {
      deck: '../../source/behavior/banks/deck.bank.mjs'
    }
  },

  getImport = async (mockLclStrg) => {
    const mockLocalStorage = tdSwap(globalThis, 'localStorage', mockLclStrg);

    return {
      /** @type {Bank.Deck} */
      freshModule: (await import(`${modulePaths.banks.deck}?v=${NodeCrypto.randomUUID()}`)).default,
      moduleLocalStorage: mockLocalStorage
    };
  };


test.skip("pcs:bank:deck should check for previous values if localstorage available", async (swear) => {
  let bonafiedResults = [], bonafiedExplntns = [];
  const
    swearLocalStorage = tdObj(['setItem', 'removeItem', 'getItem', 'clear']),
    impMeta = await getImport(swearLocalStorage);


  bonafiedResults.push(impMeta.freshModule.choice);
  bonafiedResults.push(impMeta.freshModule.cards);
  bonafiedResults.push(impMeta.freshModule.ndoCards);

  bonafiedExplntns.push(tdExpl(swearLocalStorage.setItem));
  bonafiedExplntns.push(tdExpl(swearLocalStorage.removeItem));
  bonafiedExplntns.push(tdExpl(swearLocalStorage.getItem));
  bonafiedExplntns.push(tdExpl(swearLocalStorage.clear));
  tdClr();
  impMeta.freshModule = null;


  swear.plan(6);
  swear.isEqual(bonafiedResults[0].toString(), '0,0', "choose first index");
  swear.ok(bonafiedResults[1].every((_cur, _idx) => _cur === bonafiedResults[2][_idx]), "order is expected");
  swear.isEqual(bonafiedExplntns[0].callCount, 1, "call setItem during setup");
  swear.isEqual(bonafiedExplntns[1].callCount, 1, "call removeItem during setup");
  swear.isEqual(bonafiedExplntns[2].callCount, 4, "call getItem during setup");
  swear.isEqual(bonafiedExplntns[3].callCount, 0, "call clear during setup");
});


test("pcs:bank:deck should read previous values if available in localstorage", async (swear) => {
  let impMeta, bonafiedResults = {}, bonafiedExplntns = [];
  const
    // 41|3, 27\12, 49|20
    swearOrder = [
      0,  1,  2,  41,  4,  5,  34,  7,  8,  9, 10, 11, 27, 13, 14, 15, 16, 30, 18, 19, 49, 21, 22, 23,
      24, 25, 26, 12, 28, 29, 17, 31, 32, 33, 6, 35, 36, 37, 38, 39, 40, 3, 42, 43, 44, 45, 46, 47, 48,
      20, 50, 51
    ],
    swearBGC = 2,
    swearLSKeyPrefix = 'pcs-shell',
    swearLocalStorage = tdObj(['setItem', 'removeItem', 'getItem', 'clear']),
    swearLSKeys = [
      `${swearLSKeyPrefix}:backgroundColor`,
      `${swearLSKeyPrefix}:backgroundColor:stamp`,
      `${swearLSKeyPrefix}:cardOrder`,
      `${swearLSKeyPrefix}:cardOrder:stamp`
    ];


  tdStub(swearLocalStorage.getItem(swearLSKeys[0])).thenReturn(JSON.stringify(swearBGC));
  tdStub(swearLocalStorage.getItem(swearLSKeys[1])).thenReturn(JSON.stringify(Date.now()));
  tdStub(swearLocalStorage.getItem(swearLSKeys[2])).thenReturn(JSON.stringify(swearOrder));
  tdStub(swearLocalStorage.getItem(swearLSKeys[3])).thenReturn(JSON.stringify(Date.now()));

  impMeta = await getImport(swearLocalStorage);

  bonafiedResults['sel'] = (impMeta.freshModule.choice);
  bonafiedResults['bgc'] = (impMeta.freshModule.backDrop);
  bonafiedResults['items'] = (impMeta.freshModule.cards);

  bonafiedExplntns.push(tdExpl(swearLocalStorage.setItem));
  bonafiedExplntns.push(tdExpl(swearLocalStorage.removeItem));
  bonafiedExplntns.push(tdExpl(swearLocalStorage.getItem));
  bonafiedExplntns.push(tdExpl(swearLocalStorage.clear));
  tdClr();
  impMeta.freshModule = null;


  swear.plan(7);
  swear.equals(bonafiedResults['sel'].toString(), '0,0', "set selection index");
  swear.equals(bonafiedResults['bgc'], swearBGC, "set bg color");
  swear.ok(bonafiedResults['items'].every((_cur, _idx) => _cur === swearOrder[_idx]), "order is expected");
  swear.equals(bonafiedExplntns[0].callCount, 7, "call setItem during setup");
  swear.equals(bonafiedExplntns[1].callCount, 3, "call removeItem during setup");
  swear.equals(bonafiedExplntns[2].callCount, 4, "call getItem during setup");
  swear.equals(bonafiedExplntns[3].callCount, 0, "call clear during setup");
});


test("pcs:bank:deck should not read previous values that are stale", async (swear) => {
  let impMeta, bonafiedResults = {}, bonafiedExplntns = [];
  const
    swearOrder = [
      0,  1,  2,  41,  4,  5,  6,  7,  8,  9, 10, 11, 27, 13, 14, 15, 16, 17, 18, 19, 49, 21, 22, 23, 24,
      25, 26, 12, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 3, 42, 43, 44, 45, 46, 47, 48, 20,
      50, 51
    ],
    swearBGC = 2,
    swearStaleOffset = (1000 * 60 * 60 * 24) * 8,
    swearLclStrg = tdObj(['setItem', 'removeItem', 'getItem', 'clear']),
    swearLSKeyPrefix = 'pcs-shell',
    swearLSKeys = [
      `${swearLSKeyPrefix}:backgroundColor`,
      `${swearLSKeyPrefix}:backgroundColor:stamp`,
      `${swearLSKeyPrefix}:cardOrder`,
      `${swearLSKeyPrefix}:cardOrder:stamp`
    ];


  tdStub(swearLclStrg.getItem(swearLSKeys[0])).thenReturn(JSON.stringify(swearBGC));
  tdStub(swearLclStrg.getItem(swearLSKeys[1])).thenReturn(JSON.stringify(Date.now() - swearStaleOffset));
  tdStub(swearLclStrg.getItem(swearLSKeys[2])).thenReturn(JSON.stringify(swearOrder));
  tdStub(swearLclStrg.getItem(swearLSKeys[3])).thenReturn(JSON.stringify(Date.now() - swearStaleOffset));

  impMeta = await getImport(swearLclStrg);

  bonafiedResults['sel'] = impMeta.freshModule.choice;
  bonafiedResults['bgc'] = impMeta.freshModule.backDrop;
  bonafiedResults['items'] = impMeta.freshModule.cards;

  bonafiedExplntns.push(tdExpl(swearLclStrg.setItem));
  bonafiedExplntns.push(tdExpl(swearLclStrg.removeItem));
  bonafiedExplntns.push(tdExpl(swearLclStrg.getItem));
  bonafiedExplntns.push(tdExpl(swearLclStrg.clear));
  tdClr();
  impMeta.freshModule = null;


  swear.plan(7);
  swear.equals(bonafiedResults['sel'].toString(), '0,0', "default selection index");
  swear.not(bonafiedResults['bgc'], swearBGC, "default bg color");
  swear.not(bonafiedResults['items'].every((_cur, _idx) => _cur === swearOrder[_idx]), "order is expected");
  swear.equals(bonafiedExplntns[0].callCount, 1, "call setItem during setup");
  swear.equals(bonafiedExplntns[1].callCount, 5, "call removeItem during setup");
  swear.equals(bonafiedExplntns[2].callCount, 4, "call getItem during setup");
  swear.equals(bonafiedExplntns[3].callCount, 0, "call clear during setup");
});
