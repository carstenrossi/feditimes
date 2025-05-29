# 🌐 FediTimes - Fediverse Post Curator

[![Python](https://img.shields.io/badge/Python-3.8+-blue)](https://python.org)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

A proof-of-concept for automatically curating and displaying posts from the Fediverse (Mastodon).

## ✨ Features

- 🔍 **Automatic curation** of Fediverse posts by hashtags
- 📊 **Smart sorting** by boosts, comments, or time
- 🎨 **Modern responsive design** with glassmorphism effects
- 💬 **Interactive comment links** to original posts
- ⚙️ **Configurable instances** and hashtags
- 📱 **Mobile-optimized** for all devices

## 🚀 Quick Start

### Local Installation

```bash
# Clone repository
git clone https://github.com/your-username/feditimes.git
cd feditimes

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # Linux/macOS
# or: venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Fetch posts
python backend/fetch_posts.py

# Start frontend
cd public
python3 -m http.server 8000

# Open browser: http://localhost:8000
```

### With Docker (coming soon)

```bash
docker-compose up
```

## ⚙️ Configuration

Edit `backend/config.json`:

```json
{
  "mastodon_instance": "https://mastodon.social",
  "hashtags": ["fediverse", "mastodon", "opensource"],
  "max_posts": 15,
  "hours_back": 24,
  "sort_by": "boosts"
}
```

### Available Options

| Option | Description | Default |
|--------|-------------|---------|
| `mastodon_instance` | Mastodon instance URL | `https://mastodon.social` |
| `hashtags` | Array of hashtags to track | `["fediverse", "mastodon"]` |
| `max_posts` | Number of top posts to display | `10` |
| `hours_back` | Time range in hours | `24` |
| `sort_by` | Sort by: `boosts`, `comments`, `timestamp` | `boosts` |

## 🏗️ Project Structure

```
feditimes/
├── backend/
│   ├── fetch_posts.py      # Main curation script
│   └── config.json         # Configuration
├── public/
│   ├── index.html          # Frontend
│   ├── app.js              # JavaScript logic
│   ├── style.css           # Styling
│   └── fediposts.json      # Generated posts (auto-created)
├── requirements.txt        # Python dependencies
├── .gitignore             # Git ignores
└── README.md              # This file
```

## 🔄 Automation

### Cron Job (Linux/macOS)

```bash
# Run hourly
0 * * * * cd /path/to/feditimes && source venv/bin/activate && python backend/fetch_posts.py

# Run daily at 6 AM
0 6 * * * cd /path/to/feditimes && source venv/bin/activate && python backend/fetch_posts.py
```

### GitHub Actions (automatic)

The repository includes a GitHub Action that automatically fetches new posts every 6 hours and updates GitHub Pages.

## 🌐 Deployment

### GitHub Pages

1. Create repository on GitHub
2. Enable GitHub Pages in repository settings
3. GitHub Actions handles automatic deployment

### VPS/Server

```bash
# On your server
git clone https://github.com/your-username/feditimes.git
cd feditimes

# Setup (see Quick Start)
# + Nginx configuration for public access
```

### Railway/Vercel

- Push to GitHub
- Connect with Railway/Vercel
- Automatic deployment

## 🎨 Customization

### Add New Mastodon Instance

```json
{
  "mastodon_instance": "https://chaos.social",
  "hashtags": ["fediverse", "privacy", "tech"]
}
```

### Customize Design

Edit `public/style.css`:
- Change CSS variables in `:root`
- Adjust color scheme
- Modify layout parameters

### Add More Hashtags

```json
{
  "hashtags": [
    "opensource", 
    "privacy", 
    "decentralization",
    "web3",
    "activitypub"
  ]
}
```

## 🤝 Contributing

Contributions are welcome! 

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Setup

```bash
# Development server with auto-reload
cd public
python3 -m http.server 8000 --bind 127.0.0.1

# Backend tests
python -m pytest tests/  # (coming soon)

# Code formatting
black backend/
prettier public/*.js public/*.css
```

## 🐛 Known Issues

- [ ] Rate limiting with frequent API calls
- [ ] Large posts may break layout
- [ ] Timezone handling in different countries

See [Issues](https://github.com/your-username/feditimes/issues) for current problems.

## 🔮 Roadmap

- [ ] **Multi-Instance Support** - Posts from multiple Mastodon instances
- [ ] **Real-time Updates** - WebSocket integration
- [ ] **User Authentication** - Private timelines
- [ ] **Export Features** - CSV/JSON export
- [ ] **Dark Mode** - Theme switcher
- [ ] **Analytics** - Post performance tracking
- [ ] **Mobile App** - React Native version
- [ ] **Docker Support** - Containerized deployment
- [ ] **Plugin System** - Custom post filters
- [ ] **API Endpoints** - JSON API for integrations

## 📊 Technical Details

### Backend Architecture

- **Python 3.8+** with asyncio support
- **Mastodon.py** for API integration
- **JSON-based configuration** for flexibility
- **Timezone-aware** datetime handling
- **HTML sanitization** for security

### Frontend Architecture

- **Vanilla JavaScript** - No framework dependencies
- **CSS Grid & Flexbox** for responsive layouts
- **CSS Custom Properties** for theming
- **Progressive Enhancement** - Works without JavaScript
- **Semantic HTML** for accessibility

### Security Features

- **HTML content sanitization** prevents XSS
- **CSP-friendly** code structure
- **No tracking or analytics** by default
- **HTTPS-only** external requests
- **Input validation** for all user data

## 📈 Performance

- **Client-side rendering** for fast initial load
- **JSON data caching** reduces API calls
- **Lazy loading** for images
- **Optimized CSS** with minimal selectors
- **Gzip-friendly** code structure

## 🔧 Troubleshooting

### Common Issues

**Backend can't connect to Mastodon instance**
- Check URL in `config.json`
- Test connection: `curl https://mastodon.social/api/v1/instance`

**No posts found**
- Verify hashtags in configuration
- Increase time range (`hours_back`)
- Try popular hashtags like `#mastodon`

**Frontend shows no data**
- Check if `fediposts.json` exists and is valid
- Ensure server is running
- Check browser console for errors

**Rate limiting errors**
- Reduce fetch frequency
- Use multiple instances
- Implement exponential backoff

## 📊 Stats

![GitHub stars](https://img.shields.io/github/stars/your-username/feditimes)
![GitHub forks](https://img.shields.io/github/forks/your-username/feditimes)
![GitHub issues](https://img.shields.io/github/issues/your-username/feditimes)
![GitHub last commit](https://img.shields.io/github/last-commit/your-username/feditimes)

## 🌍 Internationalization

FediTimes supports multiple languages:

- **English** (default)
- **German** - Comprehensive German interface
- **More languages** - Contributions welcome!

To add a new language, edit the language files in `public/i18n/`.

## 🧪 Testing

```bash
# Run backend tests
python -m pytest backend/tests/

# Run frontend tests (coming soon)
npm test

# Integration tests
python -m pytest tests/integration/

# Performance tests
python -m pytest tests/performance/
```

## 📋 Requirements

### Minimum Requirements

- **Python 3.8+**
- **512MB RAM**
- **50MB disk space**
- **Internet connection**

### Recommended

- **Python 3.11+**
- **1GB RAM**
- **SSD storage**
- **Stable internet connection**

## 🚀 Performance Optimization

### Server-side

```bash
# Use gunicorn for production
pip install gunicorn
gunicorn --workers 4 --bind 0.0.0.0:8000 app:app

# Enable gzip compression
# Configure in your nginx/apache setup
```

### Client-side

- Images are lazy-loaded
- CSS is minified in production
- JavaScript uses modern ES6+ features
- ServiceWorker caching (coming soon)

## 🙏 Acknowledgments

- [Mastodon.py](https://github.com/halcy/Mastodon.py) - Python Mastodon API client
- [Inter Font](https://rsms.me/inter/) - Modern typography
- [Fediverse Community](https://fediverse.party/) - Inspiration and support
- [ActivityPub](https://activitypub.rocks/) - Decentralized social networking
- [GitHub Pages](https://pages.github.com/) - Free hosting
- [GitHub Actions](https://github.com/features/actions) - CI/CD automation

## 📱 Mobile Support

FediTimes is fully responsive and works great on:

- 📱 **iOS Safari**
- 🤖 **Android Chrome**
- 🖥️ **Desktop browsers**
- 📟 **Progressive Web App** features (coming soon)

## 🔐 Privacy

FediTimes respects your privacy:

- **No tracking scripts**
- **No analytics by default**
- **No cookies**
- **No user data collection**
- **Public posts only** - No private data access

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/your-username/feditimes/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/your-username/feditimes/discussions)
- 💬 **Community**: Follow [@your-username@mastodon.social](https://mastodon.social/@your-username)
- 📧 **Email**: your.email@example.com

## 🎯 Use Cases

- **Personal curation** - Track topics you care about
- **Community monitoring** - Follow hashtag trends
- **Content discovery** - Find interesting discussions
- **Research** - Analyze Fediverse conversations
- **News aggregation** - Create topic-based feeds
- **Event tracking** - Monitor conference hashtags

---

**Note**: This is a proof-of-concept for educational purposes. For production environments, additional security and performance optimizations should be implemented.

Made with ❤️ for the open and decentralized web.