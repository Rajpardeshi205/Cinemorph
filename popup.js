const DEFAULTS = { enabled: true, accent: "#e50914", contrast: 60, width: 0, rounded: true };
const els = {
  enabled: document.getElementById("enabled"),
  accent: document.getElementById("accent"),
  contrast: document.getElementById("contrast"),
  width: document.getElementById("width"),
  rounded: document.getElementById("rounded"),
};

function paint(s) {
  els.enabled.checked = s.enabled;
  els.accent.value = s.accent;
  els.contrast.value = s.contrast;
  els.width.value = s.width;
  els.rounded.checked = s.rounded;
  document.body.style.setProperty("--accent", s.accent);
}

function save() {
  const s = {
    enabled: els.enabled.checked,
    accent: els.accent.value,
    contrast: Number(els.contrast.value),
    width: Number(els.width.value),
    rounded: els.rounded.checked,
  };
  document.body.style.setProperty("--accent", s.accent);
  chrome.storage.local.set(s);
}

chrome.storage.local.get(DEFAULTS, (s) => paint({ ...DEFAULTS, ...s }));
Object.values(els).forEach((el) => el.addEventListener("input", save));
document.getElementById("reset").addEventListener("click", () => {
  chrome.storage.local.set(DEFAULTS);
  paint(DEFAULTS);
});
