import os
import feedparser
from datetime import datetime

channel_id = os.environ['CHANNEL_ID']
rss_url = f'http://www.youtube.com/feeds/videos.xml?channel_id={channel_id}'
posts_dir = '_posts'

feed = feedparser.parse(rss_url)

if not feed.entries:
    print("Nenhum vídeo encontrado no RSS.")
    exit(0)

if not os.path.exists(posts_dir):
    os.makedirs(posts_dir)

for entry in feed.entries:
    video_id = entry.yt_videoid
    title = entry.title.replace('/', '-')  # Substitui barras para evitar problemas no nome do arquivo
    published = entry.published_parsed
    date_str = datetime(*published[:6]).strftime('%Y-%m-%d')
    filename = f"{date_str}-{title.lower().replace(' ', '-')}.md"
    path = os.path.join(posts_dir, filename)

    if not os.path.exists(path):
        # Trata a descrição para ser usada na meta tag:
        # 1. Escapa as aspas duplas para não quebrar o YAML do front matter
        # 2. Limita o tamanho para ser adequado como meta descrição (aprox. 155 caracteres)
        safe_summary = entry.summary.replace('"', '\\"')
        meta_description = safe_summary
        if len(meta_description) > 155:
            meta_description = meta_description[:152] + '...' # 152 + ... = 155 caracteres


        content = f'''---
layout: post
title: "{entry.title}"
date: {date_str}
description: "{meta_description}"
---

<h1 class="youtube-post-title">{entry.title}</h1>

<iframe width="560" height="315" src="https://www.youtube.com/embed/{video_id}" class="youtube-post-embed" frameborder="0" allowfullscreen></iframe>

<p class="youtube-post-description">{entry.summary}</p>
'''
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Post criado: {filename}")
    else:
        print(f"Post já existe: {filename}")
