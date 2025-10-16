// detector.js — guarded single-load
window.PW = window.PW || {};
if (!window.PW.__detectorLoaded) {
  window.PW.__detectorLoaded = true;

  (function () {
    // Регэкспы (MVP)
    const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/ig;
    const PHONE_RE = /(\+?\d{1,3}[\s-]?)?(\(?\d{2,4}\)?[\s-]?)?[\d\s-]{5,12}/g;
    const IBAN_RE  = /\b[A-Z]{2}\d{2}[A-Z0-9]{11,30}\b/g;
    const CARD_RE  = /\b(?:\d[ -]*?){13,19}\b/g;

    function* textNodes(root) {
      const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode(n) {
          const t = n.nodeValue;
          if (!t || !t.trim()) return NodeFilter.FILTER_REJECT;
          const p = n.parentElement;
          if (p) {
            const cs = getComputedStyle(p);
            if (cs.visibility === 'hidden' || cs.display === 'none') return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      });
      let n; while (n = tw.nextNode()) yield n;
    }

    window.detectPIIRects = async function (config) {
      const rects = [];
      const pad = Number(config.pad || 2);

      for (const node of textNodes(document.body)) {
        const text = node.nodeValue;
        const checks = [];
        if (config.detectEmail) checks.push({ re: EMAIL_RE, type:'email' });
        if (config.detectPhone) checks.push({ re: PHONE_RE, type:'phone' });
        if (config.detectIban)  checks.push({ re: IBAN_RE,  type:'iban'  });
        if (config.detectCard)  checks.push({ re: CARD_RE,  type:'card'  });

        for (const {re, type} of checks) {
          re.lastIndex = 0;
          let m;
          while ((m = re.exec(text)) !== null) {
            if (type === 'card' && !window.isLuhnValid(m[0])) continue;
            const range = document.createRange();
            range.setStart(node, m.index);
            range.setEnd(node, m.index + m[0].length);
            const rs = range.getClientRects();
            for (const r of rs) {
              if (r.width < 1 || r.height < 1) continue;
              rects.push({
                x: Math.floor(r.left + window.scrollX) - pad,
                y: Math.floor(r.top  + window.scrollY) - pad,
                w: Math.ceil(r.width)  + pad*2,
                h: Math.ceil(r.height) + pad*2,
                type
              });
            }
            range.detach();
          }
        }
      }
      return rects;
    };
  })();
}