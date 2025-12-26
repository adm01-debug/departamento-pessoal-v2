export const fadeIn = (el: HTMLElement, duration = 300) => { el.style.opacity = '0'; el.style.transition = 'opacity ' + duration + 'ms'; requestAnimationFrame(() => el.style.opacity = '1'); };
export const fadeOut = (el: HTMLElement, duration = 300) => { el.style.transition = 'opacity ' + duration + 'ms'; el.style.opacity = '0'; };
export const slideDown = (el: HTMLElement, duration = 300) => { el.style.height = '0'; el.style.overflow = 'hidden'; el.style.transition = 'height ' + duration + 'ms'; requestAnimationFrame(() => el.style.height = el.scrollHeight + 'px'); };
