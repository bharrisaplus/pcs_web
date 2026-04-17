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
  interface CustomEventListener { (evt: CustomEvent): void; };
  type EventListenerOrCustomEventListenerOrEventListenerObject = EventListener | CustomEventListener | EventListenerObject;

  interface HTMLElement extends Element, ElementCSSInlineStyle, ElementContentEditable, GlobalEventHandlers, HTMLOrSVGElement {
    addEventListener(type: string, listener: EventListenerOrCustomEventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
  };

  interface HTMLBodyElement extends HTMLElement, WindowEventHandlers {
    addEventListener(type: string, listener: EventListenerOrCustomEventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
  }

  // See /build/manifest.mjs
  type BuildGlobals = {
    project_path: string;
    behavior_path: string;
    demo_path: string;
    dev_path: string;
    octocat_path: string;
    filehost_url: string;
    localhost_url: string;
    es_main: string;
  };

  // ChanceJS browser global
  const chance :chanceJS;
}

export {};
