import re

with open('solarsystem/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract script type="module"
script_match = re.search(r'<script type="module">([\s\S]*?)</script>', content)
if script_match:
    js_content = script_match.group(1).strip()
    with open('solarsystem/solarsystem.js', 'w', encoding='utf-8') as f:
        f.write(js_content)
    content = content.replace(script_match.group(0), '<script type="module" src="./solarsystem.js"></script>')

# Replace the scattered controls with a unified control panel
# We need to find the <a class="back-btn">, <div id="sliderContainer">, <div id="topRightControls">
# and wrap them in a .control-panel.

html_replacements = [
    # Find the scattered elements (using rough regex or we can just replace the whole body prefix)
]

# Write back
with open('solarsystem/index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("Extracted solarsystem JS")
