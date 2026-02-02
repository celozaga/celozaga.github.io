import os
import re
import json
import requests
import datetime
from email.utils import formatdate

# Configuration
HANDLE = "@celozaga"
OUTPUT_FILE = "feeds/youtube-community.xml"

def get_relative_date(date_str):
    """
    Parses strings like "2 hours ago", "1 day ago" into a datetime object.
    Defaults to current time if parsing fails.
    """
    now = datetime.datetime.now(datetime.timezone.utc)
    if not date_str:
        return now
    
    clean_str = date_str.lower().replace('streamed', '').strip()
    
    try:
        val = int(re.search(r'\d+', clean_str).group())
    except:
        val = 1

    if 'second' in clean_str:
        return now - datetime.timedelta(seconds=val)
    if 'minute' in clean_str:
        return now - datetime.timedelta(minutes=val)
    if 'hour' in clean_str:
        return now - datetime.timedelta(hours=val)
    if 'day' in clean_str:
        return now - datetime.timedelta(days=val)
    if 'week' in clean_str:
        return now - datetime.timedelta(weeks=val)
    if 'month' in clean_str:
        return now - datetime.timedelta(days=val * 30)
    if 'year' in clean_str:
        return now - datetime.timedelta(days=val * 365)
        
    return now

def render_description(runs, media):
    html_parts = []
    
    # Render Text
    if runs:
        for run in runs:
            text = run.get('text', '')
            url = run.get('navigationEndpoint', {}).get('commandMetadata', {}).get('webCommandMetadata', {}).get('url')
            
            if url:
                full_url = url if url.startswith('https://') else f"https://www.youtube.com{url}"
                html_parts.append(f'<a href="{full_url}">{text}</a>')
            else:
                html_parts.append(text.replace('\n', '<br>'))
                
    # Render Images
    if media:
        html_parts.append('<br />')
        for item in media:
            if item.get('url'):
                html_parts.append(f'<img src="{item["url"]}" style="max-width: 100%; height: auto;" /><br/>')
                
    return "".join(html_parts)

def fetch_community_data(handle):
    url = f"https://www.youtube.com/{handle}/community"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
    }
    
    print(f"Fetching {url}...")
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    
    # Extract ytInitialData
    match = re.search(r'ytInitialData = ({.*?});', response.text)
    if not match:
        raise ValueError("Could not find ytInitialData")
        
    data = json.loads(match.group(1))
    
    # Extract Metadata
    channel_meta = data.get('metadata', {}).get('channelMetadataRenderer')
    if not channel_meta:
        # Fallback
        microformat = data.get('microformat', {}).get('microformatDataRenderer', {})
        header = data.get('header', {})
        avatar_url = ""
        
        # Try finding avatar in various header types
        c4_header = header.get('c4TabbedHeaderRenderer', {})
        page_header = header.get('pageHeaderRenderer', {}).get('content', {}).get('pageHeaderViewModel', {})
        
        if c4_header.get('avatar', {}).get('thumbnails'):
             avatar_url = c4_header['avatar']['thumbnails'][0]['url']
        elif page_header.get('image', {}).get('decoratedAvatarViewModel', {}).get('avatar', {}).get('avatarViewModel', {}).get('image', {}).get('thumbnails'):
             avatar_url = page_header['image']['decoratedAvatarViewModel']['avatar']['avatarViewModel']['image']['thumbnails'][0]['url']
        
        channel_meta = {
            'title': microformat.get('title', handle),
            'description': microformat.get('description', ''),
            'channelUrl': f"https://www.youtube.com/{handle}",
            'avatar': avatar_url
        }
    else:
        # Normalize avatar from standard metadata if needed (usually it's in avatar->thumbnails)
        if channel_meta.get('avatar', {}).get('thumbnails'):
             channel_meta['avatar'] = channel_meta['avatar']['thumbnails'][0]['url']
        else:
             channel_meta['avatar'] = ""

    # Find Community Tab
    tabs = data.get('contents', {}).get('twoColumnBrowseResultsRenderer', {}).get('tabs', [])
    community_tab = None
    
    for tab in tabs:
        tab_renderer = tab.get('tabRenderer', {})
        url = tab_renderer.get('endpoint', {}).get('commandMetadata', {}).get('webCommandMetadata', {}).get('url', '')
        if tab_renderer.get('selected') or url.endswith('/community') or url.endswith('/posts'):
            community_tab = tab_renderer
            break
            
    if not community_tab:
        raise ValueError("Community tab not found")
        
    # Extract Content
    try:
        section_list = community_tab.get('content', {}).get('sectionListRenderer', {}).get('contents', [])
        item_section = section_list[0].get('itemSectionRenderer', {}).get('contents', [])
    except IndexError:
        item_section = []
        
    items = []
    
    for item in item_section:
        thread = item.get('backstagePostThreadRenderer')
        if not thread:
            continue
            
        post = thread.get('post', {}).get('backstagePostRenderer') or \
               thread.get('post', {}).get('sharedPostRenderer', {}).get('originalPost', {}).get('backstagePostRenderer')
               
        if not post:
            continue
            
        # Extract Images
        media = []
        attachments = post.get('backstageAttachment', {})
        try:
            if 'postMultiImageRenderer' in attachments:
                for img in attachments['postMultiImageRenderer'].get('images', []):
                    thumbnails = img.get('backstageImageRenderer', {}).get('image', {}).get('thumbnails', [])
                    if thumbnails:
                        media.append(thumbnails[-1])
            elif 'backstageImageRenderer' in attachments:
                thumbnails = attachments['backstageImageRenderer'].get('image', {}).get('thumbnails', [])
                if thumbnails:
                    media.append(thumbnails[-1])
        except Exception as e:
            print(f"Warning: Failed to extract media for post {post.get('postId')}: {e}")
                
        # Extract Text
        content_runs = post.get('contentText', {}).get('runs', [])
        description = render_description(content_runs, media)
        
        # Title
        title_text = content_runs[0].get('text', '') if content_runs else 'Community Post'
        title = (title_text[:80] + '...') if len(title_text) > 80 else title_text
        
        # Other Meta
        post_id = post.get('postId')
        link = f"https://www.youtube.com/post/{post_id}"
        author = post.get('authorText', {}).get('runs', [{}])[0].get('text', channel_meta['title'])
        date_str = post.get('publishedTimeText', {}).get('runs', [{}])[0].get('text', '').split('(')[0]
        pub_date = get_relative_date(date_str)
        
        items.append({
            'title': title,
            'description': description,
            'link': link,
            'guid': link,
            'author': author,
            'pubDate': pub_date
        })
        
    return channel_meta, items

def generate_rss(channel, items):
    rss_items = []
    for item in items:
        # Format date to RFC 822
        pub_date_str = formatdate(item['pubDate'].timestamp())
        
        rss_items.append(f"""
        <item>
            <title><![CDATA[{item['title']}]]></title>
            <description><![CDATA[{item['description']}]]></description>
            <link>{item['link']}</link>
            <guid isPermaLink="true">{item['guid']}</guid>
            <author>{item['author']}</author>
            <pubDate>{pub_date_str}</pubDate>
        </item>""")
        
    last_build_date = formatdate(datetime.datetime.now(datetime.timezone.utc).timestamp())
    
    rss_content = f"""<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
        <title><![CDATA[{channel['title']} - Community Posts]]></title>
        <description><![CDATA[{channel['description']}]]></description>
        <link>{channel['channelUrl']}</link>
        <image>
            <url>{channel['avatar']}</url>
            <title>{channel['title']}</title>
            <link>{channel['channelUrl']}</link>
        </image>
        <generator>Custom Python Script</generator>
        <lastBuildDate>{last_build_date}</lastBuildDate>
        <atom:link href="https://celozaga.github.io/feeds/youtube-community.xml" rel="self" type="application/rss+xml" />
        { "".join(rss_items) }
    </channel>
</rss>"""

    return rss_content

if __name__ == "__main__":
    try:
        channel, items = fetch_community_data(HANDLE)
        xml = generate_rss(channel, items)
        
        # Ensure directory exists
        os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
        
        with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
            f.write(xml)
            
        print(f"Successfully generated RSS feed at {OUTPUT_FILE} with {len(items)} items")
        
    except Exception as e:
        print(f"Error: {e}")
        exit(1)
