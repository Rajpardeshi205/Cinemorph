/* Cinemorph — turns YouTube into a Netflix-style experience.
   Only runs on youtube.com. */

(() => {
  const HOST = location.hostname;
  if (!/(^|\.)youtube\.com$/.test(HOST)) return;

  const DEFAULTS = {
    enabled: true,
    accent: "#e50914",
    contrast: 100,
    rounded: true,
  };

  const ROW_TITLES = [
    "Trending Now",
    "From Your Subscriptions",
    "Watch It Again",
    "Popular on YouTube",
    "New Releases",
    "Because You Watched",
    "Top Picks For You",
    "Continue Watching",
    "Only on YouTube",
    "Trending in India",
    "Critically Acclaimed",
    "Binge-worthy Picks",
  ];

  /* ---------------- styles ---------------- */
  const css = (a, rounded) => `
:root.cinemorph-on {
  --cm-accent: ${a};
  --cm-bg: #0b0b0b;
  --cm-surface: #141414;
  --cm-card-radius: ${rounded ? "5px" : "0px"};
}

/* base darkening */
html.cinemorph-on, html.cinemorph-on body,
html.cinemorph-on ytd-app, html.cinemorph-on #content.ytd-app,
html.cinemorph-on ytd-page-manager, html.cinemorph-on ytd-browse,
html.cinemorph-on ytd-two-column-browse-results-renderer,
html.cinemorph-on ytd-rich-grid-renderer {
  background: var(--cm-bg) !important;
}
html.cinemorph-on { filter: contrast(var(--cm-contrast, 100%)); }

/* ---- kill YouTube chrome ---- */
html.cinemorph-on #guide, html.cinemorph-on ytd-mini-guide-renderer,
html.cinemorph-on tp-yt-app-drawer#guide,
html.cinemorph-on ytd-feed-filter-chip-bar-renderer,
html.cinemorph-on #chips-wrapper,
html.cinemorph-on ytd-masthead #guide-button,
html.cinemorph-on ytd-mini-guide-renderer,
html.cinemorph-on #masthead-ad,
html.cinemorph-on ytd-banner-promo-renderer { display: none !important; }

html.cinemorph-on ytd-page-manager#page-manager { margin-left: 0 !important; }
html.cinemorph-on #contentContainer.tp-yt-app-drawer { --app-drawer-width: 0 !important; }

/* ---- YouTube-branded cinematic top bar ---- */
html.cinemorph-on #masthead-container ytd-masthead {
  background: transparent !important;
  border: 0 !important;
  height: 72px !important;
  padding: 0 4.2vw !important;
}
html.cinemorph-on #masthead-container {
  background: linear-gradient(180deg, rgba(5,5,5,.98) 0%, rgba(5,5,5,.82) 62%, rgba(5,5,5,0)) !important;
  border: 0 !important;
  box-shadow: none !important;
}
html.cinemorph-on ytd-topbar-logo-renderer,
html.cinemorph-on ytd-topbar-logo-renderer #logo,
html.cinemorph-on ytd-topbar-logo-renderer #logo-icon,
html.cinemorph-on ytd-topbar-logo-renderer svg {
  display: flex !important;
  visibility: visible !important;
  opacity: 1 !important;
}
html.cinemorph-on ytd-topbar-logo-renderer {
  width: 104px !important;
  min-width: 104px !important;
}
#cm-nav {
  display: flex; align-items: center; gap: 22px;
  margin-left: 28px; font-family: "Helvetica Neue", Arial, sans-serif;
  font-size: 14px; white-space: nowrap;
}
#cm-nav a { color: #e5e5e5; text-decoration: none; opacity: .82; }
#cm-nav a:first-child { color: #fff; font-weight: 700; opacity: 1; }
#cm-nav a:hover { opacity: 1; }
@media (max-width: 1100px) { #cm-nav { display: none; } }

/* ---- Netflix-style search using YouTube's real search ---- */
html.cinemorph-on ytd-masthead #center {
  flex: 0 1 430px !important;
  margin-left: auto !important;
  margin-right: 22px !important;
}
html.cinemorph-on ytd-searchbox,
html.cinemorph-on ytd-searchbox #container,
html.cinemorph-on #search-form.ytd-searchbox {
  background: rgba(10,10,10,.76) !important;
  border: 1px solid rgba(255,255,255,.62) !important;
  border-radius: 2px !important;
  box-shadow: none !important;
}
html.cinemorph-on ytd-searchbox:focus-within,
html.cinemorph-on ytd-searchbox #container:focus-within {
  border-color: #fff !important;
  background: #090909 !important;
}
html.cinemorph-on ytd-searchbox input {
  color: #fff !important;
  font-family: "Helvetica Neue", Arial, sans-serif !important;
  font-size: 14px !important;
}
html.cinemorph-on #search-icon-legacy {
  background: rgba(255,255,255,.12) !important;
  border: 0 !important;
  border-radius: 0 !important;
}
html.cinemorph-on ytd-searchbox-spt,
html.cinemorph-on .sbsb_a,
html.cinemorph-on yt-searchbox-dropdown {
  background: #181818 !important;
  color: #fff !important;
  border: 1px solid #333 !important;
}

/* ---- Billboard hero ---- */
#cm-billboard {
  position: relative;
  height: 78vh;
  min-height: 520px;
  margin: -68px 0 8px -24px;
  width: calc(100% + 48px);
  color: #fff;
  display: flex;
  align-items: center;
  overflow: hidden;
  background: #000;
}
#cm-billboard .cm-bb-img {
  position: absolute; inset: 0;
  background-size: cover; background-position: center 30%;
  transform: scale(1.05);
}
#cm-billboard .cm-bb-fade {
  position: absolute; inset: 0;
  background:
    linear-gradient(90deg, rgba(0,0,0,.92) 0%, rgba(0,0,0,.65) 42%, rgba(0,0,0,0) 72%),
    linear-gradient(0deg, var(--cm-bg) 2%, rgba(0,0,0,0) 45%);
}
#cm-billboard .cm-bb-body {
  position: relative; z-index: 2;
  padding: 0 0 0 4.2vw; max-width: min(620px, 46%);
}
#cm-billboard h1 {
  font-family: "Helvetica Neue", Arial, sans-serif;
  font-size: clamp(30px, 3.6vw, 58px);
  line-height: 1.05; font-weight: 800; margin: 0 0 16px;
  letter-spacing: 0;
  text-shadow: 0 4px 24px rgba(0,0,0,.7);
}
#cm-billboard .cm-bb-meta { font-size: 14px; color: #d2d2d2; margin-bottom: 22px; }
#cm-billboard .cm-bb-actions { display: flex; gap: 12px; }
#cm-billboard button {
  display: inline-flex; align-items: center; gap: 10px;
  border: 0; cursor: pointer; border-radius: 4px;
  padding: 11px 26px; font-size: 17px; font-weight: 700;
  font-family: inherit;
}
#cm-billboard .cm-play { background: #fff; color: #000; }
#cm-billboard .cm-play:hover { background: #d9d9d9; }
#cm-billboard .cm-info { background: rgba(109,109,110,.7); color: #fff; }
#cm-billboard .cm-info:hover { background: rgba(109,109,110,.5); }
#cm-billboard .cm-badge {
  position: absolute; right: 0; bottom: 22%; z-index: 2;
  background: rgba(51,51,51,.6); border-left: 3px solid #ddd;
  padding: 6px 34px 6px 12px; font-size: 15px;
}

/* ---- Rows ---- */
html.cinemorph-on ytd-rich-grid-renderer #contents { padding: 0 !important; }
html.cinemorph-on ytd-rich-grid-row #contents {
  display: flex !important;
  flex-wrap: nowrap !important;
  gap: 10px !important;
  overflow-x: auto !important;
  overflow-y: hidden !important;
  padding: 8px 4.2vw 42px !important;
  scrollbar-width: none;
  scroll-snap-type: x proximity;
}
html.cinemorph-on ytd-rich-grid-row #contents::-webkit-scrollbar { display: none; }
html.cinemorph-on ytd-rich-grid-row {
  margin: 0 !important;
  --ytd-rich-grid-items-per-row: 6 !important;
}
html.cinemorph-on ytd-rich-item-renderer {
  flex: 0 0 auto !important;
  width: clamp(240px, 18.5vw, 310px) !important;
  max-width: 310px !important;
  margin: 0 !important;
  transition: transform .28s ease, z-index 0s;
  scroll-snap-align: start;
}
html.cinemorph-on ytd-rich-item-renderer:hover {
  transform: scale(1.08);
  z-index: 30;
  position: relative;
}
html.cinemorph-on ytd-rich-item-renderer #dismissible { background: transparent !important; }
html.cinemorph-on ytd-thumbnail, html.cinemorph-on ytd-thumbnail img,
html.cinemorph-on yt-image img {
  border-radius: var(--cm-card-radius) !important;
}
/* hide metadata until hover, Netflix-style */
html.cinemorph-on ytd-rich-item-renderer #details,
html.cinemorph-on ytd-rich-item-renderer #meta {
  opacity: 0; transition: opacity .2s ease; max-height: 0; overflow: hidden;
}
html.cinemorph-on ytd-rich-item-renderer:hover #details,
html.cinemorph-on ytd-rich-item-renderer:hover #meta {
  opacity: 1; max-height: 120px;
}
html.cinemorph-on ytd-rich-item-renderer #avatar-link,
html.cinemorph-on ytd-rich-item-renderer ytd-menu-renderer { display: none !important; }
html.cinemorph-on #video-title {
  font-family: "Helvetica Neue", Arial, sans-serif !important;
  font-size: 13px !important; color: #f1f1f1 !important; font-weight: 600 !important;
  line-height: 1.35 !important;
}

.cm-row-title {
  font-family: "Helvetica Neue", Arial, sans-serif;
  font-size: clamp(19px, 1.55vw, 25px); font-weight: 700; color: #e5e5e5;
  margin: 6px 0 0; padding: 0 4.2vw;
  letter-spacing: 0;
}

/* ---- Channel pages ---- */
html.cinemorph-on.cm-channel ytd-page-manager { padding-top: 0 !important; }
html.cinemorph-on.cm-channel ytd-c4-tabbed-header-renderer,
html.cinemorph-on.cm-channel ytd-page-header-renderer {
  background: linear-gradient(180deg, #1c1c1c, var(--cm-bg)) !important;
  padding: 72px 4.2vw 20px !important;
}
html.cinemorph-on.cm-channel #channel-header,
html.cinemorph-on.cm-channel #page-header {
  max-width: none !important;
  margin: 0 !important;
}
html.cinemorph-on.cm-channel #channel-container,
html.cinemorph-on.cm-channel #contentContainer {
  padding: 0 !important;
}
html.cinemorph-on.cm-channel #avatar img,
html.cinemorph-on.cm-channel yt-avatar-shape img {
  width: 132px !important;
  height: 132px !important;
  border: 3px solid rgba(255,255,255,.9) !important;
  box-shadow: 0 10px 34px rgba(0,0,0,.65) !important;
}
html.cinemorph-on.cm-channel #channel-name,
html.cinemorph-on.cm-channel #text.ytd-channel-name,
html.cinemorph-on.cm-channel h1 {
  font-family: "Helvetica Neue", Arial, sans-serif !important;
  font-size: clamp(28px, 3vw, 48px) !important;
  font-weight: 800 !important;
  letter-spacing: 0 !important;
}
html.cinemorph-on.cm-channel tp-yt-paper-tab {
  color: #d8d8d8 !important;
  font-family: "Helvetica Neue", Arial, sans-serif !important;
  font-size: 14px !important;
  font-weight: 600 !important;
  text-transform: none !important;
  padding: 0 22px !important;
}
html.cinemorph-on.cm-channel #tabsContainer,
html.cinemorph-on.cm-channel #tabs-inner-container {
  border-bottom: 1px solid #2f2f2f !important;
}
html.cinemorph-on.cm-channel ytd-rich-grid-renderer,
html.cinemorph-on.cm-channel ytd-section-list-renderer {
  padding: 26px 4.2vw !important;
}
html.cinemorph-on.cm-channel ytd-grid-video-renderer,
html.cinemorph-on.cm-channel ytd-rich-item-renderer {
  margin: 0 10px 34px 0 !important;
}

/* ---- Watch page: cinema mode ---- */
html.cinemorph-on.cm-watch ytd-watch-flexy #secondary,
html.cinemorph-on.cm-watch ytd-watch-flexy #below,
html.cinemorph-on.cm-watch ytd-watch-metadata,
html.cinemorph-on.cm-watch #comments,
html.cinemorph-on.cm-watch #chat,
html.cinemorph-on.cm-watch ytd-merch-shelf-renderer { display: none !important; }
html.cinemorph-on.cm-watch #masthead-container { opacity: 0; transition: opacity .25s; }
html.cinemorph-on.cm-watch #masthead-container:hover { opacity: 1; }
html.cinemorph-on.cm-watch ytd-watch-flexy #primary,
html.cinemorph-on.cm-watch ytd-watch-flexy #primary-inner,
html.cinemorph-on.cm-watch ytd-watch-flexy #player,
html.cinemorph-on.cm-watch #player-container-outer,
html.cinemorph-on.cm-watch #player-container-inner,
html.cinemorph-on.cm-watch #movie_player {
  max-width: none !important; width: 100vw !important; margin: 0 !important; padding: 0 !important;
}
html.cinemorph-on.cm-watch ytd-watch-flexy #player,
html.cinemorph-on.cm-watch #player-container-inner,
html.cinemorph-on.cm-watch #movie_player,
html.cinemorph-on.cm-watch video.html5-main-video {
  height: 100vh !important;
}
html.cinemorph-on.cm-watch video.html5-main-video {
  width: 100vw !important; left: 0 !important; top: 0 !important; object-fit: cover;
}
html.cinemorph-on.cm-watch ytd-watch-flexy[flexy] #columns { padding: 0 !important; }
html.cinemorph-on.cm-watch .ytp-chrome-bottom { width: calc(100vw - 48px) !important; left: 24px !important; }
html.cinemorph-on.cm-watch .ytp-gradient-bottom { height: 220px !important; }
html.cinemorph-on.cm-watch .ytp-play-progress, html.cinemorph-on .ytp-swatch-background-color {
  background: var(--cm-accent) !important;
}
html.cinemorph-on.cm-watch #cm-cine-title {
  position: fixed; left: 48px; bottom: 130px; z-index: 40;
  color: #fff; pointer-events: none;
  font-family: "Helvetica Neue", Arial, sans-serif;
  font-size: clamp(24px, 3vw, 46px); font-weight: 900; max-width: 55vw;
  text-shadow: 0 4px 22px rgba(0,0,0,.8);
  opacity: 1; transition: opacity .4s;
}
html.cinemorph-on.cm-watch.cm-idle #cm-cine-title { opacity: 0; }

/* scrollbar */
html.cinemorph-on ::-webkit-scrollbar { width: 10px; }
html.cinemorph-on ::-webkit-scrollbar-thumb { background: #333; border-radius: 6px; }
`;

  /* ---------------- helpers ---------------- */
  let settings = { ...DEFAULTS };
  const styleEl = document.createElement("style");
  styleEl.id = "cm-style";

  function applyStyle() {
    styleEl.textContent = css(settings.accent, settings.rounded);
    if (!styleEl.isConnected) (document.head || document.documentElement).appendChild(styleEl);
    document.documentElement.style.setProperty("--cm-contrast", settings.contrast + "%");
    document.documentElement.classList.toggle("cinemorph-on", !!settings.enabled);
    if (!settings.enabled) teardown();
  }

  function teardown() {
    document.getElementById("cm-billboard")?.remove();
    document.getElementById("cm-nav")?.remove();
    document.getElementById("cm-cine-title")?.remove();
    document.querySelectorAll(".cm-row-title").forEach((n) => n.remove());
    document.documentElement.classList.remove("cm-watch", "cm-channel");
  }

  const isHome = () => location.pathname === "/" || location.pathname === "/feed/subscriptions";
  const isWatch = () => location.pathname === "/watch";
  const isChannel = () => /^\/(?:@|channel\/|c\/|user\/)/.test(location.pathname);

  /* ---- top nav ---- */
  function buildNav() {
    if (!settings.enabled) return;
    if (document.getElementById("cm-nav")) return;
    const anchor = document.querySelector("ytd-masthead #start");
    if (!anchor) return;
    const nav = document.createElement("nav");
    nav.id = "cm-nav";
    [
      ["Home", "/"],
      ["Shorts", "/shorts"],
      ["Subscriptions", "/feed/subscriptions"],
      ["You", "/feed/you"],
      ["History", "/feed/history"],
    ].forEach(([label, href]) => {
      const a = document.createElement("a");
      a.textContent = label;
      a.href = href;
      nav.appendChild(a);
    });
    anchor.appendChild(nav);
  }

  /* ---- billboard ---- */
  function buildBillboard() {
    if (!settings.enabled || !isHome()) return;
    if (document.getElementById("cm-billboard")) return;

    const first = document.querySelector("ytd-rich-item-renderer");
    if (!first) return;
    const img = first.querySelector("img")?.src;
    const title = first.querySelector("#video-title")?.textContent?.trim();
    const link = first.querySelector("a#thumbnail")?.href;
    if (!img || !title || !img.startsWith("http")) return;

    const channel = first.querySelector("#channel-name #text, ytd-channel-name a")?.textContent?.trim() || "";
    const metaLine = Array.from(first.querySelectorAll("#metadata-line span"))
      .map((s) => s.textContent.trim())
      .filter(Boolean)
      .join(" • ");

    const bb = document.createElement("div");
    bb.id = "cm-billboard";
    bb.innerHTML = `
      <div class="cm-bb-img"></div>
      <div class="cm-bb-fade"></div>
      <div class="cm-bb-body">
        <h1></h1>
        <div class="cm-bb-meta"></div>
        <div class="cm-bb-actions">
          <button class="cm-play">▶ Play</button>
          <button class="cm-info">ⓘ More Info</button>
        </div>
      </div>
      <div class="cm-badge">18+</div>`;
    bb.querySelector(".cm-bb-img").style.backgroundImage = `url("${img.replace(
      /hqdefault|mqdefault|hq720/,
      "maxresdefault"
    )}"), url("${img}")`;
    bb.querySelector("h1").textContent = title;
    bb.querySelector(".cm-bb-meta").textContent = [channel, metaLine].filter(Boolean).join(" • ");
    const go = () => link && (location.href = link);
    bb.querySelector(".cm-play").addEventListener("click", go);
    bb.querySelector(".cm-info").addEventListener("click", go);

    const grid = document.querySelector("ytd-rich-grid-renderer #contents");
    grid?.parentElement?.insertBefore(bb, grid);
  }

  /* ---- row titles ---- */
  function labelRows() {
    if (!settings.enabled || !isHome()) return;
    const rows = document.querySelectorAll("ytd-rich-grid-row");
    let i = 0;
    rows.forEach((row) => {
      if (row.previousElementSibling?.classList?.contains("cm-row-title")) {
        i++;
        return;
      }
      const h = document.createElement("h2");
      h.className = "cm-row-title";
      h.textContent = ROW_TITLES[i % ROW_TITLES.length];
      row.parentElement?.insertBefore(h, row);
      i++;
    });
  }

  /* ---- watch page ---- */
  let idleTimer;
  function setupWatch() {
    const on = settings.enabled && isWatch();
    document.documentElement.classList.toggle("cm-watch", on);
    if (!on) {
      document.getElementById("cm-cine-title")?.remove();
      return;
    }
    let t = document.getElementById("cm-cine-title");
    if (!t) {
      t = document.createElement("div");
      t.id = "cm-cine-title";
      document.body.appendChild(t);
    }
    const title = document.querySelector("h1.ytd-watch-metadata yt-formatted-string, h1.title")?.textContent?.trim();
    if (title) t.textContent = title;

    if (!setupWatch._bound) {
      setupWatch._bound = true;
      const wake = () => {
        document.documentElement.classList.remove("cm-idle");
        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => document.documentElement.classList.add("cm-idle"), 3500);
      };
      document.addEventListener("mousemove", wake, { passive: true });
      wake();
    }
  }

  function setupChannel() {
    document.documentElement.classList.toggle("cm-channel", settings.enabled && isChannel());
  }

  function render() {
    applyStyle();
    if (!settings.enabled) return;
    buildNav();
    if (isHome()) {
      buildBillboard();
      labelRows();
    } else {
      document.getElementById("cm-billboard")?.remove();
    }
    setupWatch();
    setupChannel();
  }

  /* ---------------- boot ---------------- */
  chrome.storage?.local.get(DEFAULTS, (s) => {
    settings = { ...DEFAULTS, ...s };
    render();
  });

  chrome.storage?.onChanged.addListener((changes) => {
    Object.entries(changes).forEach(([k, v]) => (settings[k] = v.newValue));
    teardown();
    render();
  });

  const mo = new MutationObserver(() => {
    clearTimeout(mo._t);
    mo._t = setTimeout(render, 250);
  });
  mo.observe(document.documentElement, { childList: true, subtree: true });

  let lastPath = location.href;
  setInterval(() => {
    if (location.href !== lastPath) {
      lastPath = location.href;
      teardown();
      setTimeout(render, 500);
    }
  }, 500);

  render();
})();
