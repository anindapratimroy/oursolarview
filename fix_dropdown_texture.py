with open("trajectory/trajectory.js", "r") as f:
    js = f.read()

# Fix texture switching
old_logic = """if(orbitingBodySelect) {
  orbitingBodySelect.addEventListener('change', () => {
     earthMat.map = planetTextures[orbitingBodySelect.value];
     earthMat.needsUpdate = true;
  });
}"""

new_logic = """if(orbitingBodySelect) {
  orbitingBodySelect.addEventListener('change', () => {
     const tex = planetTextures[orbitingBodySelect.value];
     // Optional: If you need to make sure color space matches
     if (tex) tex.colorSpace = THREE.SRGBColorSpace;
     earthMat.map = tex;
     
     // Remove Earth-specific maps for other planets
     if (orbitingBodySelect.value !== 'earth') {
         earthMat.normalMap = null;
         if (cloudMesh) cloudMesh.visible = false;
         if (atmoMesh) atmoMesh.visible = false;
     } else {
         earthMat.normalMap = normalTex;
         if (cloudMesh) cloudMesh.visible = true;
         if (atmoMesh) atmoMesh.visible = true;
     }
     earthMat.needsUpdate = true;
  });
}"""
js = js.replace(old_logic, new_logic)

with open("trajectory/trajectory.js", "w") as f:
    f.write(js)
