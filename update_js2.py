with open("trajectory/trajectory.js", "r") as f:
    content = f.read()

import re

# 1. Create Orbital Plane Mesh in buildAndSetOrbit
plane_creation = """  // Create Orbital Plane if it's an ellipse
  if (isClosed && showPlaneCb) {
    const cx = -a_scaled * e;
    const b_scaled = a_scaled * Math.sqrt(1 - e * e);
    const planeGeo = new THREE.PlaneGeometry(a_scaled * 2, b_scaled * 2, 32, 32);
    orbitalPlaneMesh = new THREE.Mesh(planeGeo, new THREE.MeshBasicMaterial({
      color: color, transparent: true, opacity: 0.1, side: THREE.DoubleSide, depthWrite: false
    }));
    
    // Position center of the ellipse correctly before rotating
    orbitalPlaneMesh.position.set(cx, 0, 0);
    
    // We need to group it to rotate the whole orbital system
    const planeGroup = new THREE.Group();
    planeGroup.add(orbitalPlaneMesh);
    
    const inc = parseFloat(incSlider.value) * (Math.PI/180);
    const node = parseFloat(nodeSlider.value) * (Math.PI/180);
    const argP = parseFloat(argSlider.value) * (Math.PI/180);
    planeGroup.rotation.set(inc, node, argP, 'YXZ');
    
    orbitalPlaneMesh = planeGroup; // Track the group to easily remove it later
    scene.add(orbitalPlaneMesh);
    orbitalPlaneMesh.visible = showPlaneCb.checked;
  }
"""
content = content.replace("  // --- Dynamic Perfectly Fitted Grid ---", plane_creation + "\n  // --- Dynamic Perfectly Fitted Grid ---")


# 2. Update Animation loop tail check
tail_old = """      // Update dynamic tail
      if (tFrame % 2 === 0) {"""
tail_new = """      // Update dynamic tail
      if (tFrame % 2 === 0 && showTrailCb && showTrailCb.checked) {"""
content = content.replace(tail_old, tail_new)

# 3. Update Anomaly scrubbing behavior in animation loop
angStep_old = """      // Angular speed proportional to 1/r² (Kepler 2nd law)
      const angStep = dt * 0.000015 * (2.2 / Math.max(dist2Sun, 0.1));
      if (e < 1) {
        orbitTheta = (orbitTheta + angStep) % 1;
      } else {
        if (orbitTheta < 1) orbitTheta += angStep * 0.7;
      }"""
angStep_new = """      // Angular speed proportional to 1/r² (Kepler 2nd law)
      // M0_multiplier changes the speed according to Kepler's third law (v ~ sqrt(M))
      const timeScale = Math.sqrt(M0_multiplier);
      const angStep = dt * 0.000015 * (2.2 / Math.max(dist2Sun, 0.1)) * timeScale;
      
      // If simSpeed is 0, we rely on the manual scrubber (orbitTheta stays static)
      if (simSpeed > 0) {
        if (e < 1) {
          orbitTheta = (orbitTheta + angStep) % 1;
        } else {
          if (orbitTheta < 1) orbitTheta += angStep * 0.7;
        }
        if (trueAnomalySlider && trueAnomalyValSpan) {
           trueAnomalySlider.value = orbitTheta * 360;
           trueAnomalyValSpan.textContent = Math.round(orbitTheta * 360);
        }
      }"""
content = content.replace(angStep_old, angStep_new)

with open("trajectory/trajectory.js", "w") as f:
    f.write(content)
