(() => {
  const measurementId = 'G-M593YZ4M42';
  const storageKey = 'percenturl-analytics-consent';
  const savedChoice = localStorage.getItem(storageKey);
  let loaded = false;

  function loadAnalytics() {
    if (loaded) return;
    loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      page_location: window.location.origin + window.location.pathname
    });
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);
  }

  function showConsent() {
    let banner = document.getElementById('percenturl-analytics-consent');
    if (!banner) {
      banner = document.createElement('section');
      banner.id = 'percenturl-analytics-consent';
      banner.setAttribute('role', 'dialog');
      banner.setAttribute('aria-label', 'Optional analytics');
      banner.innerHTML = `
        <style>
          #percenturl-analytics-consent{position:fixed;z-index:9999;inset:auto 0 0;background:#0f172a;color:#f8fafc;
            border-top:1px solid #475569;padding:16px 20px;box-shadow:0 -8px 28px #0005;font:14px/1.5 system-ui,sans-serif}
          #percenturl-analytics-consent .pac-inner{max-width:1100px;margin:auto;display:flex;align-items:center;gap:16px;flex-wrap:wrap}
          #percenturl-analytics-consent p{margin:0;flex:1;min-width:240px}
          #percenturl-analytics-consent a{color:#7dd3fc}
          #percenturl-analytics-consent .pac-actions{display:flex;gap:8px;flex-wrap:wrap}
          #percenturl-analytics-consent button{border:1px solid #94a3b8;border-radius:7px;padding:8px 12px;background:transparent;
            color:#f8fafc;font:inherit;cursor:pointer}
          #percenturl-analytics-consent button[data-choice="allow"]{background:#38bdf8;border-color:#38bdf8;color:#082f49;font-weight:650}
          #percenturl-analytics-consent button:focus-visible{outline:3px solid #facc15;outline-offset:2px}
          @media(max-width:600px){#percenturl-analytics-consent{padding:14px}#percenturl-analytics-consent .pac-actions{width:100%}
            #percenturl-analytics-consent button{flex:1}}
        </style>
        <div class="pac-inner">
          <p>We use optional Google Analytics to understand visits and improve this site. It starts only if you allow it. Text entered into the tools is not sent to Google. <a href="/privacy">Privacy details</a>.</p>
          <div class="pac-actions">
            <button type="button" data-choice="deny">Continue without analytics</button>
            <button type="button" data-choice="allow">Allow analytics</button>
          </div>
        </div>`;
      document.body.appendChild(banner);
      banner.addEventListener('click', (event) => {
        const choice = event.target.closest('button')?.dataset.choice;
        if (!choice) return;
        localStorage.setItem(storageKey, choice === 'allow' ? 'granted' : 'denied');
        banner.remove();
        if (choice === 'allow') loadAnalytics();
      });
    }
    banner.hidden = false;
  }

  window.PercentUrlAnalytics = {
    changeChoice() {
      localStorage.removeItem(storageKey);
      showConsent();
    }
  };

  document.getElementById('change-analytics-choice')?.addEventListener('click', () => {
    window.PercentUrlAnalytics.changeChoice();
  });

  if (savedChoice === 'granted') loadAnalytics();
  else if (!savedChoice) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', showConsent, { once: true });
    } else {
      showConsent();
    }
  }
})();
