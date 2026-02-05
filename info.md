# Rhino RSS Card

A custom Home Assistant card that displays RSS feeds as a smoothly scrolling ticker with full customization options.

## Features

- 📰 **Scrolling Ticker** - Articles scroll smoothly across the screen
- 🔄 **Continuous Loop** - Seamlessly loops back to the first article
- 🎨 **Full Color Customization** - Background, text, and bullet colors
- 🔧 **Visual Editor** - Easy configuration through Home Assistant UI
- 📡 **Multiple RSS Feeds** - Support for unlimited RSS feeds
- ⏱️ **Auto Refresh** - Configurable refresh interval (1-30 minutes)
- 🎯 **Clickable Articles** - Click any article to open in new tab
- ⚡ **Smooth Performance** - Hardware-accelerated animations

## Quick Start

After installation, add the card through the Home Assistant UI:

1. Edit your dashboard
2. Click "Add Card"
3. Search for "Rhino RSS Card"
4. Configure your feeds and styling in the visual editor

## Configuration

### Visual Editor Options

The card includes a comprehensive visual editor:

- **Colors**: Background, text, and bullet colors with color pickers
- **Font Size**: 12-32px slider
- **Scroll Speed**: 10-150 px/s slider
- **Refresh Interval**: 1-30 minutes slider
- **Max Items**: 5-50 articles slider
- **RSS Feeds**: Add/remove feed URLs with buttons

### Example YAML

```yaml
type: custom:rhino-rss-card
feeds:
  - http://feeds.bbci.co.uk/news/world/rss.xml
  - https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml
background_color: "#1c1c1c"
text_color: "#ffffff"
bullet_color: "#ffa500"
font_size: "16"
scroll_speed: "50"
refresh_interval: "300"
max_items: "20"
```

## Popular RSS Feeds

### News
- BBC World: `http://feeds.bbci.co.uk/news/world/rss.xml`
- NY Times: `https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml`

### Tech
- TechCrunch: `https://techcrunch.com/feed/`
- The Verge: `https://www.theverge.com/rss/index.xml`
- Hacker News: `https://news.ycombinator.com/rss`

### Reddit
- r/HomeAssistant: `https://www.reddit.com/r/homeassistant/.rss`

## Theme Examples

### Dark Theme (Default)
```yaml
background_color: "#1c1c1c"
text_color: "#ffffff"
bullet_color: "#ffa500"
```

### Light Theme
```yaml
background_color: "#ffffff"
text_color: "#000000"
bullet_color: "#0066cc"
```

### News Channel Style
```yaml
background_color: "#cc0000"
text_color: "#ffffff"
bullet_color: "#ffff00"
font_size: "18"
scroll_speed: "60"
```

## Support

Having issues? Check the full README for troubleshooting tips or open an issue on GitHub.
