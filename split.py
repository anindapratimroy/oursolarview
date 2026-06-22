import re
import os

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract styles
style_match = re.search(r'<style>([\s\S]*?)</style>', content)
if style_match:
    with open('css/main.css', 'w', encoding='utf-8') as f:
        f.write(style_match.group(1).strip())
    content = content.replace(style_match.group(0), '<link rel="stylesheet" href="./css/main.css" />')

# Extract scripts
# Find all script tags except importmaps
scripts = re.findall(r'<script.*?>([\s\S]*?)</script>', content)
js_content = ""
for s in scripts:
    if s.strip():
        # don't extract JSON importmap
        if '"imports":' not in s:
            js_content += s.strip() + "\n\n"

with open('js/main.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

# We will remove the script bodies manually or via script
content = re.sub(r'<script>[\s\S]*?</script>', '', content)
content = re.sub(r'<script type="module">[\s\S]*?</script>', '<script type="module" src="./js/main.js"></script>', content)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Split completed successfully!")
