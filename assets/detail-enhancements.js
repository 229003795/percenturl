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
  var root = document.querySelector('main.wrap, .wrap');
  if (!root) return;

  function fireInput(element) {
    if (element) element.dispatchEvent(new Event('input', { bubbles: true }));
  }

  function activeValue(group) {
    var selected = document.querySelector('.seg[data-k="' + group + '"] button.active');
    return selected ? selected.dataset.v : '';
  }

  function loadExample() {
    var input = document.getElementById('in');
    if (path === '/') {
      var fullUrl = activeValue('target') === 'url';
      input.value = fullUrl ? 'https://example.com/café?q=tea & biscuits' : 'café & tea';
      document.getElementById('encBtn').click();
      input.focus();
      return;
    }
    if (path === '/url-decoder') {
      document.getElementById('m-sample').click();
      return;
    }
    if (path === '/base64') {
      input.value = activeValue('mode') === 'decode' ? 'SGVsbG8sIGNhZsOpIQ==' : 'Hello, café!';
      fireInput(input);
      input.focus();
      return;
    }
    if (path === '/html-entities') {
      input.value = activeValue('mode') === 'decode'
        ? '&lt;a href=&quot;?q=a&amp;b=c&quot;&gt;Tom &amp; Jerry&lt;/a&gt;'
        : '<a href="?q=a&b=c">Tom & Jerry</a>';
      fireInput(input);
      input.focus();
      return;
    }
    if (path === '/jwt') {
      if (activeValue('mode') === 'encode') {
        document.getElementById('encHeader').value = '{\n  "alg": "HS256",\n  "typ": "JWT"\n}';
        document.getElementById('encPayload').value = '{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "iat": 1516239022\n}';
        document.getElementById('secret').value = 'your-256-bit-secret';
        fireInput(document.getElementById('encHeader'));
        fireInput(document.getElementById('encPayload'));
        fireInput(document.getElementById('secret'));
      } else {
        input.value = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
        fireInput(input);
      }
      input.focus();
      return;
    }
    if (path === '/utm-builder') {
      document.getElementById('f_url').value = 'https://example.com/summer';
      document.getElementById('f_source').value = 'newsletter';
      document.getElementById('f_medium').value = 'email';
      document.getElementById('f_campaign').value = 'summer-sale';
      fireInput(document.getElementById('f_campaign'));
      document.getElementById('f_url').focus();
      return;
    }
    if (path === '/javascript') {
      var fn = activeValue('fn');
      var isUrl = activeValue('target') === 'url';
      input.value = fn === 'decodeURIComponent'
        ? (isUrl ? 'https://example.com/caf%C3%A9?q=hello%20world' : 'caf%C3%A9%20%26%20tea')
        : (isUrl ? 'https://example.com/café?q=hello world' : 'café & tea');
      fireInput(input);
      document.getElementById('encBtn').click();
      input.focus();
    }
  }

  var sampleButton = document.getElementById('m-sample');
  if (sampleButton) {
    sampleButton.textContent = 'Load example';
    sampleButton.setAttribute('aria-label', 'Load and run an example');
    sampleButton.addEventListener('click', function () {
      var original = 'Load example';
      sampleButton.textContent = 'Example loaded';
      sampleButton.setAttribute('aria-label', 'Example loaded and processed');
      window.setTimeout(function () {
        sampleButton.textContent = original;
        sampleButton.setAttribute('aria-label', 'Load and run an example');
      }, 1400);
    });
  } else {
    var exampleLabel = root.querySelector('label[for="in"], label[for="f_url"]');
    if (exampleLabel && ['/','/base64','/html-entities','/jwt','/utm-builder','/javascript'].indexOf(path) !== -1) {
      var labelRow = document.createElement('div');
      labelRow.className = 'sample-label-row';
      exampleLabel.parentNode.insertBefore(labelRow, exampleLabel);
      labelRow.appendChild(exampleLabel);
      var button = document.createElement('button');
      button.className = 'btn sample-btn';
      button.type = 'button';
      button.textContent = 'Load example';
      button.addEventListener('click', loadExample);
      button.addEventListener('click', function () {
        button.textContent = 'Example loaded';
        button.setAttribute('aria-label', 'Example loaded and processed');
        window.setTimeout(function () {
          button.textContent = 'Load example';
          button.removeAttribute('aria-label');
        }, 1400);
      });
      labelRow.appendChild(button);
    }
  }

  if (path === '/' || /^\/(about|privacy|contact)$/.test(path) || root.querySelector('.detail-toc')) return;

  Array.from(root.querySelectorAll('table')).forEach(function (table, index) {
    if (table.parentElement.classList.contains('responsive-table')) return;
    var wrapper = document.createElement('div');
    wrapper.className = 'responsive-table';
    wrapper.tabIndex = 0;
    wrapper.setAttribute('role', 'region');
    var sectionHeading = table.closest('section') && table.closest('section').querySelector('h2, h3');
    var previousHeading = table.previousElementSibling;
    var heading = sectionHeading || (previousHeading && /^H[1-6]$/.test(previousHeading.tagName) ? previousHeading : null);
    wrapper.setAttribute('aria-label', (heading ? heading.textContent.trim() + ': ' : '') + 'Scrollable table ' + (index + 1));
    table.parentNode.insertBefore(wrapper, table);
    wrapper.appendChild(table);
    var hint = document.createElement('span');
    hint.className = 'table-scroll-hint';
    hint.setAttribute('aria-hidden', 'true');
    hint.textContent = 'Swipe or scroll to see the full table →';
    wrapper.after(hint);
    function updateOverflow() {
      var overflowing = wrapper.scrollWidth > wrapper.clientWidth + 2;
      wrapper.classList.toggle('is-overflowing', overflowing);
      hint.hidden = !overflowing;
    }
    updateOverflow();
    if ('ResizeObserver' in window) new ResizeObserver(updateOverflow).observe(wrapper);
    window.addEventListener('resize', updateOverflow, { passive: true });
  });

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
