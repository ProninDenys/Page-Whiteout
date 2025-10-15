// Требует window.html2canvas (из vendor)
async function getCfg() {
  const defaults = window.getDefaultCfg();
  return await chrome.storage.sync.get(defaults);
}

window.exportWithRedact = async function(format = 'png') {
  const cfg = await getCfg();
  const rects = await window.detectPIIRects(cfg);

  const canvas = await window.html2canvas(document.documentElement, {
    windowWidth: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
    windowHeight: Math.max(document.documentElement.scrollHeight, document.body.scrollHeight),
    backgroundColor: '#ffffff',
    useCORS: true,
    removeContainer: true,
    logging: false,
    scale: 1
  });

  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  rects.forEach(r => ctx.fillRect(r.x, r.y, r.w, r.h));

  // MVP: всегда PNG; PDF добавим позже
  canvas.toBlob(blob => {
    const url = URL.createObjectURL(blob);
    chrome.downloads.download({
      url, filename: `page-whiteout_${Date.now()}.png`, saveAs: true
    });
  }, 'image/png', 0.92);
};