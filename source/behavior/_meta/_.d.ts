
/**
 * Type definitions for using ChanceJS
 *     adapted from -> npm:@types/chance
 */
interface chanceJS {
  pickset<T>(arr :T[], count ?:number) :T[];
}

declare global {
  const chance :chanceJS;
}

export {};
