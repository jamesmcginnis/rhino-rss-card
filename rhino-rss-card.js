/**

- Rhino RSS Card
- A scrolling RSS ticker with full customization
  */

window.customCards = window.customCards || [];
window.customCards.push({
type: “rhino-rss-card”,
name: “Rhino RSS Card”,
description: “A scrolling RSS ticker with full color customization.”,
preview: true
});

/**

- THE VISUAL EDITOR
  */
  class RhinoRSSEditor extends HTMLElement {
  constructor() {
  super();
  this._config = {
  feeds: [“http://feeds.bbci.co.uk/news/world/rss.xml”],
  background_color: “#1c1c1c”,
  text_color: “#ffffff”,
  bullet_color: “#ffa500”,
  font_size: “16”,
  scroll_speed: “50”,
  refresh_interval: “300”,
  max_items: “20”
  };
  }

setConfig(config) {
this._config = { …this._config, …config };
this._rendered = false; // Force re-render with new config
if (this._hass) {
this._render();
}
}

set hass(hass) {
this._hass = hass;
this._render();
}

_render() {
if (!this._config) return;
if (this._rendered) return;

```
this.innerHTML = `
  <style>
    .card-config { 
      padding: 10px; 
      font-family: sans-serif; 
      display: flex; 
      flex-direction: column; 
      gap: 12px; 
    }
    .config-label { 
      display: block; 
      font-weight: bold; 
      margin-bottom: 5px; 
      font-size: 14px; 
    }
    .input-box { 
      width: 100%; 
      padding: 10px; 
      border: 1px solid #ccc; 
      border-radius: 4px; 
      box-sizing: border-box; 
      background: white; 
      color: black;
    }
    .color-grid { 
      display: grid; 
      grid-template-columns: 1fr 1fr; 
      gap: 10px; 
    }
    .color-row { 
      display: flex; 
      align-items: center; 
      gap: 10px; 
    }
    .color-picker { 
      width: 40px; 
      height: 30px; 
      padding: 0; 
      border: none; 
      cursor: pointer; 
    }
    .feed-row { 
      display: flex; 
      align-items: center; 
      gap: 10px; 
      margin-bottom: 8px; 
    }
    .btn { 
      padding: 8px 12px; 
      cursor: pointer; 
      background: #03a9f4; 
      color: white; 
      border: none; 
      border-radius: 4px; 
    }
    .btn-delete { 
      background: #f44336; 
    }
    .section-title { 
      font-weight: bold; 
      border-bottom: 1px solid #eee; 
      padding-bottom: 5px; 
      margin-top: 10px; 
    }
    .slider-container {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    .slider-row {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .slider {
      flex: 1;
    }
    .slider-value {
      min-width: 50px;
      text-align: right;
      font-weight: bold;
    }
  </style>
  <div class="card-config">
    <div class="section-title">Colors</div>
    <div class="color-grid">
      <div class="color-row">
        <input type="color" class="color-picker" id="bg-color-picker" value="${this._config.background_color || '#1c1c1c'}">
        <label>Background</label>
      </div>
      <div class="color-row">
        <input type="color" class="color-picker" id="text-color-picker" value="${this._config.text_color || '#ffffff'}">
        <label>Text</label>
      </div>
      <div class="color-row">
        <input type="color" class="color-picker" id="bullet-color-picker" value="${this._config.bullet_color || '#ffa500'}">
        <label>Bullet</label>
      </div>
    </div>

    <div class="section-title">Ticker Settings</div>
    
    <div class="slider-container">
      <label class="config-label">Font Size: <span id="font-size-value">${this._config.font_size || '16'}</span>px</label>
      <div class="slider-row">
        <input type="range" class="slider" id="font-size-slider" min="8" max="32" value="${this._config.font_size || '16'}">
        <span class="slider-value">${this._config.font_size || '16'}px</span>
      </div>
    </div>

    <div class="slider-container">
      <label class="config-label">Scroll Speed: <span id="speed-value">${this._config.scroll_speed || '50'}</span>px/s</label>
      <div class="slider-row">
        <input type="range" class="slider" id="speed-slider" min="10" max="150" value="${this._config.scroll_speed || '50'}">
        <span class="slider-value">${this._config.scroll_speed || '50'}px/s</span>
      </div>
    </div>

    <div class="slider-container">
      <label class="config-label">Refresh Interval: <span id="refresh-value">${this._config.refresh_interval || '300'}</span>s</label>
      <div class="slider-row">
        <input type="range" class="slider" id="refresh-slider" min="60" max="1800" step="60" value="${this._config.refresh_interval || '300'}">
        <span class="slider-value">${Math.floor((this._config.refresh_interval || 300) / 60)}min</span>
      </div>
    </div>

    <div class="slider-container">
      <label class="config-label">Max Items: <span id="max-items-value">${this._config.max_items || '20'}</span></label>
      <div class="slider-row">
        <input type="range" class="slider" id="max-items-slider" min="5" max="50" value="${this._config.max_items || '20'}">
        <span class="slider-value">${this._config.max_items || '20'}</span>
      </div>
    </div>

    <div class="section-title">RSS Feeds</div>
    <div id="feeds-container">
      ${(this._config.feeds || []).map((url, idx) => `
        <div class="feed-row">
          <input type="text" class="input-box feed-input" data-index="${idx}" value="${url}" style="margin-bottom:0;" placeholder="https://example.com/feed.xml">
          <button class="btn btn-delete remove-feed" data-index="${idx}">✕</button>
        </div>
      `).join('')}
    </div>
    <button class="btn" id="add-feed">+ Add Feed URL</button>
  </div>
`;

// Color pickers
this.querySelector('#bg-color-picker').addEventListener('change', (e) => this._updateConfig({ background_color: e.target.value }));
this.querySelector('#text-color-picker').addEventListener('change', (e) => this._updateConfig({ text_color: e.target.value }));
this.querySelector('#bullet-color-picker').addEventListener('change', (e) => this._updateConfig({ bullet_color: e.target.value }));

// Sliders
const fontSizeSlider = this.querySelector('#font-size-slider');
const fontSizeValue = this.querySelector('#font-size-value');
const fontSizeDisplay = fontSizeSlider.nextElementSibling;
fontSizeSlider.addEventListener('input', (e) => {
  fontSizeValue.textContent = e.target.value;
  fontSizeDisplay.textContent = e.target.value + 'px';
  this._updateConfig({ font_size: e.target.value });
});

const speedSlider = this.querySelector('#speed-slider');
const speedValue = this.querySelector('#speed-value');
const speedDisplay = speedSlider.nextElementSibling;
speedSlider.addEventListener('input', (e) => {
  speedValue.textContent = e.target.value;
  speedDisplay.textContent = e.target.value + 'px/s';
  this._updateConfig({ scroll_speed: e.target.value });
});

const refreshSlider = this.querySelector('#refresh-slider');
const refreshValue = this.querySelector('#refresh-value');
const refreshDisplay = refreshSlider.nextElementSibling;
refreshSlider.addEventListener('input', (e) => {
  refreshValue.textContent = e.target.value;
  refreshDisplay.textContent = Math.floor(e.target.value / 60) + 'min';
  this._updateConfig({ refresh_interval: e.target.value });
});

const maxItemsSlider = this.querySelector('#max-items-slider');
const maxItemsValue = this.querySelector('#max-items-value');
const maxItemsDisplay = maxItemsSlider.nextElementSibling;
maxItemsSlider.addEventListener('input', (e) => {
  maxItemsValue.textContent = e.target.value;
  maxItemsDisplay.textContent = e.target.value;
  this._updateConfig({ max_items: e.target.value });
});

// Feed management
this.querySelectorAll('.feed-input').forEach(input => {
  input.addEventListener('change', (e) => {
    const newFeeds = [...this._config.feeds];
    newFeeds[e.target.dataset.index] = e.target.value;
    this._updateConfig({ feeds: newFeeds });
  });
});

this.querySelector('#add-feed').addEventListener('click', () => {
  const newFeeds = [...(this._config.feeds || []), ""];
  this._rendered = false; 
  this._updateConfig({ feeds: newFeeds });
});

this.querySelectorAll('.remove-feed').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const newFeeds = [...this._config.feeds];
    newFeeds.splice(e.target.dataset.index, 1);
    this._rendered = false;
    this._updateConfig({ feeds: newFeeds });
  });
});

this._rendered = true;
```

}

_updateConfig(newValues) {
const event = new CustomEvent(“config-changed”, {
detail: { config: { …this._config, …newValues } },
bubbles: true,
composed: true,
});
this.dispatchEvent(event);
}
}
customElements.define(“rhino-rss-editor”, RhinoRSSEditor);

/**

- THE MAIN CARD LOGIC
  */
  class RhinoRSSCard extends HTMLElement {
  static getConfigElement() {
  return document.createElement(“rhino-rss-editor”);
  }

static getStubConfig() {
return {
feeds: [“http://feeds.bbci.co.uk/news/world/rss.xml”],
background_color: “#1c1c1c”,
text_color: “#ffffff”,
bullet_color: “#ffa500”,
font_size: “16”,
scroll_speed: “50”,
refresh_interval: “300”,
max_items: “20”
};
}

constructor() {
super();
this._articles = [];
this._animationFrame = null;
this._refreshTimer = null;
}

setConfig(config) {
this._config = config || {};

```
// If card is already initialized, check if we need to apply changes
if (this.container && this.ticker) {
  const configStr = JSON.stringify(config);
  if (this._lastConfigStr !== configStr) {
    this._lastConfigStr = configStr;
    this._applyStyles();
  }
}
```

}

_applyStyles() {
if (!this.container || !this.ticker) return;

```
const bgColor = this._config.background_color || "#1c1c1c";
const textColor = this._config.text_color || "#ffffff";
const bulletColor = this._config.bullet_color || "#ffa500";
const fontSize = (this._config.font_size || "16") + "px";

// Check if font size actually changed from last applied value
const fontSizeChanged = this._lastAppliedFontSize && this._lastAppliedFontSize !== fontSize;
this._lastAppliedFontSize = fontSize;

this.container.style.backgroundColor = bgColor;
this.ticker.style.color = textColor;
this.ticker.style.fontSize = fontSize;
this.style.setProperty('--bullet-color', bulletColor);

// Only force a re-render if font size actually changed and we have articles
if (fontSizeChanged && this._articles && this._articles.length > 0) {
  this._renderContent();
}
```

}

set hass(hass) {
const isFirstInit = !this.container;
this._hass = hass;

```
if (isFirstInit) {
  this._init();
}
```

}

_init() {
this.innerHTML = `<style> :host { --bullet-color: #ffa500; } ha-card {  padding: 0;  overflow: hidden;  display: flex;  flex-direction: column;  height: 100%;  } .ticker-container { overflow: hidden; white-space: nowrap; padding: 12px 0; position: relative; } .ticker-content { display: inline-block; padding-left: 100%; will-change: transform; font-family: var(--primary-font-family, Roboto, sans-serif); } .ticker-item { display: inline; cursor: pointer; transition: opacity 0.2s; } .ticker-item:hover { opacity: 0.7; } .bullet { color: var(--bullet-color); margin: 0 15px; font-weight: bold; } </style> <ha-card id="card-container"> <div class="ticker-container"> <div class="ticker-content" id="ticker"></div> </div> </ha-card>`;

```
this.container = this.querySelector("#card-container");
this.ticker = this.querySelector("#ticker");

// Store initial config state
this._lastConfigStr = JSON.stringify(this._config);

this._applyStyles();
this._fetchRSS();
this._startRefreshTimer();
```

}

_startRefreshTimer() {
if (this._refreshTimer) {
clearInterval(this._refreshTimer);
}

```
const refreshInterval = parseInt(this._config.refresh_interval || "300") * 1000;
this._refreshTimer = setInterval(() => {
  this._fetchRSS();
}, refreshInterval);
```

}

async _fetchRSS() {
const feeds = (this._config && this._config.feeds) || [];
const validFeeds = feeds.filter(url => url && url.trim().startsWith(“http”));

```
if (validFeeds.length === 0) {
  this._articles = [];
  this._render();
  return;
}

try {
  const promises = validFeeds.map(url => 
    fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}&cache_boost=${Date.now()}`)
      .then(res => res.json())
  );
  
  const results = await Promise.all(promises);
  let allItems = [];
  
  results.forEach(data => {
    if (data.status === 'ok') {
      allItems = [...allItems, ...data.items.map(item => ({ 
        ...item, 
        source: data.feed.title 
      }))];
    }
  });
  
  allItems.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
  
  const maxItems = parseInt(this._config.max_items || "20");
  this._articles = allItems.slice(0, maxItems);
  this._render();
} catch (e) {
  console.error("Error loading RSS feeds:", e);
  this._articles = [];
  this._render();
}
```

}

_render() {
if (!this.ticker) return;

```
if (this._articles.length === 0) {
  this.ticker.innerHTML = '<span class="ticker-item">No articles available</span>';
  return;
}

this._renderContent();
```

}

_renderContent() {
if (!this.ticker || !this._articles || this._articles.length === 0) return;

```
// Build the ticker content
const tickerHTML = this._articles.map((item, index) => {
  const title = item.title || "Untitled";
  const source = item.source || "Unknown";
  const date = new Date(item.pubDate).toLocaleDateString();
  const link = item.link || "#";
  
  return `<span class="ticker-item" onclick="window.open('${link}', '_blank')">${title} (${source} - ${date})</span>${index < this._articles.length - 1 ? '<span class="bullet">●</span>' : ''}`;
}).join('');

// Duplicate content for seamless loop
this.ticker.innerHTML = tickerHTML + '<span class="bullet">●</span>' + tickerHTML;

// Start animation
this._startAnimation();
```

}

_startAnimation() {
if (this._animationFrame) {
cancelAnimationFrame(this._animationFrame);
}

```
let position = 0;
const speed = parseFloat(this._config.scroll_speed || "50");
let lastTime = performance.now();

const animate = (currentTime) => {
  const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
  lastTime = currentTime;

  position += speed * deltaTime;

  // Get the width of half the content (one full set of articles)
  const contentWidth = this.ticker.scrollWidth / 2;

  // Reset position when we've scrolled through one full set
  if (position >= contentWidth) {
    position = 0;
  }

  this.ticker.style.transform = `translateX(-${position}px)`;
  this._animationFrame = requestAnimationFrame(animate);
};

this._animationFrame = requestAnimationFrame(animate);
```

}

disconnectedCallback() {
if (this._animationFrame) {
cancelAnimationFrame(this._animationFrame);
}
if (this._refreshTimer) {
clearInterval(this._refreshTimer);
}
}
}

customElements.define(“rhino-rss-card”, RhinoRSSCard);