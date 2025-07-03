import os
import feedparser
from datetime import datetime
import json

CHANNEL_ID = os.environ.get('CHANNEL_ID', 'UCvOnTTQp_7ZXtWUZYEUZO7Q')

RSS_URL = f'http://www.youtube.com/feeds/videos.xml?channel_id={CHANNEL_ID}'
POSTS_DIR = '_posts'

feed = feedparser.parse(RSS_URL)

if not feed.entries:
    print("Nenhum vídeo encontrado no RSS.")
    exit(0)

if not os.path.exists(POSTS_DIR):
    os.makedirs(POSTS_DIR)

for entry in feed.entries:
    video_id = entry.yt_videoid
    title = entry.title.replace('/', '-').replace('\\', '-').strip()

    thumbnail_url = ''
    if hasattr(entry, 'media_thumbnail') and entry.media_thumbnail:
        thumbnail_url = entry.media_thumbnail[0]['url']
    elif hasattr(entry, 'media_content') and entry.media_content:
        for media_item in entry.media_content:
            if 'url' in media_item and 'type' in media_item and media_item['type'].startswith('image/'):
                thumbnail_url = media_item['url']
                break

    published_parsed = entry.published_parsed
    date_obj = datetime(*published_parsed[:6])
    date_str = date_obj.strftime('%Y-%m-%d')
    date_iso = date_obj.strftime('%Y-%m-%dT%H:%M:%S%z')

    filename_title = title.lower().replace(' ', '-')
    filename = f"{date_str}-{filename_title}-{video_id}.md"
    path = os.path.join(POSTS_DIR, filename)

    if not os.path.exists(path):
        safe_summary = entry.summary.replace('"', '\\"').strip()
        meta_description = safe_summary
        if len(meta_description) > 155:
            meta_description = meta_description[:152] + '...'

        video_schema = {
            "@context": "http://schema.org",
            "@type": "VideoObject",
            "name": entry.title.replace('"', '\\"'),
            "description": safe_summary,
            "thumbnailUrl": thumbnail_url,
            "uploadDate": date_iso,
            "embedUrl": f"https://www.youtube.com/embed/{video_id}",
            "publisher": {
                "@type": "Person",
                "name": "Celo Zaga"
            },
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": f"https://celozaga.github.io/{date_obj.strftime('%Y/%m/%d')}/{filename_title}-{video_id}.html"
            },
            "duration": "PT0M0S",
        }

        blog_posting_schema = {
            "@context": "http://schema.org",
            "@type": "BlogPosting",
            "headline": entry.title.replace('"', '\\"'),
            "image": thumbnail_url if thumbnail_url else f"https://celozaga.github.io/static/media/og/celozaga.jpg",
            "publisher": {
                "@type": "Person",
                "name": "Celo Zaga"
            },
            "url": f"https://celozaga.github.io/{date_obj.strftime('%Y/%m/%d')}/{filename_title}-{video_id}.html",
            "datePublished": date_iso,
            "dateCreated": date_iso,
            "dateModified": date_iso,
            "description": meta_description,
            "author": {
                "@type": "Person",
                "name": "Celo Zaga"
            },
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": f"https://celozaga.github.io/{date_obj.strftime('%Y/%m/%d')}/{filename_title}-{video_id}.html"
            }
        }

        video_schema_json = json.dumps(video_schema, indent=2)
        blog_posting_schema_json = json.dumps(blog_posting_schema, indent=2)

        content = f'''---
layout: post
title: "{entry.title.replace('"', '\\"')}"
date: {date_str}
description: "{meta_description}"
image: "{thumbnail_url}"
tags: [youtube, video]
og_type: "video.other"
---

<script type="application/ld+json">
{video_schema_json}
</script>

<script type="application/ld+json">
{blog_posting_schema_json}
</script>

<h1 class="youtube-post-title">{entry.title}</h1>

<iframe width="560" height="315" src="https://www.youtube.com/embed/{video_id}" class="youtube-post-embed" frameborder="0" allowfullscreen></iframe>

<p class="youtube-post-description">{entry.summary}</p>
'''
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Post criado: {filename}")
    else:
        print(f"Post já existe: {filename}")
