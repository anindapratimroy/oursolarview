import os
import re

with open('js/main.js', 'r', encoding='utf-8') as f:
    content = f.read()

# The blocks are separated by \n\n because of the way split.py extracted them.
# Let's split them manually.
blocks = content.split('\n\n')

# Actually, the file has 3 IIFEs or script blocks. 
# Let's find the boundaries using regex or simple search.
# Block 1: (function() { const canvas = document.getElementById('space-canvas');
# Block 2: import * as THREE from 'three';
# Block 3: // Preloader

parts = content.split('// Preloader')
if len(parts) == 2:
    page_logic = '// Preloader\n' + parts[1]
    
    parts2 = parts[0].split('import * as THREE')
    if len(parts2) == 2:
        stars_js = parts2[0].strip()
        earth_js = 'import * as THREE' + parts2[1].strip()
        
        with open('js/stars.js', 'w', encoding='utf-8') as f:
            f.write(stars_js)
        with open('js/earth.js', 'w', encoding='utf-8') as f:
            f.write(earth_js)
        with open('js/main.js', 'w', encoding='utf-8') as f:
            # combine imports and page logic
            # main.js should import stars and earth, but stars and earth are currently IIFEs or inline.
            # We'll fix module exports next. For now, just split them.
            f.write(page_logic)

        print("JS split successfully")
    else:
        print("Could not find THREE import")
else:
    print("Could not find Preloader section")
