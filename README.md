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

## Installation

### HACS (Recommended)

1. Open HACS in Home Assistant
2. Click on "Frontend"
3. Click the "+" button
4. Search for "Rhino RSS Card"
5. Click "Install"
6. Restart Home Assistant

### Manual Installation

1. Download `rhino-rss-card.js` from this repository
2. Copy the file to your `config/www` folder (create if it doesn't exist)
3. Add the following to your `configuration.yaml`:

```yaml
lovelace:
  resources:
    - url: /local/rhino-rss-card.js
      type: module
```

4. Restart Home Assistant

## Configuration

### Visual Editor

The card includes a full visual editor accessible through the Home Assistant UI:

1. Add a new card to your dashboard
2. Search for "Rhino RSS Card"
3. Configure using the visual editor:
   - **Colors**: Background, text, and bullet colors
   - **Font Size**: 12-32px (default: 16px)
   - **Scroll Speed**: 10-150 px/s (default: 50 px/s)
   - **Refresh Interval**: 1-30 minutes (default: 5 minutes)
   - **Max Items**: 5-50 articles (default: 20)
   - **RSS Feeds**: Add/remove feed URLs with visual controls

### YAML Configuration

You can also configure the card via YAML:

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

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `feeds` | list | required | List of RSS feed URLs |
| `background_color` | string | `#1c1c1c` | Background color (hex) |
| `text_color` | string | `#ffffff` | Text color (hex) |
| `bullet_color` | string | `#ffa500` | Bullet separator color (hex) |
| `font_size` | string | `16` | Font size in pixels (12-32) |
| `scroll_speed` | string | `50` | Scroll speed in pixels/second (10-150) |
| `refresh_interval` | string | `300` | Feed refresh interval in seconds (60-1800) |
| `max_items` | string | `20` | Maximum number of articles to display (5-50) |

## Popular RSS Feeds

Here are some popular RSS feeds you can use:

### News
- BBC World News: `http://feeds.bbci.co.uk/news/world/rss.xml`
- New York Times: `https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml`
- CNN Top Stories: `http://rss.cnn.com/rss/cnn_topstories.rss`

### Tech
- TechCrunch: `https://techcrunch.com/feed/`
- The Verge: `https://www.theverge.com/rss/index.xml`
- Hacker News: `https://news.ycombinator.com/rss`
- Ars Technica: `https://feeds.arstechnica.com/arstechnica/index`

### Reddit
- Front Page: `https://www.reddit.com/.rss`
- r/HomeAssistant: `https://www.reddit.com/r/homeassistant/.rss`

## Styling Tips

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

### Minimal Style
```yaml
background_color: "#f5f5f5"
text_color: "#333333"
bullet_color: "#999999"
font_size: "14"
scroll_speed: "40"
```

## Troubleshooting

### Articles not loading
- Check that your RSS feed URLs are valid and accessible
- The card uses `rss2json.com` API which has rate limits - if you have many feeds, increase the refresh interval
- Some RSS feeds may be blocked by CORS - try using different feeds

### Scrolling is choppy
- Lower the scroll speed in settings
- Reduce the number of max items
- Try a different browser (Chrome/Edge have better performance than Firefox for animations)

### Card not appearing
- Make sure you've added the resource to your configuration.yaml
- Restart Home Assistant after adding the resource
- Clear your browser cache (Ctrl+F5)

## Support

If you encounter any issues or have suggestions, please open an issue on GitHub.

## License

MIT License - feel free to use and modify as needed.

## Credits

Based on the design principles of the Rabbit RSS Card, reimagined as a scrolling ticker.
