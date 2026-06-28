import re
import sys

with open("spacecraft/spacecraft.js", "r") as f:
    content = f.read()

# Find the start and end of SPACECRAFT_DB
start_marker = "const SPACECRAFT_DB = [\n"
end_marker = "\n];\n\n/* ────────────────"

start_idx = content.find(start_marker)
if start_idx == -1:
    print("Could not find start marker")
    sys.exit(1)

start_idx += len(start_marker)

end_idx = content.find(end_marker, start_idx)
if end_idx == -1:
    print("Could not find end marker")
    sys.exit(1)

array_content = content[start_idx:end_idx]

# Split into individual objects. 
# They are separated by "},\n  {"
objects = []
current_obj = ""
brace_count = 0

for char in array_content:
    current_obj += char
    if char == '{':
        brace_count += 1
    elif char == '}':
        brace_count -= 1
        if brace_count == 0:
            objects.append(current_obj)
            current_obj = ""

# Clean up whitespace between objects
cleaned_objects = []
for obj in objects:
    obj = obj.strip()
    if obj.startswith(","):
        obj = obj[1:].strip()
    cleaned_objects.append(obj)

# Now identify the ones we want
target_names = ["Perseverance Rover", "Curiosity Rover", "Mars Rover Spirit", "Mars Explorer Rover: Opportunity"]
targets = []
others = []

for obj in cleaned_objects:
    found = False
    for name in target_names:
        if f'name: "{name}"' in obj:
            targets.append((name, obj))
            found = True
            break
    if not found:
        others.append(obj)

# Order targets according to target_names
ordered_targets = []
for name in target_names:
    for t_name, obj in targets:
        if t_name == name:
            ordered_targets.append(obj)
            break

# Combine
final_objects = ordered_targets + others

# Join with ",\n  "
joined = "  " + ",\n  ".join(final_objects)

new_content = content[:start_idx] + joined + content[end_idx:]

with open("spacecraft/spacecraft.js", "w") as f:
    f.write(new_content)

print("Done reordering")
