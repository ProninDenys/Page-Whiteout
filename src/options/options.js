const defaults = { autoRun:false, detectEmail:true, detectPhone:true, detectCard:true, detectIban:true, pad:2 };

async function load() {
  const cfg = await chrome.storage.sync.get(defaults);
  autoRun.checked   = cfg.autoRun;
  detectEmail.checked = cfg.detectEmail;
  detectPhone.checked = cfg.detectPhone;
  detectCard.checked  = cfg.detectCard;
  detectIban.checked  = cfg.detectIban;
  pad.value = cfg.pad;
}
save.addEventListener('click', async () => {
  const cfg = {
    autoRun: autoRun.checked,
    detectEmail: detectEmail.checked,
    detectPhone: detectPhone.checked,
    detectCard:  detectCard.checked,
    detectIban:  detectIban.checked,
    pad: parseInt(pad.value || '2', 10)
  };
  await chrome.storage.sync.set(cfg);
  alert('Saved');
});
load();