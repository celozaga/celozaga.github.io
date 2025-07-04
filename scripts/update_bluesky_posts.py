import os
import feedparser
from datetime import datetime
from html.parser import HTMLParser
import json

BLUESKY_HANDLE = 'celozaga.bsky.social'
RSS_URL = f'https://bsky.app/profile/{BLUESKY_HANDLE}/rss'
POSTS_DIR = '_posts'

class MLStripper(HTMLParser):
    def __init__(self):
        super().__init__()
        self.reset()
        self.strict = False
        self.convert_charrefs= True
        self.text = []
    def handle_data(self, d):
        self.text.append(d)
    def get_data(self):
        return ''.join(self.text)

def strip_tags(html):
    s = MLStripper()
    s.feed(html)
    return s.get_data()

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

    title = entry.title if 'title' in entry and entry.title else entry.summary
    title = title.replace('/', '-').replace('\\', '-').strip()
    if len(title) > 50:
        title = title[:50] + '...'

    published = entry.published_parsed
    date_obj = datetime(*published[:6])
    date_str = date_obj.strftime('%Y-%m-%d')
    date_iso = date_obj.strftime('%Y-%m-%dT%H:%M:%S%z')

    filename_title = title.lower().replace(' ', '-').replace('.', '')
    filename = f"{date_str}-{filename_title}-{post_record_id[:8]}.md"
    path = os.path.join(POSTS_DIR, filename)

    if not os.path.exists(path):
        safe_summary = entry.summary.replace('"', '\\"').strip()
        meta_description = safe_summary
        if len(meta_description) > 155:
            meta_description = meta_description[:152] + '...'

        clean_content = strip_tags(entry.summary).strip()

        blog_posting_schema = {
            "@context": "http://schema.org",
            "@type": "BlogPosting",
            "headline": entry.title.replace('"', '\\"') if 'title' in entry else title.replace('"', '\\"'),
            "description": meta_description,
            "url": post_link,
            "datePublished": date_iso,
            "dateCreated": date_iso,
            "dateModified": date_iso,
            "author": {
                "@type": "Person",
                "name": "Celo Zaga"
            },
            "publisher": {
                "@type": "Person",
                "name": "Celo Zaga"
            },
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": f"https://celozaga.github.io/{date_obj.strftime('%Y/%m/%d')}/{filename_title}-{post_record_id[:8]}.html"
            },
        }
        blog_posting_schema_json = json.dumps(blog_posting_schema, indent=2)

        content = f'''---
layout: post
title: "{entry.title.replace('"', '\\"') if 'title' in entry else title.replace('"', '\\"')}"
date: {date_str}
description: "{meta_description}"
tags: [bluesky, social]
---

<script type="application/ld+json">
{blog_posting_schema_json}
</script>

<h1 class="bluesky-post-title">{entry.title if 'title' in entry else title}</h1>

<blockquote class="bluesky-embed" data-bluesky-uri="{bluesky_uri}" data-bluesky-embed-color-mode="system">
<p lang="">{clean_content}<br><br><a href="{post_link}">{{{{'original post'}}}}</a></p> {# CORRIGIDO AQUI: Escapado como string literal #}
&mdash; Celo Zaga (<a href="https://bsky.app/profile/{did_part}?ref_src=embed">{{{{'@'}}}} {BLUESKY_HANDLE}</a>) <a href="{post_link}?ref_src=embed">{date_obj.strftime('%b %d, %Y at %H:%M')}</a>
</blockquote>
<script async src="https://embed.bsky.app/static/embed.js" charset="utf-8"></script>

<p class="bluesky-post-description">{clean_content}</p>
'''
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Post de Bluesky criado: {filename}")
    else:
        print(f"Post de Bluesky já existe: {filename}")
