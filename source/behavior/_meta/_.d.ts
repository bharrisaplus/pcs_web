// oxlint-disable @stylistic/max-len

/**
 * Type definitions for using ChanceJS
 *     adapted from -> npm:@types/chance
 */
interface chanceJS {
  pickset<T>(arr :T[], count ?:number) :T[];
};

declare global {
  // Tweaks for lib.dom.d.ts
  interface CustomEventListener { (evt: CustomEvent): void; }
  type EventListenerOrCustomEventListenerOrEventListenerObject = EventListener | CustomEventListener | EventListenerObject;
  interface HTMLElement extends Element, ElementCSSInlineStyle, ElementContentEditable, GlobalEventHandlers, HTMLOrSVGElement {
    addEventListener(type: string, listener: EventListenerOrCustomEventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
  }

  const chance :chanceJS;
}

export {};
