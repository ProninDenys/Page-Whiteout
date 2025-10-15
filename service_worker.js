async function forwardToContent(type, payload={}) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return;
  // на всякий случай убедимся, что скрипты уже инжектнуты
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["src/vendor/html2canvas.min.js",
            "src/content/utils.js",
            "src/content/detector.js",
            "src/content/overlay.js",
            "src/content/exporter.js",
            "src/content/inject.js"]
  });
  chrome.tabs.sendMessage(tab.id, { type, ...payload });
}

chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  if (msg.type === "INJECT_CLEANSHOT") {
    const [tab] = await chrome.tabs.query({ active:true, currentWindow:true });
    await forwardToContent("RUN_SCAN");
    sendResponse({ ok:true });
    return true;
  }
  if (msg.type === "EXPORT_IMAGE") {
    await forwardToContent("DO_EXPORT", { format: msg.format || "png" });
    return true;
  }
  if (["TOGGLE_DRAW","UNDO","CLEAR"].includes(msg.type)) {
    await forwardToContent(msg.type);
    return true;
  }
});