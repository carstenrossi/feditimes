/**
 * FediTimes Frontend - JavaScript App
 * Lädt und zeigt kuratierte Fediverse-Posts an
 */

class FediTimesApp {
    constructor() {
        this.posts = [];
        this.currentSort = 'boosts';
        this.lastUpdated = null;
        
        this.initializeEventListeners();
        this.loadPosts();
    }
    
    initializeEventListeners() {
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.currentSort = e.target.value;
                this.sortAndDisplayPosts();
            });
        }
    }
    
    async loadPosts() {
        try {
            this.showLoading();
            
            const response = await fetch('fediposts.json');
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            this.posts = data.posts || [];
            this.lastUpdated = data.last_updated;
            
            this.hideLoading();
            this.updateStatus();
            this.sortAndDisplayPosts();
            
        } catch (error) {
            console.error('Fehler beim Laden der Posts:', error);
            this.showError(error.message);
        }
    }
    
    showLoading() {
        document.getElementById('loading').classList.remove('hidden');
        document.getElementById('error').classList.add('hidden');
        document.getElementById('postsContainer').innerHTML = '';
    }
    
    hideLoading() {
        document.getElementById('loading').classList.add('hidden');
    }
    
    showError(message) {
        this.hideLoading();
        document.getElementById('error').classList.remove('hidden');
        document.getElementById('errorMessage').textContent = message;
    }
    
    updateStatus() {
        const statusText = document.getElementById('statusText');
        const lastUpdatedElement = document.getElementById('lastUpdated');
        
        if (statusText) {
            statusText.textContent = `${this.posts.length} Posts geladen`;
        }
        
        if (lastUpdatedElement && this.lastUpdated) {
            const date = new Date(this.lastUpdated);
            const formattedDate = date.toLocaleString('de-DE', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            lastUpdatedElement.textContent = `Zuletzt aktualisiert: ${formattedDate}`;
        }
    }
    
    sortAndDisplayPosts() {
        if (this.posts.length === 0) return;
        
        const sortedPosts = [...this.posts].sort((a, b) => {
            switch (this.currentSort) {
                case 'boosts':
                    return b.boosts - a.boosts;
                case 'comments':
                    return b.comments - a.comments;
                case 'timestamp':
                    return new Date(b.timestamp) - new Date(a.timestamp);
                default:
                    return 0;
            }
        });
        
        this.displayPosts(sortedPosts);
    }
    
    displayPosts(posts) {
        const container = document.getElementById('postsContainer');
        if (!container) return;
        
        container.innerHTML = '';
        
        posts.forEach(post => {
            const postElement = this.createPostElement(post);
            container.appendChild(postElement);
        });
    }
    
    createPostElement(post) {
        const article = document.createElement('article');
        article.className = 'post-card';
        
        const timestamp = new Date(post.timestamp);
        const formattedDate = timestamp.toLocaleString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const timeAgo = this.getTimeAgo(timestamp);
        
        // Extrahiere den Benutzernamen aus der author_url für sauberere Anzeige
        const username = this.extractUsername(post.author_url, post.author);
        
        article.innerHTML = `
            <header class="post-header">
                <img src="${this.escapeHtml(post.avatar_url)}" 
                     alt="${this.escapeHtml(post.author)}" 
                     class="avatar"
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjQiIGN5PSIyNCIgcj0iMjQiIGZpbGw9IiNGM0Y0RjYiLz4KPHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSIxMiIgeT0iMTIiPgo8Y2lyY2xlIGN4PSIxMiIgY3k9IjgiIHI9IjMiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTEyIDE0QzguNjg2MjkgMTQgNiAxNi42ODYzIDYgMjBINkMxOCAyMCAxOCAxNi42ODYzIDE4IDEyWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4KPC9zdmc+'">
                <div class="author-info">
                    <a href="${this.escapeHtml(post.author_url)}" 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       class="author-name">${this.escapeHtml(post.author)}</a>
                    <div class="post-date" title="${formattedDate}">${timeAgo}</div>
                </div>
                ${post.hashtag ? `<span class="hashtag-badge">#${this.escapeHtml(post.hashtag)}</span>` : ''}
            </header>
            
            <div class="post-content">
                ${post.content_html}
            </div>
            
            <div class="post-actions">
                <div class="comment-invite">
                    <span class="comment-emoji">💬</span>
                    <a href="${this.escapeHtml(post.url)}" 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       class="comment-link">
                       Kommentier doch mal bei ${this.escapeHtml(username)}
                    </a>
                </div>
            </div>
            
            <footer class="post-stats">
                <div class="stats-left">
                    <div class="stat">
                        <span>🔁</span>
                        <span class="stat-value">${post.boosts}</span>
                        <span>Boosts</span>
                    </div>
                    <div class="stat">
                        <span>💬</span>
                        <span class="stat-value">${post.comments}</span>
                        <span>Kommentare</span>
                    </div>
                </div>
                <a href="${this.escapeHtml(post.url)}" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   class="post-link">Post ansehen</a>
            </footer>
        `;
        
        return article;
    }
    
    extractUsername(authorUrl, fallbackName) {
        try {
            // Versuche @username aus der URL zu extrahieren
            const url = new URL(authorUrl);
            const pathname = url.pathname;
            
            // Verschiedene Formate unterstützen: /users/username, /@username, /profile/username
            const match = pathname.match(/(?:\/users\/|\/profile\/|\/u\/|@)([^\/]+)/);
            if (match) {
                return `@${match[1]}`;
            }
            
            // Fallback: Verwende den Display-Namen
            return fallbackName;
        } catch {
            // Bei URL-Parsing-Fehlern: Fallback zum Display-Namen
            return fallbackName;
        }
    }
    
    getTimeAgo(date) {
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Gerade eben';
        if (diffInMinutes < 60) return `vor ${diffInMinutes} Min.`;
        
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `vor ${diffInHours} Std.`;
        
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `vor ${diffInDays} Tag${diffInDays > 1 ? 'en' : ''}`;
        
        const diffInWeeks = Math.floor(diffInDays / 7);
        if (diffInWeeks < 4) return `vor ${diffInWeeks} Woche${diffInWeeks > 1 ? 'n' : ''}`;
        
        const diffInMonths = Math.floor(diffInDays / 30);
        return `vor ${diffInMonths} Monat${diffInMonths > 1 ? 'en' : ''}`;
    }
    
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// App initialisieren wenn DOM geladen ist
document.addEventListener('DOMContentLoaded', () => {
    new FediTimesApp();
});

// Service Worker für Offline-Funktionalität (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(err => {
            console.log('Service Worker Registrierung fehlgeschlagen:', err);
        });
    });
}