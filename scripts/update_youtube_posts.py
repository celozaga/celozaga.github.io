import os
import feedparser
from datetime import datetime

# O ID do canal será passado como variável de ambiente pelo GitHub Actions
channel_id = os.environ['CHANNEL_ID']
rss_url = f'https://www.youtube.com/feeds/videos.xml?channel_id={channel_id}'
posts_dir = '_posts'

feed = feedparser.parse(rss_url)

if not feed.entries:
    print("Nenhum vídeo encontrado no RSS.")
    exit(0)

if not os.path.exists(posts_dir):
    os.makedirs(posts_dir)

for entry in feed.entries:
    video_id = entry.yt_videoid
    title = entry.title.replace('/', '-')
    published = entry.published_parsed
    date_str = datetime(*published[:6]).strftime('%Y-%m-%d')
    filename = f"{date_str}-{title.lower().replace(' ', '-')}.md"
    path = os.path.join(posts_dir, filename)

    if not os.path.exists(path):
        content = f'''---
layout: post
title: "{entry.title}"
date: {date_str}
---

<h1>{entry.title}</h1>

<iframe width="560" height="315" src="https://www.youtube.com/embed/{video_id}" frameborder="0" allowfullscreen></iframe>

<p>{entry.summary}</p>
'''
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Criado post: {filename}")
    else:
        print(f"Post já existe: {filename}")
