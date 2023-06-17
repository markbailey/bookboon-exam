import { createElement, Fragment, ReactNode } from 'react';

const HiddenProps = { style: { display: 'none' } } as const;

// Show function
// Renders the component and/or children props if the when property is true,
// otherwise returns null.
// @param when - whether the component / children should be visible or not
// @param component - the component to render
// @param unmountOnHide - whether the component / children should be unmounted when hidden
function show(when: boolean, component: ReactNode, unmountOnHide: boolean = false) {
  if (!when) return !unmountOnHide ? createElement('div', HiddenProps, component) : null;
  return createElement(Fragment, {}, component);
}

// Alias function for convenience
export const mount = (when: boolean, component: ReactNode) => show(when, component, true);
export default show;
