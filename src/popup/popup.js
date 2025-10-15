document.getElementById('start').addEventListener('click', async () => {
  await chrome.runtime.sendMessage({ type: "INJECT_CLEANSHOT" });
  window.close();
});
document.getElementById('exportPng').addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: "EXPORT_IMAGE", format: "png" });
});
document.getElementById('exportPdf').addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: "EXPORT_IMAGE", format: "pdf" });
});
document.getElementById('openOptions').addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});
document.getElementById('toggleDraw').addEventListener('click', () =>
  chrome.runtime.sendMessage({ type: "TOGGLE_DRAW" })
);

document.getElementById('undo').addEventListener('click', () =>
  chrome.runtime.sendMessage({ type: "UNDO" })
);

document.getElementById('clear').addEventListener('click', () =>
  chrome.runtime.sendMessage({ type: "CLEAR" })
);