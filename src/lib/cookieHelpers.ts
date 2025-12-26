export const getCookie = (name: string) => { const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)')); return match ? decodeURIComponent(match[2]) : null; };
export const setCookie = (name: string, value: string, days = 7) => { const date = new Date(); date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000); document.cookie = `${name}=${encodeURIComponent(value)};expires=${date.toUTCString()};path=/`; };
export const deleteCookie = (name: string) => { document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`; };
