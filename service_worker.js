async function injectAll(tabId) {
  await chrome.scripting.executeScript({ target: { tabId }, files: ["src/vendor/html2canvas.min.js"] });
  await chrome.scripting.executeScript({
    target: { tabId },
    files: ["src/content/utils.js","src/content/detector.js","src/content/overlay.js","src/content/exporter.js","src/content/inject.js"]
  });
}

// сначала пытаемся послать сообщение, если некуда — инжектим и шлём ещё раз
function sendOrInject(tabId, msg) {
  chrome.tabs.sendMessage(tabId, msg, async () => {
    if (chrome.runtime.lastError) {
      await injectAll(tabId);
      chrome.tabs.sendMessage(tabId, msg, () => {});
    }
  });
}

chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  const [tab] = await chrome.tabs.query({ active:true, currentWindow:true });
  if (!tab?.id) return;

  if (msg.type === "INJECT_CLEANSHOT") { sendOrInject(tab.id, { type:"RUN_SCAN" }); sendResponse({ok:true}); return true; }
  if (msg.type === "EXPORT_IMAGE")    { sendOrInject(tab.id, { type:"DO_EXPORT", format: msg.format || "png" }); return true; }
  if (["TOGGLE_DRAW","UNDO","CLEAR"].includes(msg.type)) { sendOrInject(tab.id, { type: msg.type }); return true; }
});

// авто-запуск при загрузке страницы (если включен в настройках)
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === 'complete') {
    chrome.storage.sync.get({ autoRun:false }, async (cfg) => {
      if (cfg.autoRun) {
        try { await injectAll(tabId); } catch (e) { /* игнор внутренних страниц */ }
      }
    });
  }
});