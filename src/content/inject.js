async function getCfg() {
  const defaults = window.getDefaultCfg();
  return await chrome.storage.sync.get(defaults);
}

async function run() {
  const cfg = await getCfg();
  const rects = await window.detectPIIRects(cfg);
  window.drawRects(rects);

  const hint = document.createElement('div');
  hint.textContent = `Page Whiteout: найдено фрагментов — ${rects.length}. Открой popup → Экспорт PNG.`;
  Object.assign(hint.style, {
    position:'fixed', right:'12px', bottom:'12px', padding:'8px 10px',
    background:'#111', color:'#fff', fontSize:'12px', borderRadius:'6px',
    zIndex:'2147483647', boxShadow:'0 4px 12px rgba(0,0,0,.2)'
  });
  document.body.appendChild(hint);
  setTimeout(()=> hint.remove(), 4000);
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'DO_EXPORT') window.exportWithRedact(msg.format || 'png');
});

run();