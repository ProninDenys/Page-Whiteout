let overlayRoot = null;

window.ensureOverlay = function() {
  if (overlayRoot) return overlayRoot;
  const host = document.createElement('div');
  Object.assign(host.style, {
    position: 'absolute', left: '0', top: '0',
    width: '0', height: '0', zIndex: '2147483647',
    pointerEvents: 'none'
  });
  document.documentElement.appendChild(host);
  overlayRoot = host; return overlayRoot;
};

window.clearOverlay = function() {
  if (overlayRoot) overlayRoot.innerHTML = '';
};

window.drawRects = function(rects) {
  window.ensureOverlay();
  window.clearOverlay();
  const frag = document.createDocumentFragment();
  rects.forEach(r => {
    const el = document.createElement('div');
    Object.assign(el.style, {
      position:'absolute',
      left:`${r.x}px`, top:`${r.y}px`,
      width:`${r.w}px`, height:`${r.h}px`,
      background:'#ffffff',
      borderRadius:'2px',
      pointerEvents:'none'
    });
    frag.appendChild(el);
  });
  overlayRoot.appendChild(frag);
};