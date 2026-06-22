import os

def replace_in_file(path, old, new):
    if not os.path.exists(path):
        return
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    content = content.replace(old, new)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

# Use 2k versions for solarsystem and planets cards to save memory
replace_in_file('js/planets.js', '8k_', '2k_')
replace_in_file('solarsystem/solarsystem.js', '8k_', '2k_')
replace_in_file('trajectory/trajectory.js', '8k_', '2k_')

print("Updated texture references to 2k.")
