/**
 * Rhino RSS Card
 * A scrolling RSS ticker with full customization
 */

window.customCards = window.customCards || [];
window.customCards.push({
  type: "rhino-rss-card",
  name: "Rhino RSS Card",
  description: "A scrolling RSS ticker with full color customization.",
  preview: true
});

/**
 * THE VISUAL EDITOR
 */
class RhinoRSSEditor extends HTMLElement {
  constructor() {
    super();
    // Start with an empty config so we don't overwrite with defaults prematurely
    this._config = {};
  }

  setConfig(config) {
    this._config = config;
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
  }

  _render() {
    if (!this._config) return;

    // Pull current values or fall back to defaults only if they don't exist in config
    const currentFontSize = this._config.font_size !== undefined ? this._config.font_size : "16";
    const currentMaxItems = this._config.max_items !== undefined ? this._config.max_items : "20";
    const currentBg = this._config.background_color || "#1c1c1c";
    const currentText = this._config.text_color || "#ffffff";
    const currentBullet = this._config.bullet_color || "#ffa500";
    const currentSpeed = this._config.scroll_speed || "50";
    const currentRefresh = this._config.refresh_interval || "300";

    // If we have already rendered the structure, just update the input values
    if (this._rendered) {
      this.querySelector('#font-size-slider').value = currentFontSize;
      this.querySelector('#font-size-value').textContent = currentFontSize;
      this.querySelector('#font-size-slider').nextElementSibling.textContent = currentFontSize + 'px';
      
      this.querySelector('#max-items-slider').value = currentMaxItems;
      this.querySelector('#max-items-value').textContent = currentMaxItems;
      this.querySelector('#max-items-slider').nextElementSibling.textContent = currentMaxItems;
      return;
    }

    this.innerHTML = `
      <style>
        .card-config { 
          padding: 10px; 
          font-family: var(--primary-font-family), sans-serif; 
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
            <input type="color" class="color-picker" id="bg-color-picker" value="${currentBg}">
            <label>Background</label>
          </div>
          <div class="color-row">
            <input type="color" class="color-picker" id="text-color-picker" value="${currentText}">
            <label>Text</label>
          </div>
          <div class="color-row">
            <input type="color" class="color-picker" id="bullet-color-picker" value="${currentBullet}">
            <label>Bullet</label>
          </div>
        </div>

        <div class="section-title">Ticker Settings</div>
        
        <div class="slider-container">
          <label class="config-label">Font Size: <span id="font-size-value">${currentFontSize}</span>px</label>
          <div class="slider-row">
            <input type="range" class="slider" id="font-size-slider" min="8" max="32" value="${currentFontSize}">
            <span class="slider-value">${currentFontSize}px</span>
          </div>
        </div>

        <div class="slider-container">
          <label class="config-label">Scroll Speed: <span id="speed-value">${currentSpeed}</span>px/s</label>
          <div class="slider-row">
            <input type="range" class="slider" id="speed-slider" min="10" max="150" value="${currentSpeed}">
            <span class="slider-value">${currentSpeed}px/s</span>
          </div>
        </div>

        <div class="slider-container">
          <label class="config-label">Refresh Interval: <span id="refresh-value">${currentRefresh}</span>s</label>
          <div class="slider-row">
            <input type="range" class="slider" id="refresh-slider" min="60" max="1800" step="60" value="${currentRefresh}">
            <span class="slider-value">${Math.floor(currentRefresh / 60)}min</span>
          </div>
        </div>

        <div class="slider-container">
          <label class="config-label">Max Items: <span id="max-items-value">${currentMaxItems}</span></label>
          <div class="slider-row">
            <input type="range" class="slider" id="max-items-slider" min="5" max="100" value="${currentMaxItems}">
            <span class="slider-value">${currentMaxItems}</span>
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
    fontSizeSlider.addEventListener('input', (e) => {
      this.querySelector('#font-size-value').textContent = e.target.value;
      fontSizeSlider.nextElementSibling.textContent = e.target.value + 'px';
      this._updateConfig({ font_size: e.target.value });
    });

    const speedSlider = this.querySelector('#speed-slider');
    speedSlider.addEventListener('input', (e) => {
      this.querySelector('#speed-value').textContent = e.target.value;
      speedSlider.nextElementSibling.textContent = e.target.value + 'px/s';
      this._updateConfig({ scroll_speed: e.target.value });
    });

    const refreshSlider = this.querySelector('#refresh-slider');
    refreshSlider.addEventListener('input', (e) => {
      this.querySelector('#refresh-value').textContent = e.target.value;
      refreshSlider.nextElementSibling.textContent = Math.floor(e.target.value / 60) + 'min';
      this._updateConfig({ refresh_interval: e.target.value });
    });

    const maxItemsSlider = this.querySelector('#max-items-slider');
    maxItemsSlider.addEventListener('input', (e) => {
      this.querySelector('#max-items-value').textContent = e.target.value;
      maxItemsSlider.nextElementSibling.textContent = e.target.value;
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
  }

  _updateConfig(newValues) {
    const event = new CustomEvent("config-changed", {
      detail: { config: { ...this._config, ...newValues } },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }
}
customElements.define("rhino-rss-editor", RhinoRSSEditor);

/**
 * THE MAIN CARD LOGIC
 */
class RhinoRSSCard extends HTMLElement {
  static getConfigElement() {
    return document.createElement("rhino-rss-editor");
  }

  static getStubConfig() {
    return { 
      feeds: ["http://feeds.bbci.co.uk/news/world/rss.xml"],
      background_color: "#1c1c1c",
      text_color: "#ffffff",
      bullet_color: "#ffa500",
      font_size: "16",
      scroll_speed: "50",
      refresh_interval: "300",
      max_items: "20"
    };
  }

  constructor() {
    super();
    this._articles = [];
    this._animationFrame = null;
    this._refreshTimer = null;
  }

  setConfig(config) {
    const oldFeeds = JSON.stringify(this._config?.feeds);
    this._config = config || {};
    
    if (this.container) {
      this._applyStyles();
      if (oldFeeds !== JSON.stringify(config.feeds)) {
        this._fetchRSS();
      }
    }
  }

  _applyStyles() {
    if (!this.container) return;
    
    const bgColor = this._config.background_color || "#1c1c1c";
    const textColor = this._config.text_color || "#ffffff";
    const bulletColor = this._config.bullet_color || "#ffa500";
    const fontSize = (this._config.font_size || "16") + "px";
    
    this.container.style.backgroundColor = bgColor;
    this.ticker.style.color = textColor;
    this.style.setProperty('--bullet-color', bulletColor);
    this.style.setProperty('--card-font-size', fontSize);
  }

  set hass(hass) {
    this._hass = hass;
    if (!this.container) this._init();
  }

  _init() {
    this.innerHTML = `
      <style>
        :host {
          --bullet-color: #ffa500;
          --card-font-size: 16px;
        }
        ha-card { 
          padding: 0; 
          overflow: hidden; 
          display: flex; 
          flex-direction: column; 
          height: 100%; 
          font-family: var(--primary-font-family), sans-serif;
        }
        .ticker-container {
          overflow: hidden;
          white-space: nowrap;
          padding: 12px 0;
          position: relative;
        }
        .ticker-content {
          display: inline-block;
          padding-left: 100%;
          will-change: transform;
          font-size: var(--card-font-size);
        }
        .ticker-item {
          display: inline;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        .ticker-item:hover {
          opacity: 0.7;
        }
        .bullet {
          color: var(--bullet-color);
          margin: 0 15px;
          font-weight: bold;
        }
      </style>
      <ha-card id="card-container">
        <div class="ticker-container">
          <div class="ticker-content" id="ticker"></div>
        </div>
      </ha-card>
    `;
    
    this.container = this.querySelector("#card-container");
    this.ticker = this.querySelector("#ticker");
    this._applyStyles();
    this._fetchRSS();
    this._startRefreshTimer();
  }

  _startRefreshTimer() {
    if (this._refreshTimer) clearInterval(this._refreshTimer);
    const refreshInterval = parseInt(this._config.refresh_interval || "300") * 1000;
    this._refreshTimer = setInterval(() => this._fetchRSS(), refreshInterval);
  }

  async _fetchRSS() {
    const feeds = this._config.feeds || [];
    const validFeeds = feeds.filter(url => url && url.trim().startsWith("http"));
    
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
  }

  _render() {
    if (!this.ticker) return;

    if (this._articles.length === 0) {
      this.ticker.innerHTML = '<span class="ticker-item">No articles available</span>';
      return;
    }

    const tickerHTML = this._articles.map((item, index) => {
      const title = item.title || "Untitled";
      const source = item.source || "Unknown";
      const date = new Date(item.pubDate).toLocaleDateString();
      const link = item.link || "#";
      return `<span class="ticker-item" onclick="window.open('${link}', '_blank')">${title} (${source} - ${date})</span>${index < this._articles.length - 1 ? '<span class="bullet">●</span>' : ''}`;
    }).join('');

    this.ticker.innerHTML = tickerHTML + '<span class="bullet">●</span>' + tickerHTML;
    this._startAnimation();
  }

  _startAnimation() {
    if (this._animationFrame) cancelAnimationFrame(this._animationFrame);

    let position = 0;
    let lastTime = performance.now();

    const animate = (currentTime) => {
      const speed = parseFloat(this._config.scroll_speed || "50");
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      position += speed * deltaTime;
      const contentWidth = this.ticker.scrollWidth / 2;

      if (position >= contentWidth) position = 0;

      this.ticker.style.transform = `translateX(-${position}px)`;
      this._animationFrame = requestAnimationFrame(animate);
    };

    this._animationFrame = requestAnimationFrame(animate);
  }

  disconnectedCallback() {
    if (this._animationFrame) cancelAnimationFrame(this._animationFrame);
    if (this._refreshTimer) clearInterval(this._refreshTimer);
  }
}

customElements.define("rhino-rss-card", RhinoRSSCard);
