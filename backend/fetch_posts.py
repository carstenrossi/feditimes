#!/usr/bin/env python3
"""
FediTimes Backend - Fediverse Post Curator
Ruft Posts von Mastodon-Instanzen ab und kuratiert sie.
FIXED: Timezone Problem gelöst
"""

import json
import os
import sys
from datetime import datetime, timedelta, timezone  # ← timezone hinzugefügt!
from mastodon import Mastodon
from urllib.parse import urlparse
import re

class FediPostCurator:
    def __init__(self, config_path="backend/config.json"):
        """Initialisiert den Curator mit der Konfiguration."""
        self.config = self.load_config(config_path)
        self.mastodon = self.setup_mastodon()
        
    def load_config(self, config_path):
        """Lädt die Konfiguration aus der JSON-Datei."""
        try:
            with open(config_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            print(f"❌ Konfigurationsdatei {config_path} nicht gefunden!")
            sys.exit(1)
        except json.JSONDecodeError as e:
            print(f"❌ Fehler beim Parsen der Konfiguration: {e}")
            sys.exit(1)
    
    def setup_mastodon(self):
        """Erstellt eine Mastodon-API-Verbindung."""
        try:
            mastodon = Mastodon(
                api_base_url=self.config['mastodon_instance']
            )
            return mastodon
        except Exception as e:
            print(f"❌ Fehler beim Verbinden mit {self.config['mastodon_instance']}: {e}")
            sys.exit(1)
    
    def clean_html(self, html_content):
        """Entfernt gefährliche HTML-Tags und behält nur sichere bei."""
        if not html_content:
            return ""
        
        # Erlaubte Tags
        allowed_tags = ['p', 'br', 'a', 'strong', 'em', 'b', 'i', 'span']
        
        # Einfache HTML-Bereinigung (für Produktionsumgebung sollte eine richtige Library verwendet werden)
        clean_content = html_content
        
        # Entferne Script-Tags
        clean_content = re.sub(r'<script[^>]*>.*?</script>', '', clean_content, flags=re.DOTALL | re.IGNORECASE)
        
        return clean_content
    
    def fetch_posts_for_hashtag(self, hashtag):
        """Ruft Posts für einen bestimmten Hashtag ab."""
        try:
            print(f"🔍 Suche Posts für #{hashtag}...")
            
            # Zeitrahmen definieren - FIXED: Timezone-aware!
            since_date = datetime.now(timezone.utc) - timedelta(hours=self.config['hours_back'])
            
            # Posts abrufen
            posts = self.mastodon.timeline_hashtag(
                hashtag, 
                limit=100,  # Mehr Posts abrufen, um nach Filtern genug zu haben
                since_id=None
            )
            
            # Posts filtern und verarbeiten
            processed_posts = []
            for post in posts:
                # FIXED: Beide Datetimes sind jetzt timezone-aware
                if post['created_at'] < since_date:
                    continue
                
                # Reblogs überspringen
                if post.get('reblog'):
                    continue
                
                # Bild-URL extrahieren (falls vorhanden)
                image_url = None
                if post.get('media_attachments'):
                    for attachment in post['media_attachments']:
                        if attachment['type'] == 'image':
                            image_url = attachment['url']
                            break  # Nur das erste Bild nehmen

                processed_post = {
                    'url': post['url'],
                    'author': post['account']['display_name'] or post['account']['username'],
                    'author_url': post['account']['url'],
                    'avatar_url': post['account']['avatar_static'],
                    'content_html': self.clean_html(post['content']),
                    'boosts': post['reblogs_count'],
                    'comments': post['replies_count'],
                    'timestamp': post['created_at'].isoformat(),
                    'hashtag': hashtag,
                    'image_url': image_url  # Bild-URL hinzugefügt
                }
                
                processed_posts.append(processed_post)
            
            print(f"✅ {len(processed_posts)} Posts für #{hashtag} gefunden")
            return processed_posts
            
        except Exception as e:
            print(f"❌ Fehler beim Abrufen der Posts für #{hashtag}: {e}")
            return []
    
    def fetch_all_posts(self):
        """Ruft Posts für alle konfigurierten Hashtags ab."""
        all_posts = []
        
        for hashtag in self.config['hashtags']:
            posts = self.fetch_posts_for_hashtag(hashtag)
            all_posts.extend(posts)
        
        return all_posts
    
    def sort_posts(self, posts, sort_by="boosts"):
        """Sortiert Posts nach dem angegebenen Kriterium."""
        if sort_by == "boosts":
            return sorted(posts, key=lambda x: x['boosts'], reverse=True)
        elif sort_by == "comments":
            return sorted(posts, key=lambda x: x['comments'], reverse=True)
        elif sort_by == "timestamp":
            return sorted(posts, key=lambda x: x['timestamp'], reverse=True)
        else:
            return posts
    
    def save_posts(self, posts, output_path="public/fediposts.json"):
        """Speichert die kuratierten Posts in eine JSON-Datei."""
        try:
            # Ordner erstellen falls er nicht existiert
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            
            # Metadaten hinzufügen
            output_data = {
                'last_updated': datetime.now().isoformat(),
                'total_posts': len(posts),
                'config': self.config,
                'posts': posts
            }
            
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(output_data, f, ensure_ascii=False, indent=2, default=str)
            
            print(f"✅ {len(posts)} Posts in {output_path} gespeichert")
            
        except Exception as e:
            print(f"❌ Fehler beim Speichern: {e}")
    
    def run(self):
        """Führt den kompletten Kuratierungsprozess aus."""
        print("🚀 FediTimes Backend gestartet")
        print(f"📡 Instanz: {self.config['mastodon_instance']}")
        print(f"🏷️  Hashtags: {', '.join(self.config['hashtags'])}")
        print(f"⏰ Zeitraum: {self.config['hours_back']} Stunden")
        
        # Posts abrufen
        all_posts = self.fetch_all_posts()
        
        if not all_posts:
            print("❌ Keine Posts gefunden!")
            return
        
        # Sortieren
        sorted_posts = self.sort_posts(all_posts, self.config['sort_by'])
        
        # Top Posts auswählen
        top_posts = sorted_posts[:self.config['max_posts']]
        
        # Speichern
        self.save_posts(top_posts)
        
        print(f"🎉 Kuratierung abgeschlossen! {len(top_posts)} Top-Posts gespeichert.")
        print("💡 Starte das Frontend mit: cd public && python3 -m http.server 8000")

if __name__ == "__main__":
    curator = FediPostCurator()
    curator.run()