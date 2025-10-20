import os
import feedparser
from datetime import datetime
from html.parser import HTMLParser
import unicodedata
import re

# Seu handle do Bluesky
BLUESKY_HANDLE = 'celozaga.bsky.social'
RSS_URL = f'https://bsky.app/profile/{BLUESKY_HANDLE}/rss'
POSTS_DIR = '_posts'

class MLStripper(HTMLParser):
    def __init__(self):
        super().__init__()
        self.reset()
        self.strict = False
        self.convert_charrefs = True
        self.text = []
    def handle_data(self, d):
        self.text.append(d)
    def get_data(self):
        return ''.join(self.text)

def strip_tags(html):
    s = MLStripper()
    s.feed(html)
    return s.get_data()

def clean_filename(text):
    """
    Remove acentos, caracteres especiais e espaços extras.
    """
    text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode('ascii')
    text = re.sub(r'[^\w\s-]', '', text)  # Remove tudo que não é letra, número, espaço ou -
    text = text.strip().replace(' ', '-')
    return text.lower()

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

    # Título completo para exibição e meta tags
    full_title = entry.title if 'title' in entry and entry.title else entry.summary
    safe_title = full_title.replace('/', '-').replace('\\', '-').strip()

    # Versão truncada e limpa APENAS para o nome do arquivo
    filename_title = clean_filename(safe_title[:50])

    published = entry.published_parsed
    date_obj = datetime(*published[:6])
    date_str = date_obj.strftime('%Y-%m-%d')

    # Gera o filename final
    filename = f"{date_str}-{filename_title}-{post_record_id[:8]}.md"
    path = os.path.join(POSTS_DIR, filename)

    if not os.path.exists(path):
        # Meta description completo, escapando aspas
        meta_description = entry.summary.replace('"', '\\"').strip()

        clean_content = strip_tags(entry.summary).strip()

        content = f'''---
layout: post
title: "{full_title.replace('"', '\\"')}"
date: {date_str}
description: "{meta_description}"
bluesky_post_uri: "{post_link}"
---

<h1 class="bluesky-post-title">{full_title}</h1>

<blockquote class="bluesky-embed" data-bluesky-uri="{bluesky_uri}" data-bluesky-embed-color-mode="system">
<p lang="">{clean_content}<br><br><a href="{post_link}">[original post]</a></p>
&mdash; Celo Zaga (<a href="https://bsky.app/profile/{did_part}?ref_src=embed">@{BLUESKY_HANDLE}</a>) <a href="{post_link}?ref_src=embed">{date_obj.strftime('%b %d, %Y at %H:%M')}</a>
</blockquote>
<script async src="https://embed.bsky.app/static/embed.js" charset="utf-8"></script>

<p class="bluesky-post-description">{clean_content}</p>
'''

        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Post de Bluesky criado: {filename}")
    else:
        print(f"Post de Bluesky já existe: {filename}")
