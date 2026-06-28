with open("trajectory/trajectory.js", "r") as f:
    content = f.read()

import re

# 1. Update DOM References
dom_refs_old = """const eccSlider   = document.getElementById('eccentricity');
const aSlider     = document.getElementById('semiMajor');
const speedSlider = document.getElementById('simSpeed');
const eValSpan    = document.getElementById('eVal');
const aValSpan    = document.getElementById('aVal');
const speedValSpan = document.getElementById('speedVal');
const distValEl   = document.getElementById('distVal');
const velValEl    = document.getElementById('velVal');
const periodValEl = document.getElementById('periodVal');
const badge       = document.getElementById('orbitTypeBadge');
const showVecCb   = document.getElementById('showVectors');"""

dom_refs_new = """const eccSlider   = document.getElementById('eccentricity');
const aSlider     = document.getElementById('semiMajor');
const speedSlider = document.getElementById('simSpeed');
const eValSpan    = document.getElementById('eVal');
const aValSpan    = document.getElementById('aVal');
const speedValSpan = document.getElementById('speedVal');
const distValEl   = document.getElementById('distVal');
const velValEl    = document.getElementById('velVal');
const periodValEl = document.getElementById('periodVal');
const badge       = document.getElementById('orbitTypeBadge');
const showVecCb   = document.getElementById('showVectors');

// New DOM Refs
const incSlider = document.getElementById('inclination');
const nodeSlider = document.getElementById('ascendingNode');
const argSlider = document.getElementById('argPeriapsis');
const incValSpan = document.getElementById('iVal');
const nodeValSpan = document.getElementById('nodeVal');
const argValSpan = document.getElementById('argVal');
const centralMassSelect = document.getElementById('centralMass');
const showPlaneCb = document.getElementById('showPlane');
const showTrailCb = document.getElementById('showTrail');
const trueAnomalySlider = document.getElementById('trueAnomaly');
const trueAnomalyValSpan = document.getElementById('thetaVal');
"""
content = content.replace(dom_refs_old, dom_refs_new)

# 2. Update Physics Constants to be variables
constants_old = """const G = 6.67430e-11;
const M0 = 1.98847e30;
const r0 = 1.47095e11;
const v0 = 3.029195106e4;
const SF = 1e-10; // scale factor: 1 THREE unit = 1e10 m"""

constants_new = """const G = 6.67430e-11;
let M0_multiplier = 1;
let M0 = 1.98847e30 * M0_multiplier;
const r0 = 1.47095e11;
const v0 = 3.029195106e4;
const SF = 1e-10; // scale factor: 1 THREE unit = 1e10 m"""
content = content.replace(constants_old, constants_new)

# 3. Add Listeners for new UI
listeners_old = """eccSlider.addEventListener('input', () => {
  eValSpan.textContent = parseFloat(eccSlider.value).toFixed(3);
  buildAndSetOrbit();
});
aSlider.addEventListener('input', () => {
  aValSpan.textContent = parseFloat(aSlider.value).toFixed(1);
  buildAndSetOrbit();
});
speedSlider.addEventListener('input', () => {
  speedValSpan.textContent = parseFloat(speedSlider.value).toFixed(1) + 'x';
});"""

listeners_new = listeners_old + """
incSlider.addEventListener('input', () => { incValSpan.textContent = incSlider.value; buildAndSetOrbit(); });
nodeSlider.addEventListener('input', () => { nodeValSpan.textContent = nodeSlider.value; buildAndSetOrbit(); });
argSlider.addEventListener('input', () => { argValSpan.textContent = argSlider.value; buildAndSetOrbit(); });
centralMassSelect.addEventListener('change', () => {
  M0_multiplier = parseFloat(centralMassSelect.value);
  M0 = 1.98847e30 * M0_multiplier;
  buildAndSetOrbit();
});
showPlaneCb.addEventListener('change', () => {
  if (orbitalPlaneMesh) orbitalPlaneMesh.visible = showPlaneCb.checked;
});
trueAnomalySlider.addEventListener('input', () => {
  trueAnomalyValSpan.textContent = trueAnomalySlider.value;
  // Convert true anomaly (0-360) to orbital param t (0-1) for our spline
  orbitTheta = parseFloat(trueAnomalySlider.value) / 360.0;
});
"""
content = content.replace(listeners_old, listeners_new)

# 4. Add new Presets
presets_old = """document.getElementById('preEarth').addEventListener('click', () => {
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
});"""

presets_new = presets_old + """
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
});
"""
content = content.replace(presets_old, presets_new)

# 5. Make orbit computation 3D aware
orbit_pts_old = """function buildOrbitPoints(a_au, e, n = 900) {
  const a = a_au * 1.496e11; // AU → m
  const pts = [];
  if (e < 0.999) {
    // Ellipse
    const cx = -a * e;
    const b  = a * Math.sqrt(1 - e * e);
    for (let i = 0; i < n; i++) {
      const t = (i / n) * 2 * Math.PI;
      pts.push(new THREE.Vector3((cx + a * Math.cos(t)) * SF, 0, b * Math.sin(t) * SF));
    }
  } else if (e < 1.001) {
    // Parabola
    const p = a;
    const tMax = 2.8;
    for (let i = 0; i <= n; i++) {
      const t = (i / n) * 2 * tMax - tMax;
      const rr = p / (1 + Math.cos(t));
      if (rr > 0 && rr < 2e13) pts.push(new THREE.Vector3(rr * Math.cos(t) * SF, 0, rr * Math.sin(t) * SF));
    }
  } else {
    // Hyperbola
    const tMax = Math.min(Math.acos(-1 / e) * 0.93, Math.PI * 0.9);
    const p = a * (e * e - 1);
    for (let i = 0; i <= n; i++) {
      const t = (i / n) * 2 * tMax - tMax;
      const rr = p / (1 + e * Math.cos(t));
      if (rr > 0 && rr < 2e13) pts.push(new THREE.Vector3(rr * Math.cos(t) * SF, 0, rr * Math.sin(t) * SF));
    }
  }
  return pts;
}"""

orbit_pts_new = """function buildOrbitPoints(a_au, e, n = 900) {
  const a = a_au * 1.496e11; // AU → m
  const pts = [];
  
  // 3D Orbital Elements
  const inc = parseFloat(incSlider.value) * (Math.PI / 180);
  const node = parseFloat(nodeSlider.value) * (Math.PI / 180);
  const argP = parseFloat(argSlider.value) * (Math.PI / 180);

  // Rotation Euler for the entire orbital plane
  const euler = new THREE.Euler(inc, node, argP, 'YXZ');

  if (e < 0.999) {
    // Ellipse
    const cx = -a * e;
    const b  = a * Math.sqrt(1 - e * e);
    for (let i = 0; i < n; i++) {
      const t = (i / n) * 2 * Math.PI;
      let vec = new THREE.Vector3((cx + a * Math.cos(t)) * SF, 0, b * Math.sin(t) * SF);
      vec.applyEuler(euler);
      pts.push(vec);
    }
  } else if (e < 1.001) {
    // Parabola
    const p = a;
    const tMax = 2.8;
    for (let i = 0; i <= n; i++) {
      const t = (i / n) * 2 * tMax - tMax;
      const rr = p / (1 + Math.cos(t));
      if (rr > 0 && rr < 2e13) {
        let vec = new THREE.Vector3(rr * Math.cos(t) * SF, 0, rr * Math.sin(t) * SF);
        vec.applyEuler(euler);
        pts.push(vec);
      }
    }
  } else {
    // Hyperbola
    const tMax = Math.min(Math.acos(-1 / e) * 0.93, Math.PI * 0.9);
    const p = a * (e * e - 1);
    for (let i = 0; i <= n; i++) {
      const t = (i / n) * 2 * tMax - tMax;
      const rr = p / (1 + e * Math.cos(t));
      if (rr > 0 && rr < 2e13) {
        let vec = new THREE.Vector3(rr * Math.cos(t) * SF, 0, rr * Math.sin(t) * SF);
        vec.applyEuler(euler);
        pts.push(vec);
      }
    }
  }
  return pts;
}"""
content = content.replace(orbit_pts_old, orbit_pts_new)

# 6. Orbital Plane Mesh and grid updates
plane_old = """let orbitPath = null;

function buildAndSetOrbit() {"""

plane_new = """let orbitPath = null;
let orbitalPlaneMesh = null;

function buildAndSetOrbit() {"""
content = content.replace(plane_old, plane_new)

plane_rm_old = """  // Remove old orbit line and grid
  if (orbitLine) { scene.remove(orbitLine); orbitLine.geometry.dispose(); orbitLine = null; }
  if (gridHelper) { scene.remove(gridHelper); gridHelper.geometry.dispose(); gridHelper = null; }"""
  
plane_rm_new = """  // Remove old orbit line, plane and grid
  if (orbitLine) { scene.remove(orbitLine); orbitLine.geometry.dispose(); orbitLine = null; }
  if (gridHelper) { scene.remove(gridHelper); gridHelper.geometry.dispose(); gridHelper = null; }
  if (orbitalPlaneMesh) { scene.remove(orbitalPlaneMesh); orbitalPlaneMesh.geometry.dispose(); orbitalPlaneMesh = null; }"""
content = content.replace(plane_rm_old, plane_rm_new)

grid_pts_old = """        gridPts.push(new THREE.Vector3(x, 0, -z));
        gridPts.push(new THREE.Vector3(x, 0, z));"""
grid_pts_new = """        let v1 = new THREE.Vector3(x, 0, -z); let v2 = new THREE.Vector3(x, 0, z);
        const inc = parseFloat(incSlider.value) * (Math.PI/180);
        const node = parseFloat(nodeSlider.value) * (Math.PI/180);
        const argP = parseFloat(argSlider.value) * (Math.PI/180);
        const euler = new THREE.Euler(inc, node, argP, 'YXZ');
        v1.applyEuler(euler); v2.applyEuler(euler);
        gridPts.push(v1); gridPts.push(v2);"""
content = content.replace(grid_pts_old, grid_pts_new)

grid_pts_old2 = """        gridPts.push(new THREE.Vector3(cx - x_len, 0, z));
        gridPts.push(new THREE.Vector3(cx + x_len, 0, z));"""
grid_pts_new2 = """        let v1 = new THREE.Vector3(cx - x_len, 0, z); let v2 = new THREE.Vector3(cx + x_len, 0, z);
        const inc = parseFloat(incSlider.value) * (Math.PI/180);
        const node = parseFloat(nodeSlider.value) * (Math.PI/180);
        const argP = parseFloat(argSlider.value) * (Math.PI/180);
        const euler = new THREE.Euler(inc, node, argP, 'YXZ');
        v1.applyEuler(euler); v2.applyEuler(euler);
        gridPts.push(v1); gridPts.push(v2);"""
content = content.replace(grid_pts_old2, grid_pts_new2)

with open("trajectory/trajectory.js", "w") as f:
    f.write(content)
