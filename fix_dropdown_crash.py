with open("trajectory/trajectory.js", "r") as f:
    js = f.read()

# Fix texture listener
old_listener = """if(orbitingBodySelect) {
  orbitingBodySelect.addEventListener('change', () => {
     const val = orbitingBodySelect.value;
     const tex = planetTextures[val];
     earthMat.map = tex;
     
     // Remove Earth-specific maps for other planets
     if (val !== 'earth') {
         earthMat.normalMap = null;
     } else {
         earthMat.normalMap = normalTex;
     }
     
     earthMat.needsUpdate = true;
     
     // Force an orbit rebuild to apply cloud/atmo visibility correctly
     buildAndSetOrbit();
  });
}"""

new_listener = """if(orbitingBodySelect) {
  orbitingBodySelect.addEventListener('change', () => {
     const val = orbitingBodySelect.value;
     const tex = planetTextures[val];
     earthMat.map = tex;
     
     if (val !== 'earth') {
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
js = js.replace(old_listener, new_listener)

# And in buildAndSetOrbit, don't mess with cloudMesh if it's not Earth
old_build = """  simState = 'running';
  earthMesh.visible = true;
  if (orbitingBodySelect && orbitingBodySelect.value !== 'earth') {
      cloudMesh.visible = atmoMesh.visible = false;
  } else {
      cloudMesh.visible = atmoMesh.visible = true;
  }
  velArrow.visible = true;"""

new_build = """  simState = 'running';
  earthMesh.visible = true;
  if (orbitingBodySelect && orbitingBodySelect.value !== 'earth') {
      if (cloudMesh) cloudMesh.visible = false;
      if (atmoMesh) atmoMesh.visible = false;
  } else {
      if (cloudMesh) cloudMesh.visible = true;
      if (atmoMesh) atmoMesh.visible = true;
  }
  velArrow.visible = true;"""
js = js.replace(old_build, new_build)

# Fix rotation issue. If not earth, use lookAt to always face sun so the baked texture lighting looks correct
old_anim = """      earthMesh.position.set(pos.x, pos.y, pos.z);
      cloudMesh.position.set(pos.x, pos.y, pos.z);
      atmoMesh.position.set(pos.x, pos.y, pos.z);
      earthMesh.rotation.y += 0.04;
      cloudMesh.rotation.y += 0.055;"""

new_anim = """      earthMesh.position.set(pos.x, pos.y, pos.z);
      cloudMesh.position.set(pos.x, pos.y, pos.z);
      atmoMesh.position.set(pos.x, pos.y, pos.z);
      
      if (orbitingBodySelect && orbitingBodySelect.value !== 'earth') {
          // Point the mesh at the sun (0,0,0) so the baked bright side faces the sun.
          earthMesh.lookAt(0, 0, 0);
          // Apply an offset so the bright side of the texture actually faces the sun
          // Most baked textures have the bright side at +Z or -Z. Let's add a Y rotation offset.
          earthMesh.rotateY(Math.PI / 2); // adjust if needed
      } else {
          earthMesh.rotation.y += 0.04;
      }
      cloudMesh.rotation.y += 0.055;"""
js = js.replace(old_anim, new_anim)

with open("trajectory/trajectory.js", "w") as f:
    f.write(js)
