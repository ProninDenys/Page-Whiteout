let overlayRoot = null;
let ghostBox = null;

window.ensureOverlay = function() {
  if (overlayRoot) return overlayRoot;
  const host = document.createElement('div');
  Object.assign(host.style, {
    position: 'absolute',
    left: '0', top: '0',
    width: '0', height: '0',
    zIndex: '2147483647',
    pointerEvents: 'none'
  });
  document.documentElement.appendChild(host);
  overlayRoot = host;
  return overlayRoot;
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

window.showGhost = function(x,y,w,h) {
  window.ensureOverlay();
  if (!ghostBox) {
    ghostBox = document.createElement('div');
    Object.assign(ghostBox.style, {
      position:'absolute',
      outline:'2px dashed #4A90E2',
      background:'rgba(255,255,255,0.3)',
      pointerEvents:'none',
      zIndex:'2147483647'
    });
    overlayRoot.appendChild(ghostBox);
  }
 Object.assign(el.style, {
  position:'absolute',
  left:`${r.x}px`, top:`${r.y}px`,
  width:`${r.w}px`, height:`${r.h}px`,
  background:'rgba(255, 230, 0, 0.35)',   // заметный жёлтый хайлайт
  outline:'2px solid #ff3b30',            // красная рамка
  borderRadius:'3px',
  pointerEvents:'none'
});
};

window.hideGhost = function() {
  if (ghostBox) ghostBox.style.display = 'none';
};