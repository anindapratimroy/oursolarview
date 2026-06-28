import re

# 1. Update HTML
with open('trajectory/index.html', 'r') as f:
    html = f.read()

# Insert collision warning UI
collision_ui = """  <div id="collisionWarning" style="display:none; position:absolute; top:80px; left:50%; transform:translateX(-50%); background:rgba(255,0,0,0.8); color:white; padding:10px 20px; font-weight:bold; font-size:1.2rem; border-radius:8px; z-index:3000;">
    <i class="fa-solid fa-triangle-exclamation"></i> COLLISION ALERT! The body has crashed into the central mass!
  </div>
"""
if "collisionWarning" not in html:
    html = html.replace('<div id="orbitTypeBadge">', collision_ui + '<div id="orbitTypeBadge">')

# Insert Orbiting Body dropdown
orbiting_body_dropdown = """    <div class="control-group">
      <label>Orbiting Body</label>
      <select id="orbitingBody">
        <option value="earth">Earth</option>
        <option value="mars">Mars</option>
        <option value="jupiter">Jupiter</option>
        <option value="mercury">Mercury</option>
        <option value="venus">Venus</option>
        <option value="saturn">Saturn</option>
        <option value="uranus">Uranus</option>
        <option value="neptune">Neptune</option>
      </select>
    </div>
"""
if "orbitingBody" not in html:
    html = html.replace('<label>Central Mass System</label>', orbiting_body_dropdown + '    <div class="control-group">\n      <label>Central Mass System</label>')

with open('trajectory/index.html', 'w') as f:
    f.write(html)

# 2. Update JS
with open('trajectory/trajectory.js', 'r') as f:
    js = f.read()

# Fix presets
presets_old = """// ── Presets ───────────────────────────────────────────────────
document.getElementById('preEarth').addEventListener('click', () => {
  eccSlider.value = 0.017;
  aSlider.value = 15;
  eccSlider.dispatchEvent(new Event('input'));
  aSlider.dispatchEvent(new Event('input'));
});
document.getElementById('preHalley').addEventListener('click', () => {
  eccSlider.value = 0.967;
  aSlider.value = 26;
  eccSlider.dispatchEvent(new Event('input'));
  aSlider.dispatchEvent(new Event('input'));
});
document.getElementById('preHyper').addEventListener('click', () => {
  eccSlider.value = 1.2;
  aSlider.value = 15;
  eccSlider.dispatchEvent(new Event('input'));
  aSlider.dispatchEvent(new Event('input'));
});
document.getElementById('preISS').addEventListener('click', () => {
  centralMassSelect.value = "0.000003"; centralMassSelect.dispatchEvent(new Event('change'));
  eccSlider.value = 0.001; aSlider.value = 5;
  incSlider.value = 51; nodeSlider.value = 0; argSlider.value = 0;
  [eccSlider, aSlider, incSlider, nodeSlider, argSlider].forEach(el => el.dispatchEvent(new Event('input')));
});
document.getElementById('preMolniya').addEventListener('click', () => {
  centralMassSelect.value = "0.000003"; centralMassSelect.dispatchEvent(new Event('change'));
  eccSlider.value = 0.74; aSlider.value = 18;
  incSlider.value = 63; nodeSlider.value = 90; argSlider.value = 270;
  [eccSlider, aSlider, incSlider, nodeSlider, argSlider].forEach(el => el.dispatchEvent(new Event('input')));
});"""

presets_new = """// ── Presets ───────────────────────────────────────────────────
function resetToDefault() {
  centralMassSelect.value = "1"; centralMassSelect.dispatchEvent(new Event('change'));
  incSlider.value = 0; nodeSlider.value = 0; argSlider.value = 0;
}
document.getElementById('preEarth').addEventListener('click', () => {
  resetToDefault();
  eccSlider.value = 0.017; aSlider.value = 15;
  [eccSlider, aSlider, incSlider, nodeSlider, argSlider].forEach(el => el.dispatchEvent(new Event('input')));
});
document.getElementById('preHalley').addEventListener('click', () => {
  resetToDefault();
  eccSlider.value = 0.967; aSlider.value = 26;
  [eccSlider, aSlider, incSlider, nodeSlider, argSlider].forEach(el => el.dispatchEvent(new Event('input')));
});
document.getElementById('preHyper').addEventListener('click', () => {
  resetToDefault();
  eccSlider.value = 1.2; aSlider.value = 15;
  [eccSlider, aSlider, incSlider, nodeSlider, argSlider].forEach(el => el.dispatchEvent(new Event('input')));
});
document.getElementById('preISS').addEventListener('click', () => {
  centralMassSelect.value = "0.000003"; centralMassSelect.dispatchEvent(new Event('change'));
  eccSlider.value = 0.001; aSlider.value = 5;
  incSlider.value = 51; nodeSlider.value = 0; argSlider.value = 0;
  [eccSlider, aSlider, incSlider, nodeSlider, argSlider].forEach(el => el.dispatchEvent(new Event('input')));
});
document.getElementById('preMolniya').addEventListener('click', () => {
  centralMassSelect.value = "0.000003"; centralMassSelect.dispatchEvent(new Event('change'));
  eccSlider.value = 0.74; aSlider.value = 18;
  incSlider.value = 63; nodeSlider.value = 90; argSlider.value = 270;
  [eccSlider, aSlider, incSlider, nodeSlider, argSlider].forEach(el => el.dispatchEvent(new Event('input')));
});"""
js = js.replace(presets_old, presets_new)

# Add orbiting body texture change logic
texture_logic = """
const orbitingBodySelect = document.getElementById('orbitingBody');
const textureLoader = new THREE.TextureLoader();
const planetTextures = {
  earth: textureLoader.load('../earth.avif'),
  mars: textureLoader.load('../mars.webp'),
  jupiter: textureLoader.load('../jupiter.avif'),
  mercury: textureLoader.load('../mercury.webp'),
  venus: textureLoader.load('../venus.webp'),
  saturn: textureLoader.load('../saturn.avif'),
  uranus: textureLoader.load('../uranus.webp'),
  neptune: textureLoader.load('../neptune.avif')
};
if(orbitingBodySelect) {
  orbitingBodySelect.addEventListener('change', () => {
     earthMat.map = planetTextures[orbitingBodySelect.value];
     earthMat.needsUpdate = true;
  });
}
const collisionWarningEl = document.getElementById('collisionWarning');
"""
js = js.replace("// ── Presets ───────────────────────────────────────────────────", texture_logic + "\n// ── Presets ───────────────────────────────────────────────────")

# Collision detection logic inside animate() loop
anim_old = """      // Dashboard: distance
      const distAU = (dist2Sun / SF) / 1.496e11;
      distValEl.textContent = distAU.toFixed(3) + ' AU';"""
anim_new = """      // Dashboard: distance
      const distAU = (dist2Sun / SF) / 1.496e11;
      distValEl.textContent = distAU.toFixed(3) + ' AU';
      
      // Collision detection (if distance < Sun radius scaled)
      // The sun mesh is scaled to a certain size. In this simulation, let's say collision happens if distAU < 0.2 (just an arbitrary small threshold for collision with a star)
      // Actually, sunMesh has a radius of 20 units. Our distance is in THREE units (dist2Sun).
      if (dist2Sun < 25) {
         collisionWarningEl.style.display = 'block';
      } else {
         collisionWarningEl.style.display = 'none';
      }"""
js = js.replace(anim_old, anim_new)

with open('trajectory/trajectory.js', 'w') as f:
    f.write(js)
