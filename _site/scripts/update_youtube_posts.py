import os
import feedparser
from datetime import datetime
import json
import unicodedata
import re

# =========================
# CONFIGURAÇÃO
# =========================
CHANNEL_ID = os.environ.get('CHANNEL_ID', 'UCvOnTTQp_7ZXtWUZYEUZO7Q')
RSS_URL = f'https://www.youtube.com/feeds/videos.xml?channel_id={CHANNEL_ID}'
POSTS_DIR = '_posts'


# =========================
# UTILITÁRIOS
# =========================
def clean_filename(text, max_length=50):
    """
    Gera um nome de arquivo 100% seguro para Windows, Linux e macOS.
    """
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
    print("Nenhum vídeo encontrado no RSS.")
    exit(0)

if not os.path.exists(POSTS_DIR):
    os.makedirs(POSTS_DIR)

for entry in feed.entries:
    video_id = entry.yt_videoid
    full_title = entry.title.strip()

    # Filename seguro
    filename_title = clean_filename(full_title)

    # Thumbnail
    thumbnail_url = ''
    if hasattr(entry, 'media_thumbnail') and entry.media_thumbnail:
        thumbnail_url = entry.media_thumbnail[0]['url']

    # Datas
    published = entry.published_parsed
    date_obj = datetime(*published[:6])
    date_str = date_obj.strftime('%Y-%m-%d')
    date_iso = date_obj.strftime('%Y-%m-%dT%H:%M:%S%z')

    # Nome do arquivo FINAL
    filename = f"{date_str}-{filename_title}-{video_id}.md"
    path = os.path.join(POSTS_DIR, filename)

    if os.path.exists(path):
        print(f"Post já existe: {filename}")
        continue

    # Conteúdo seguro
    summary = entry.summary.strip()
    yaml_title = full_title.replace('"', '\\"')
    yaml_description = summary.replace('"', '\\"')

    if len(yaml_description) > 155:
        yaml_description = yaml_description[:152] + '...'

    # Schema.org
    video_schema = {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        "name": full_title,
        "description": summary,
        "thumbnailUrl": thumbnail_url,
        "uploadDate": date_iso,
        "embedUrl": f"https://www.youtube.com/embed/{video_id}",
        "publisher": {
            "@type": "Person",
            "name": "Celo Zaga"
        }
    }

    blog_schema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": full_title,
        "image": thumbnail_url,
        "datePublished": date_iso,
        "dateModified": date_iso,
        "author": {
            "@type": "Person",
            "name": "Celo Zaga"
        },
        "description": yaml_description
    }

    content = f'''---
layout: post
title: "{yaml_title}"
date: {date_str}
description: "{yaml_description}"
image: "{thumbnail_url}"
tags: [youtube, video]
og_type: "video.other"
---

<script type="application/ld+json">
{json.dumps(video_schema, indent=2)}
</script>

<script type="application/ld+json">
{json.dumps(blog_schema, indent=2)}
</script>

<h1 class="youtube-post-title">{full_title}</h1>

<iframe
  class="youtube-post-embed"
  src="https://www.youtube.com/embed/{video_id}"
  frameborder="0"
  allowfullscreen>
</iframe>

<p class="youtube-post-description">{summary}</p>
'''

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"Post criado: {filename}")
