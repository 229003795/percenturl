(function () {
  'use strict';
  function parseHex(value) {
    let text = value.trim();
    if (/^0x/i.test(text)) text = text.slice(2);
    if (!/^[0-9a-f\s]*$/i.test(text)) throw new Error('Use hex digits and spaces only; one leading 0x is allowed.');
    text = text.replace(/\s/g, '');
    if (text.length % 2) throw new Error('A byte needs two hex digits. The input has an incomplete byte.');
    return Uint8Array.from(text.match(/../g) || [], pair => parseInt(pair, 16));
  }
  function percentBytes(bytes) {
    return Array.from(bytes, byte => {
      if ((byte >= 65 && byte <= 90) || (byte >= 97 && byte <= 122) ||
          (byte >= 48 && byte <= 57) || [45, 46, 95, 126].includes(byte)) return String.fromCharCode(byte);
      return '%' + byte.toString(16).toUpperCase().padStart(2, '0');
    }).join('');
  }
  function convert(value, mode) {
    if (value.length > 100000) throw new Error('Please use 100,000 characters or fewer.');
    const bytes = mode === 'text' ? new TextEncoder().encode(value) : parseHex(value);
    let text;
    try { text = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(bytes); }
    catch (_) { text = null; }
    return { hex: Array.from(bytes, x => x.toString(16).toUpperCase().padStart(2, '0')).join(' '),
      percent: percentBytes(bytes), text, length: bytes.length };
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = { parseHex, percentBytes, convert };
  if (typeof document === 'undefined') return;
  const input = document.getElementById('hex-input');
  const mode = document.getElementById('hex-mode');
  function run() {
    const error = document.getElementById('hex-error');
    try {
      const result = convert(input.value, mode.value);
      document.getElementById('hex-bytes').value = result.hex;
      document.getElementById('hex-output').value = result.percent;
      document.getElementById('hex-preview').textContent = result.text === null
        ? 'Not valid UTF-8. The byte output is available, but do not treat it as Unicode text.'
        : result.length ? JSON.stringify(result.text) : 'No bytes yet.';
      document.getElementById('hex-count').textContent = result.length + ' byte' + (result.length === 1 ? '' : 's');
      error.textContent = '';
    } catch (e) {
      document.getElementById('hex-bytes').value = '';
      document.getElementById('hex-output').value = '';
      document.getElementById('hex-preview').textContent = '';
      document.getElementById('hex-count').textContent = '';
      error.textContent = e.message;
    }
  }
  input.addEventListener('input', run);
  mode.addEventListener('change', run);
  run();
}());
