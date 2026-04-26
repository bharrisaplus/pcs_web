// oxlint-disable @stylistic/max-len


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

  interface DOMParser {
      parseFromString(string: string, type: DOMParserSupportedType | string): Document;
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
}

export {};
