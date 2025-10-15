async function getActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

async function injectAll(tabId) {
  // vendor
  await chrome.scripting.executeScript({
    target: { tabId },
    files: ["src/vendor/html2canvas.min.js"]
  });
  // наш порядок важен
  await chrome.scripting.executeScript({
    target: { tabId },
    files: [
      "src/content/utils.js",
      "src/content/detector.js",
      "src/content/overlay.js",
      "src/content/exporter.js",
      "src/content/inject.js"
    ]
  });
}

chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  if (msg.type === "INJECT_CLEANSHOT") {
    const tab = await getActiveTab();
    await injectAll(tab.id);
    sendResponse({ ok: true });
  }
  if (msg.type === "EXPORT_IMAGE") {
    const tab = await getActiveTab();
    chrome.tabs.sendMessage(tab.id, { type: "DO_EXPORT", format: msg.format || "png" });
  }
});