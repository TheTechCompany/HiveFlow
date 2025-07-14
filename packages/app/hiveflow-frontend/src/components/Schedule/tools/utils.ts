export const getHostForElement = (element: HTMLElement | EventTarget | null): Document | ShadowRoot =>
  ((element as Partial<HTMLElement> | null)?.getRootNode?.() as Document | ShadowRoot) || window?.document;
