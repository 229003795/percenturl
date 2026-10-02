(function () {
  'use strict';

  // Keep live errors and copy confirmations available to assistive technology.
  document.querySelectorAll('.warn, #io-warn, .errbox, [data-error-message]').forEach(function (message) {
    message.setAttribute('role', 'alert');
    message.setAttribute('aria-live', 'assertive');
    message.setAttribute('aria-atomic', 'true');
  });
  document.querySelectorAll('button.copy, button#copyBtn, button[data-copy-button]').forEach(function (button) {
    button.setAttribute('aria-live', 'polite');
    button.setAttribute('aria-atomic', 'true');
  });

  var path = window.location.pathname.replace(/\/+$/, '') || '/';
  if (path === '/' || /^\/(about|privacy|contact)$/.test(path)) return;

  var root = document.querySelector('main.wrap, .wrap');
  if (!root || root.querySelector('.detail-toc')) return;

  var headings = Array.from(root.querySelectorAll('h2')).filter(function (heading) {
    if (heading.closest('.reltools, .video-feature, footer, .tool-card')) return false;
    // The first numbered heading labels the primary tool. Keep the tool visible
    // before its navigation, then link to the explanatory sections below it.
    var number = heading.querySelector('.n');
    if (number && /^\s*1\s*$/.test(number.textContent)) return false;
    return true;
  });
  if (headings.length < 3) return;

  var usedIds = new Set(Array.from(root.querySelectorAll('[id]')).map(function (node) { return node.id; }));
  function slugFor(text) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'section';
  }

  var nav = document.createElement('nav');
  nav.className = 'detail-toc';
  nav.setAttribute('aria-label', 'On this page');
  var label = document.createElement('p');
  label.className = 'detail-toc-label';
  label.textContent = 'On this page';
  nav.appendChild(label);
  var list = document.createElement('ul');
  list.className = 'detail-toc-list';

  headings.forEach(function (heading) {
    if (!heading.id) {
      var baseId = slugFor(heading.textContent);
      var id = baseId;
      var suffix = 2;
      while (usedIds.has(id)) id = baseId + '-' + suffix++;
      heading.id = id;
      usedIds.add(id);
    }

    var item = document.createElement('li');
    var link = document.createElement('a');
    link.href = '#' + heading.id;
    var number = heading.querySelector('.n');
    var text = heading.cloneNode(true);
    if (number) text.removeChild(text.querySelector('.n'));
    link.textContent = text.textContent.replace(/^\s*[①②③④⑤⑥⑦⑧⑨⑩]+\s*/, '').replace(/\s+/g, ' ').trim();
    item.appendChild(link);
    list.appendChild(item);
  });

  nav.appendChild(list);
  headings[0].parentNode.insertBefore(nav, headings[0]);
}());
