/**
 * Regression tests for the centralized HTML sanitizer.
 * Every attack vector below has caused a real-world XSS in some app before —
 * we lock the hardened defaults against silent regression.
 */
import { describe, it, expect } from 'vitest';
import { sanitizeHtml, sanitizeContractHtml, sanitizePlainText } from '../sanitizeHtml';

describe('sanitizeHtml — baseline hardened profile', () => {
  it('strips <script> entirely', () => {
    const out = sanitizeHtml('<p>ok</p><script>alert(1)</script>');
    expect(out).not.toMatch(/<script/i);
    expect(out).not.toMatch(/alert/);
    expect(out).toContain('<p>ok</p>');
  });

  it.each([
    ['<img src=x onerror="alert(1)">'],
    ['<svg onload="alert(1)"></svg>'],
    ['<body onload="alert(1)">'],
    ['<button onclick="alert(1)">x</button>'],
    ['<input autofocus onfocus="alert(1)">'],
  ])('removes event handler attributes: %s', (payload) => {
    const out = sanitizeHtml(payload);
    // No `on*=` attribute may survive — regex targets attribute form only.
    expect(out).not.toMatch(/\son\w+\s*=/i);
    expect(out).not.toMatch(/alert/);
  });

  it.each([
    ['<a href="javascript:alert(1)">x</a>'],
    ['<a href="vbscript:msgbox(1)">x</a>'],
    ['<a href="data:text/html,<script>alert(1)</script>">x</a>'],
  ])('blocks unsafe URI schemes on href: %s', (payload) => {
    const out = sanitizeHtml(payload);
    expect(out).not.toMatch(/javascript:/i);
    expect(out).not.toMatch(/vbscript:/i);
    expect(out).not.toMatch(/data:text\/html/i);
  });

  it('preserves safe anchors (http, mailto, tel, hash)', () => {
    const out = sanitizeHtml(
      '<a href="https://x.com">a</a><a href="mailto:a@b.co">b</a><a href="tel:+55">c</a><a href="#top">d</a>'
    );
    expect(out).toContain('href="https://x.com"');
    expect(out).toContain('href="mailto:a@b.co"');
    expect(out).toContain('href="tel:+55"');
    expect(out).toContain('href="#top"');
  });

  it('forces rel="noopener noreferrer" on target=_blank anchors (tabnabbing)', () => {
    const out = sanitizeHtml('<a href="https://x.com" target="_blank">x</a>');
    expect(out).toMatch(/rel="noopener noreferrer"/);
  });

  it('forbids <iframe>, <object>, <embed>, <form>, <base>, <meta>, <link>', () => {
    const payload =
      '<iframe src="x"></iframe><object data="x"></object><embed src="x">' +
      '<form action="x"></form><base href="x"><meta http-equiv="refresh" content="0;x">' +
      '<link rel="stylesheet" href="x">';
    const out = sanitizeHtml(payload);
    for (const tag of ['iframe', 'object', 'embed', 'form', 'base', 'meta', 'link']) {
      expect(out).not.toMatch(new RegExp(`<${tag}`, 'i'));
    }
  });

  it('strips style attribute by default', () => {
    const out = sanitizeHtml('<p style="color:red">x</p>');
    expect(out).not.toMatch(/style=/);
  });

  it('returns empty string for non-string / empty input', () => {
    expect(sanitizeHtml(null)).toBe('');
    expect(sanitizeHtml(undefined)).toBe('');
    expect(sanitizeHtml(42)).toBe('');
    expect(sanitizeHtml('')).toBe('');
  });
});

describe('sanitizeContractHtml — allows inline style, still blocks executable content', () => {
  it('preserves style attribute (required by contract template)', () => {
    const out = sanitizeContractHtml('<p style="font-weight:bold">x</p>');
    expect(out).toMatch(/style="font-weight:bold"/);
  });

  it('still strips <style> ELEMENT (only the attribute is allowed)', () => {
    const out = sanitizeContractHtml('<style>body{background:red}</style><p>ok</p>');
    expect(out).not.toMatch(/<style/i);
    expect(out).toContain('<p>ok</p>');
  });

  it('blocks javascript: inside style url() via DOMPurify CSS parser', () => {
    const out = sanitizeContractHtml('<p style="background:url(javascript:alert(1))">x</p>');
    expect(out).not.toMatch(/javascript:/i);
  });

  it('still blocks scripts and event handlers even with allowStyle', () => {
    const out = sanitizeContractHtml(
      '<div style="color:blue"><script>alert(1)</script><img src=x onerror="alert(1)"></div>'
    );
    expect(out).not.toMatch(/<script/i);
    expect(out).not.toMatch(/\son\w+\s*=/i);
    expect(out).toMatch(/style="color:blue"/);
  });
});

describe('sanitizePlainText', () => {
  it('strips ALL html and enforces max length', () => {
    const out = sanitizePlainText('<b>hello</b> <script>x</script> world', 20);
    expect(out).not.toMatch(/<[a-z]/i);
    expect(out.length).toBeLessThanOrEqual(20);
    expect(out).toContain('hello');
  });

  it('returns empty string for non-string', () => {
    expect(sanitizePlainText(null)).toBe('');
    expect(sanitizePlainText({})).toBe('');
  });
});
