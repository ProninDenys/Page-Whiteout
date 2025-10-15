window.PW = window.PW || {
  cfg: null,
  autoRects: [],
  manualRects: [],
  drawing: false,
  start: null
};

function mergeAndDraw() {
  const all = [...(window.PW.autoRects || []), ...(window.PW.manualRects || [])];
  window.drawRects(all);
}

async function initialScan() {
  window.PW.cfg = await chrome.storage.sync.get(window.getDefaultCfg());
  window.PW.autoRects = await window.detectPIIRects(window.PW.cfg);
  mergeAndDraw();

  const hint = document.createElement('div');
  hint.textContent = `Page Whiteout: found ${window.PW.autoRects.length} fragments. Open popup → Export PNG.`;
  Object.assign(hint.style, {
    position:'fixed', right:'12px', bottom:'12px', padding:'8px 10px',
    background:'#111', color:'#fff', fontSize:'12px', borderRadius:'6px',
    zIndex:'2147483647', boxShadow:'0 4px 12px rgba(0,0,0,.2)'
  });
  document.body.appendChild(hint);
  setTimeout(()=> hint.remove(), 4000);
}

function toggleDraw() {
  window.PW.drawing = !window.PW.drawing;
  document.documentElement.style.cursor = window.PW.drawing ? 'crosshair' : '';
  window.getSelection()?.removeAllRanges();
  window.hideGhost();
}

function onMouseDown(e) {
  if (!window.PW.drawing) return;
  e.preventDefault(); e.stopPropagation();
  window.PW.start = { x: e.clientX + window.scrollX, y: e.clientY + window.scrollY };
}

function onMouseMove(e) {
  if (!window.PW.drawing || !window.PW.start) return;
  const sx = window.PW.start.x, sy = window.PW.start.y;
  const ex = e.clientX + window.scrollX, ey = e.clientY + window.scrollY;
  const x = Math.min(sx, ex), y = Math.min(sy, ey);
  const w = Math.abs(ex - sx), h = Math.abs(ey - sy);
  window.showGhost(x, y, w, h);
}

function onMouseUp(e) {
  if (!window.PW.drawing || !window.PW.start) return;
  e.preventDefault(); e.stopPropagation();
  const sx = window.PW.start.x, sy = window.PW.start.y;
  const ex = e.clientX + window.scrollX, ey = e.clientY + window.scrollY;
  window.PW.start = null;
  window.hideGhost();

  const x = Math.min(sx, ex), y = Math.min(sy, ey);
  const w = Math.abs(ex - sx), h = Math.abs(ey - sy);
  if (w > 3 && h > 3) {
    window.PW.manualRects.push({ x, y, w, h, type:'manual' });
    mergeAndDraw();
  }
}

function onKeyDown(e) {
  if (e.key === 'd' || e.key === 'D') {
    toggleDraw();
  } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
    window.PW.manualRects.pop();
    mergeAndDraw();
  } else if (e.key === 'Escape') {
    if (window.PW.drawing) toggleDraw();
  }
}

function attachListeners() {
  document.addEventListener('mousedown', onMouseDown, true);
  document.addEventListener('mousemove', onMouseMove, true);
  document.addEventListener('mouseup', onMouseUp, true);
  document.addEventListener('keydown', onKeyDown, true);
}

attachListeners();

// слушаем команды из popup/service worker
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'RUN_SCAN') initialScan();
  if (msg.type === 'TOGGLE_DRAW') toggleDraw();
  if (msg.type === 'UNDO') { window.PW.manualRects.pop(); mergeAndDraw(); }
  if (msg.type === 'CLEAR') { window.PW.manualRects = []; mergeAndDraw(); }
  if (msg.type === 'DO_EXPORT') window.exportWithRedact(msg.format || 'png');
});

// автозапуск при первой инжекции
initialScan();