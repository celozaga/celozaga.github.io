import os
import feedparser
from datetime import datetime
from html.parser import HTMLParser
import unicodedata
import re

# =========================
# CONFIGURAÇÃO
# =========================
BLUESKY_HANDLE = 'celozaga.bsky.social'
RSS_URL = f'https://bsky.app/profile/{BLUESKY_HANDLE}/rss'
POSTS_DIR = '_posts'


# =========================
# UTILITÁRIOS
# =========================
class MLStripper(HTMLParser):
    def __init__(self):
        super().__init__()
        self.text = []

    def handle_data(self, d):
        self.text.append(d)

    def get_data(self):
        return ''.join(self.text)


def strip_tags(html):
    s = MLStripper()
    s.feed(html)
    return s.get_data()


def clean_filename(text, max_length=50):
    """
    Gera um nome de arquivo 100% seguro para Windows, Linux e macOS.
    """
    # Normaliza unicode → ASCII
    text = unicodedata.normalize('NFKD', text)
    text = text.encode('ascii', 'ignore').decode('ascii')
    text = text.lower()

    # Remove caracteres proibidos no Windows
    text = re.sub(r'[\\/:*?"<>|]', '', text)

    # Remove qualquer coisa que não seja letra, número, espaço ou hífen
    text = re.sub(r'[^a-z0-9\s-]', '', text)

    # Normaliza espaços e hífens
    text = re.sub(r'\s+', '-', text)
    text = re.sub(r'-+', '-', text)

    return text.strip('-')[:max_length]


# =========================
# PROCESSAMENTO DO FEED
# =========================
feed = feedparser.parse(RSS_URL)

if not feed.entries:
    print("Nenhuma postagem encontrada no RSS do Bluesky.")
    exit(0)

if not os.path.exists(POSTS_DIR):
    os.makedirs(POSTS_DIR)

for entry in feed.entries:
    bluesky_uri = entry.id
    parts = bluesky_uri.split('/')
    did_part = parts[2]
    post_record_id = parts[-1]
    post_link = entry.link

    # Título completo (para exibição)
    full_title = entry.title if 'title' in entry and entry.title else entry.summary
    full_title = full_title.strip()

    # Título seguro SOMENTE para filename
    filename_title = clean_filename(full_title)

    # Data
    published = entry.published_parsed
    date_obj = datetime(*published[:6])
    date_str = date_obj.strftime('%Y-%m-%d')

    # Nome final do arquivo
    filename = f"{date_str}-{filename_title}-{post_record_id[:8]}.md"
    path = os.path.join(POSTS_DIR, filename)

    if os.path.exists(path):
        print(f"Post já existe: {filename}")
        continue

    # Conteúdo limpo
    clean_content = strip_tags(entry.summary).strip()

    # Escapar aspas para YAML
    yaml_title = full_title.replace('"', '\\"')
    yaml_description = clean_content.replace('"', '\\"')

    content = f'''---
layout: post
title: "{yaml_title}"
date: {date_str}
description: "{yaml_description}"
bluesky_post_uri: "{post_link}"
---

<h1 class="bluesky-post-title">{full_title}</h1>

<blockquote class="bluesky-embed"
  data-bluesky-uri="{bluesky_uri}"
  data-bluesky-embed-color-mode="system">
  <p>{clean_content}<br><br>
  <a href="{post_link}">[original post]</a></p>
  &mdash; Celo Zaga
  (<a href="https://bsky.app/profile/{did_part}?ref_src=embed">
  @{BLUESKY_HANDLE}</a>)
  <a href="{post_link}?ref_src=embed">
  {date_obj.strftime('%b %d, %Y at %H:%M')}
  </a>
</blockquote>

<script async src="https://embed.bsky.app/static/embed.js" charset="utf-8"></script>

<p class="bluesky-post-description">{clean_content}</p>
'''

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"Post criado: {filename}")
