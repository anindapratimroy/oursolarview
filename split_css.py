import os

with open('css/main.css', 'r', encoding='utf-8') as f:
    lines = f.readlines()

def extract(start_line, end_line):
    return "".join(lines[start_line-1:end_line])

# Extract parts
design_tokens = extract(1, 18)
base = extract(19, 80)
layout = extract(81, 342) + extract(380, 432) + extract(546, 713) + extract(866, len(lines))
components = extract(343, 379) + extract(433, 545) + extract(714, 854)
animations = extract(855, 865)

os.makedirs('css', exist_ok=True)

with open('css/design-tokens.css', 'w', encoding='utf-8') as f: f.write(design_tokens)
with open('css/base.css', 'w', encoding='utf-8') as f: f.write(base)
with open('css/layout.css', 'w', encoding='utf-8') as f: f.write(layout)
with open('css/components.css', 'w', encoding='utf-8') as f: f.write(components)
with open('css/animations.css', 'w', encoding='utf-8') as f: f.write(animations)

# Now modify index.html to include these css files instead of main.css
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

html = html.replace('<link rel="stylesheet" href="./css/main.css" />', '''
  <link rel="stylesheet" href="./css/design-tokens.css" />
  <link rel="stylesheet" href="./css/base.css" />
  <link rel="stylesheet" href="./css/layout.css" />
  <link rel="stylesheet" href="./css/components.css" />
  <link rel="stylesheet" href="./css/animations.css" />
''')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("CSS split successfully")
