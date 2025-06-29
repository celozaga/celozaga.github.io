import os
import feedparser
from datetime import datetime
from html.parser import HTMLParser

# Seu handle do Bluesky
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
    # O ID da postagem no Bluesky está em entry.id e precisamos extrair a URI completa
    # A URI tem o formato at://did:plc:.../app.bsky.feed.post/xxxxxxxxxxx
    # O entry.id do feedparser para Bluesky é geralmente a URI completa.
    bluesky_uri = entry.id
    
    # O DID do perfil (did:plc:...) e o ID do post (xxxxxxxxxxx) podem ser extraídos da URI
    # Ex: at://did:plc:lmh6rennptq77inaztnovw4b/app.bsky.feed.post/3lsk3fzlead2v
    parts = bluesky_uri.split('/')
    did_part = parts[2] # did:plc:lmh6rennptq77inaztnovw4b
    post_record_id = parts[-1] # 3lsk3fzlead2v

    # O link direto para o post no Bluesky
    post_link = entry.link

    # O título pode ser o próprio conteúdo do post se não houver um título explícito
    title = entry.title if 'title' in entry and entry.title else entry.summary
    title = title.replace('/', '-').replace('\\', '-').strip() # Limpa caracteres para filename

    # Garante que o título não seja muito longo para o nome do arquivo
    if len(title) > 50:
        title = title[:50] + '...'

    published = entry.published_parsed
    date_obj = datetime(*published[:6])
    date_str = date_obj.strftime('%Y-%m-%d')

    # Cria um nome de arquivo único
    filename_title = title.lower().replace(' ', '-').replace('.', '')
    filename = f"{date_str}-{filename_title}-{post_record_id[:8]}.md" # Adiciona parte do ID para unicidade
    path = os.path.join(POSTS_DIR, filename)

    if not os.path.exists(path):
        # Trata a descrição (resumo) para a meta tag e o conteúdo do post
        safe_summary = entry.summary.replace('"', '\\"').strip()
        meta_description = safe_summary
        if len(meta_description) > 155:
            meta_description = meta_description[:152] + '...'

        clean_content = strip_tags(entry.summary).strip() # Conteúdo principal do post


        content = f'''---
layout: post
title: "{entry.title.replace('"', '\\"') if 'title' in entry else title.replace('"', '\\"')}"
date: {date_str}
description: "{meta_description}"
---

<h1 class="bluesky-post-title">{entry.title if 'title' in entry else title}</h1>

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
